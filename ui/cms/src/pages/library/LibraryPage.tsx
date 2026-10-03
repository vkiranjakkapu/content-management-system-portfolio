import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type SubmitEvent,
} from "react";
import type { ErrorResponse } from "../../api/api";
import ActionButton from "../../components/ActionButtonComponent";
import SelectComponent from "../../components/formelements/SelectComponent";
import ModalComponent from "../../components/ModalComponent";
import Notification from "../../components/notifications/Notification";
import { useNotifications } from "../../components/notifications/useNotifications";
import usePagination from "../../components/pagination/usePagination";
import SectionLayoutComponent from "../../components/SectionLayoutComponent";
import SpinnerComponent from "../../components/SpinnerComponent";
import { MediaTag, type Media } from "../../services/DtoModels";
import MediaService, { UploadStatus } from "../../services/MediaService";
import { DateFormatter } from "../../utils/DateFormatter";
import MasonryComponent from "./MasonryComponent";
import useFilePreview from "./useFilePreview";

export default function LibraryPage() {
    const { notifications, setNotifications, resetNotifications } =
        useNotifications(["fetch", "upload", "update"]);

    const fetchNotifications = notifications["fetch"] ?? null;
    const uploadNotifications = notifications["upload"] ?? null;
    const updateNotifications = notifications["update"] ?? null;

    const [allResources, setAllResources] = useState<Media[]>([]);
    const [emptyProfile, setEmptyProfile] = useState<boolean>(true);

    const [fetchProgress, setFetchProgress] = useState<boolean>(true);
    const [actionProgress, setActionProgress] = useState<boolean>(false);

    const fetchMedia = useCallback((resources: Media[]) => {
        if (resources.length == 0) return;

        MediaService.fetchMediaByList<Map<string, Blob>>({
            ids: resources.map((md) => md.id),
        })
            .then((resp) => {
                resources.map((md) => ({ ...md, media: resp.data.get(md.id) }));
            })
            .catch((e: ErrorResponse) => {
                console.log(e.errorMessage);
            })
            .finally(() => {
                setFetchProgress(false);
            });
    }, []);

    const fetchResources = useCallback(() => {
        MediaService.getMedia<Media[]>()
            .then((resp) => {
                setAllResources(resp.data);
                fetchMedia(resp.data);
                setEmptyProfile(false);
            })
            .catch((e: ErrorResponse) => {
                if (e.errorCode === "BUS-2001") {
                    setEmptyProfile(true);
                }
                setNotifications("fetch", {
                    type: "info",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setFetchProgress(false);
            });
    }, [setNotifications, fetchMedia]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const [mediaCategories, setMediaCategories] = useState<MediaTag[]>([]);

    const queryResults = useMemo(() => {
        if (mediaCategories.length == 0) {
            return allResources;
        }

        const results = allResources.filter((md) =>
            mediaCategories.includes(md.tag),
        );

        return results;
    }, [mediaCategories, allResources]);

    const pagination = usePagination(queryResults, 100);

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
        "new" | "edit" | "preview" | null
    >(null);
    const [handlingResource, setHandlingResource] = useState<Media | null>(
        null,
    );

    function deleteResource(media: Media) {
        if (window.confirm(`Delete '@${media.mediaName}'?`)) {
            MediaService.deleteMedia(media.id).then(() => {
                window.alert(`@${media.mediaName} deleted successfully.`);
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
            const uploadPromises = previews.map(async (item) => {
                updatePreviews((prev) =>
                    prev.map((upItem) =>
                        upItem.id === item.id
                            ? {
                                  ...upItem,
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
                                upItem.file === item.file
                                    ? { ...upItem, progress }
                                    : upItem,
                            ),
                        );
                    },
                )
                    .then((resp) => {
                        updatePreviews((prev) =>
                            prev.map((upItem) =>
                                upItem.file === item.file
                                    ? {
                                          ...upItem,
                                          status: UploadStatus.SUCCESS,
                                      }
                                    : upItem,
                            ),
                        );

                        setAllResources((prev) => [...prev, resp.data]);
                    })
                    .catch((err: ErrorResponse) => {
                        updatePreviews((prev) =>
                            prev.map((upItem) =>
                                upItem.file === item.file
                                    ? {
                                          ...upItem,
                                          status: "error",
                                          error: err.errorMessage,
                                          uploadStatus: UploadStatus.FAILURE,
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
                            setResourceModalType("new");
                        },
                        disabled: emptyProfile,
                    },
                ]}
                spinner={{
                    isLoading: fetchProgress,
                    text: "Fetching Your Media...",
                }}
                categorySearch={
                    allResources.length > 0
                        ? {
                              emptyOption: "Category",
                              options: Object.keys(MediaTag).map((cat) => ({
                                  value: cat,
                              })),
                              onChange(e) {
                                  const cat = e.target.value as MediaTag;
                                  const allTags = mediaCategories.includes(cat)
                                      ? mediaCategories.filter((c) => cat !== c)
                                      : mediaCategories.concat([cat]);

                                  setMediaCategories(allTags);
                              },
                          }
                        : undefined
                }
                pagination={pagination}
            >
                <div className="space-y-3">
                    {fetchNotifications && (
                        <div className="">
                            <Notification
                                type={fetchNotifications?.type}
                                messages={fetchNotifications?.messages}
                            />
                        </div>
                    )}
                    <MasonryComponent
                        resources={pagination.currentItems}
                        handleEdit={(media) => {
                            setResourceModalType("edit");
                            setHandlingResource(media);
                        }}
                        handleDelete={deleteResource}
                        handleImageClick={(media) => {
                            setHandlingResource(media);
                            setResourceModalType("preview");
                        }}
                    />
                </div>
            </SectionLayoutComponent>

            <ModalComponent
                title={
                    resourceModalType == "new"
                        ? "Uplaod Resources"
                        : resourceModalType == "edit"
                          ? "Edit Resource"
                          : `@${handlingResource?.mediaName}`
                }
                isOpen={resourceModalType != null}
                onClose={() => {
                    setResourceModalType(null);
                }}
                maxWidthClass="max-w-6xl"
            >
                {resourceModalType === "preview" ? (
                    <div className="space-y-3">
                        <h2>
                            {handlingResource?.mediaName}{" "}
                            {handlingResource?.tag && (
                                <span className="px-2 py-1 tsxt-sm bg-primary text-white rounded-md">
                                    {handlingResource?.tag}
                                </span>
                            )}
                        </h2>
                        {handlingResource?.createdAt && (
                            <p className="text-sm">
                                Uploaded on :{" "}
                                {DateFormatter.toFormattedDate(
                                    handlingResource?.createdAt,
                                )}
                            </p>
                        )}
                        <img
                            src={URL.createObjectURL(handlingResource!.media)}
                            className="block w-full rounded-md"
                        />
                    </div>
                ) : (
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
                                className="w-2/3 md:w-2/5"
                                required
                            />

                            {resourceModalType === "edit" && (
                                <ActionButton
                                    type="submit"
                                    icon={ArrowUpTrayIcon}
                                    text="Confirm"
                                    className="ms-auto"
                                    spinner={{
                                        isLoading: actionProgress,
                                        size: "border-t-yellow-600! size-4",
                                    }}
                                    disabled={allResources.length == 0}
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
                                    {previewInProgress && (
                                        <SpinnerComponent
                                            text={`Loading previews (${loadedCount}/${previews.length})`}
                                            animate="animate-pulse"
                                        />
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
                                        disabled={allResources.length == 0}
                                    />
                                </div>
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
                                <div>
                                    <img
                                        src={URL.createObjectURL(
                                            handlingResource!.media,
                                        )}
                                        alt={handlingResource!.mediaName}
                                    />
                                </div>
                            )
                        )}
                    </form>
                )}
            </ModalComponent>
        </>
    );
}
