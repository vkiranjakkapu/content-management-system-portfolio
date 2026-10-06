import { ArrowUpTrayIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type SubmitEvent,
} from "react";
import type { ErrorResponse } from "../../api/api";
import ActionButton from "../../components/ActionButtonComponent";
import SelectComponent from "../../components/formelements/SelectComponent";
import ModalComponent from "../../components/ModalComponent";
import Notification from "../../components/notifications/Notification";
import { useNotifications } from "../../components/notifications/useNotifications";
import SectionLayoutComponent from "../../components/SectionLayoutComponent";
import SpinnerComponent from "../../components/SpinnerComponent";
import { MediaTag, type Media } from "../../services/DtoModels";
import MediaService, { UploadStatus } from "../../services/MediaService";
import { DateFormatter } from "../../utils/DateFormatter";
import { getMediaSize } from "../../utils/FilesHelper";
import MasonryComponent from "./MasonryComponent";
import useFilePreview from "./useFilePreview";

export default function LibraryPage() {
    const { notifications, setNotifications, resetNotifications } =
        useNotifications(["info", "upload", "update"]);

    const fetchNotifications = notifications["info"] ?? null;
    const uploadNotifications = notifications["upload"] ?? null;
    const updateNotifications = notifications["update"] ?? null;

    const [allResources, setAllResources] = useState<Media[]>([]);
    const [emptyProfile, setEmptyProfile] = useState<boolean>(true);

    const [fetchProgress, setFetchProgress] = useState<boolean>(true);
    const [actionProgress, setActionProgress] = useState<boolean>(false);

    const fetchResources = useCallback(() => {
        MediaService.getMedia<Media[]>()
            .then((resp) => {
                const resources = resp.data;
                if (resources.length > 0) {
                    MediaService.fetchMediaByList<Record<string, Blob>>({
                        ids: resources.map((md) => md.id),
                    })
                        .then((resp) => {
                            const mediaMap = resp.data;
                            const updatedResources = resources.map((md) => ({
                                ...md,
                                media: mediaMap[md.id]!,
                            }));
                            setAllResources(updatedResources);
                        })
                        .finally(() => {
                            setFetchProgress(false);
                            setEmptyProfile(false);
                        });
                } else {
                    setEmptyProfile(false);
                    setFetchProgress(false);
                }
            })
            .catch((e: ErrorResponse) => {
                setFetchProgress(false);
                if (e.errorCode === "BUS-2001") {
                    setEmptyProfile(true);
                }
                if (e.errorCode === "500") {
                    setNotifications("info", {
                        type: "error",
                        messages: [
                            "We are facing unexpected issues, Please try again later.",
                        ],
                    });
                    return;
                }
                setNotifications("info", {
                    type: "info",
                    messages: [e.errorMessage],
                });
            });
    }, [setNotifications]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    // * Uploads handling
    const {
        previews,
        previewInProgress,
        loadedCount,
        updatePreviews,
        handleLoadComplete,
        handlePreviews,
        clearPreviews,
    } = useFilePreview();

    const [resourceModalType, setResourceModalType] = useState<
        "new" | "edit" | null
    >(null);
    const [handlingResource, setHandlingResource] = useState<Media | null>(
        null,
    );

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    function deleteResource(media: Media) {
        if (window.confirm(`Delete '@${media.mediaName}'?`)) {
            MediaService.deleteMedia(media.id)
                .then(() => {
                    setAllResources((prev) =>
                        prev.filter((md) => md.id != media.id),
                    );
                    setHandlingResource(null);
                    setNotifications("info", {
                        type: "success",
                        messages: [`@${media.mediaName} deleted successfully.`],
                    });
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    timeoutRef.current = setTimeout(() => {
                        setNotifications("info", null);
                    }, 7000);
                })
                .catch((e: ErrorResponse) => {
                    setNotifications("info", {
                        type: "error",
                        messages: [e.errorMessage],
                    });
                });
        }
    }

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const tag = formData.get("tag") as MediaTag;
        if (!validateRequest(tag)) {
            return;
        }

        setActionProgress(true);

        if (resourceModalType === "new") {
            resetNotifications("upload");

            updatePreviews((prev) =>
                prev.map((upItem) =>
                    upItem.file.name.length > 100
                        ? { ...upItem, error: "Filename too long." }
                        : upItem,
                ),
            );

            let totalUploaded = 0;

            const uploadPromises = previews
                .filter((prv) => prv.file.name.length < 100)
                .map(async (item) => {
                    updatePreviews((prev) =>
                        prev.map((upItem) =>
                            upItem.id === item.id
                                ? {
                                      ...upItem,
                                      progress: {
                                          loaded: 0,
                                          total: upItem.file.size,
                                          percentage: 0,
                                      },
                                      uploadStatus: UploadStatus.UPLOADING,
                                  }
                                : upItem,
                        ),
                    );

                    MediaService.createMedia<Media>(
                        {
                            file: item.file,
                            tag: tag!,
                        },
                        (progress) => {
                            updatePreviews((prev) =>
                                prev.map((upItem) =>
                                    upItem.id === item.id
                                        ? { ...upItem, progress }
                                        : upItem,
                                ),
                            );
                        },
                    )
                        .then((resp) => {
                            updatePreviews((prev) =>
                                prev.map((upItem) => {
                                    if (upItem.id == item.id) {
                                        return {
                                            ...upItem,
                                            uploadStatus: UploadStatus.SUCCESS,
                                        };
                                    }
                                    return upItem;
                                }),
                            );

                            setAllResources((prev) => [resp.data, ...prev]);
                            totalUploaded += 1;
                            setNotifications("upload", {
                                type: "success",
                                messages: [
                                    `Uploading (${totalUploaded}/${previews.length}) Completed.`,
                                ],
                            });
                        })
                        .catch((err: ErrorResponse) => {
                            updatePreviews((prev) =>
                                prev.map((upItem) =>
                                    upItem.id === item.id
                                        ? {
                                              ...upItem,
                                              status: "error",
                                              error: err.errorMessage,
                                              uploadStatus:
                                                  UploadStatus.FAILURE,
                                          }
                                        : upItem,
                                ),
                            );
                        });
                });
            await Promise.allSettled(uploadPromises).then(() => {
                setActionProgress(false);
            });

            return;
        }

        resetNotifications("update");
        MediaService.updateMedia<Media>({
            id: handlingResource!.id,
            tag: tag!,
        })
            .then((resp) => {
                setHandlingResource(resp.data);
                setAllResources((prev) =>
                    prev.map((rsc) =>
                        rsc.id == resp.data.id ? resp.data : rsc,
                    ),
                );
                setNotifications("update", {
                    type: "success",
                    messages: [`Tag Updated Successfully to ${tag}`],
                });
            })
            .catch((e: ErrorResponse) => {
                setNotifications("update", {
                    type: "error",
                    messages:
                        e.validationErrors.length > 0
                            ? e.validationErrors.map(
                                  (ve) => `${ve.field} ${ve.message}`,
                              )
                            : [e.errorMessage],
                });
            })
            .finally(() => {
                setActionProgress(false);
            });
    }

    function validateRequest(tag?: MediaTag) {
        const errors = [];

        if (resourceModalType === "new" || resourceModalType === "edit") {
            if (!tag) {
                errors.push("Tag is required to save media.");
            }
        } else {
            return false;
        }

        if (resourceModalType === "new" && previews.length == 0) {
            errors.push("No media was selected to upload.");
        }

        if (resourceModalType === "edit" && !handlingResource?.id) {
            errors.push("Unidentified resource selected.");
        }

        if (errors.length > 0) {
            setNotifications(
                resourceModalType === "new" ? "upload" : "update",
                {
                    type: "error",
                    messages: errors,
                },
            );
        }

        return errors.length == 0;
    }

    return (
        <>
            <SectionLayoutComponent
                title="Library"
                description="Manage Images and resources from this page."
                actionEvents={[
                    {
                        icon: ArrowUpTrayIcon,
                        text: "Upload",
                        onClick() {
                            setNotifications("upload", null);
                            setResourceModalType("new");
                        },
                        disabled: emptyProfile,
                    },
                ]}
                spinner={{
                    isLoading: fetchProgress,
                    text: "Fetching Your Media...",
                }}
            >
                <div className="space-y-3">
                    {fetchNotifications && (
                        <>
                            <div className="">
                                <Notification
                                    type={fetchNotifications?.type}
                                    messages={fetchNotifications?.messages}
                                />
                            </div>
                            <hr className="border-t" />
                        </>
                    )}
                    <MasonryComponent
                        spinner={{
                            isLoading: fetchProgress,
                        }}
                        resources={allResources}
                        handleEdit={(media) => {
                            setResourceModalType("edit");
                            setHandlingResource(media);
                            resetNotifications();
                        }}
                        handleDelete={(media) => {
                            deleteResource(media);
                            resetNotifications();
                        }}
                        searchOptions={Object.keys(MediaTag).map((cat) => ({
                            value: cat as MediaTag,
                        }))}
                    />
                </div>
            </SectionLayoutComponent>

            <ModalComponent
                title={
                    resourceModalType == "new"
                        ? "Uplaod Resources"
                        : resourceModalType == "edit"
                          ? "Update Resource Tag"
                          : `@${handlingResource?.mediaName}`
                }
                isOpen={resourceModalType != null}
                onClose={() => {
                    setResourceModalType(null);
                    updatePreviews([]);
                }}
                maxWidthClass="max-w-6xl"
            >
                <form onSubmit={handleSubmit} className="p-1 space-y-3">
                    {uploadNotifications && (
                        <Notification
                            type={uploadNotifications?.type}
                            messages={uploadNotifications?.messages}
                        />
                    )}
                    {updateNotifications && (
                        <Notification
                            type={updateNotifications?.type}
                            messages={updateNotifications?.messages}
                        />
                    )}

                    <div className="flex items-center justify-between">
                        {/* Select Tag */}
                        <SelectComponent
                            options={Object.keys(MediaTag).map((tag) => ({
                                value: tag,
                            }))}
                            name="tag"
                            emptyOption="Select Tag"
                            onChange={(e) => {
                                const tag = e.target.value;
                                if (tag == "") {
                                    setHandlingResource((prev) =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  tag: tag as MediaTag,
                                              }
                                            : null,
                                    );
                                }
                            }}
                            defaultValue={
                                resourceModalType == "edit"
                                    ? handlingResource?.tag
                                    : ""
                            }
                            className="w-2/3 md:w-2/5"
                            required
                        />

                        {resourceModalType === "edit" && (
                            <ActionButton
                                type="submit"
                                icon={CheckBadgeIcon}
                                text="Update Tag"
                                className="ms-auto"
                                spinner={{
                                    isLoading: actionProgress,
                                    size: "border-t-yellow-600! size-4",
                                }}
                                disabled={emptyProfile}
                            />
                        )}
                    </div>
                    {resourceModalType === "new" ? (
                        <>
                            {/* Upload */}
                            <div
                                onClick={(e) => {
                                    (
                                        e.currentTarget
                                            .lastChild as HTMLInputElement
                                    ).click();
                                }}
                                className="cursor-pointer h-30 bg-background dark:bg-gray-900 outline-2 outline-dashed -outline-offset-2 outline-primary/30 dark:outline-background-secondary/30 hover:outline-offset-0 rounded-md flex items-center justify-center"
                            >
                                <h3 className="flex items-center gap-1">
                                    <ArrowUpTrayIcon className="size-4" />
                                    Upload your resource
                                </h3>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handlePreviews}
                                    multiple
                                />
                            </div>

                            {/* Previews */}
                            <hr className="border-t" />
                            <div className="flex flex-wrap items-center justify-between">
                                {previews.length > 0 && (
                                    <h2 className="text-center capitalize">
                                        Preview and Confirm to upload.
                                    </h2>
                                )}
                                <ActionButton
                                    type="submit"
                                    icon={ArrowUpTrayIcon}
                                    text="Confirm"
                                    className="ms-auto"
                                    spinner={{
                                        isLoading: actionProgress,
                                        size: "border-t-yellow-600! size-4",
                                    }}
                                    disabled={emptyProfile}
                                />
                            </div>
                            {previewInProgress && (
                                <>
                                    <hr className="border-t" />
                                    <SpinnerComponent
                                        text={`Loading previews (${loadedCount}/${previews.length})`}
                                        animate="animate-pulse"
                                    />
                                </>
                            )}
                            {previews.length > 0 && (
                                <>
                                    <hr className="border-t" />
                                    <MasonryComponent
                                        resources={previews}
                                        isPreview={true}
                                        handleDiscard={(idx) => {
                                            clearPreviews(idx);
                                        }}
                                        handleOnLoad={handleLoadComplete}
                                    />
                                </>
                            )}
                        </>
                    ) : (
                        resourceModalType === "edit" && (
                            <>
                                <hr />
                                <div className="relative">
                                    <img
                                        src={`data:${handlingResource?.mediaType};base64,${handlingResource?.media}`}
                                        alt={handlingResource!.mediaName}
                                        className="rounded"
                                    />
                                    <div className="absolute inset-0 p-4 space-y-2">
                                        <p className="w-fit bg-section-theme p-1 rounded">
                                            <b className="text-sm">
                                                FileName:{" "}
                                            </b>
                                            {handlingResource?.mediaName}
                                        </p>
                                        <p className="w-fit bg-section-theme p-1 rounded text-sm">
                                            <b>Size: </b>(
                                            {getMediaSize(
                                                handlingResource!.media,
                                            )}
                                            ) &nbsp;&nbsp;
                                            <b>Uploaded On: </b>
                                            {DateFormatter.toFormattedDate(
                                                handlingResource?.createdAt,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )
                    )}
                </form>
            </ModalComponent>
        </>
    );
}
