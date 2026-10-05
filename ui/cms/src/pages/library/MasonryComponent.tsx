import {
    ArrowUpTrayIcon,
    CheckCircleIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import ActionButton from "../../components/ActionButtonComponent";
import Notification, {
    type NotificationProps,
} from "../../components/notifications/Notification";
import SpinnerComponent, {
    type SpinnerComponentProps,
} from "../../components/SpinnerComponent";
import { MediaTag, type Media } from "../../services/DtoModels";
import MediaService, { UploadStatus } from "../../services/MediaService";
import { formatBytes, getMediaSize } from "../../utils/FilesHelper";
import type { Preview } from "./useFilePreview";

import { useMemo, useState } from "react";
import type { ErrorResponse } from "../../api/api";
import Landscape from "../../assets/landscape.png";
import SelectComponent from "../../components/formelements/SelectComponent";
import ModalComponent from "../../components/ModalComponent";
import { PaginationButtons } from "../../components/pagination/PaginationButtons";
import usePagination from "../../components/pagination/usePagination";
import { DateFormatter } from "../../utils/DateFormatter";

type MasonryComponentProps = {
    resources: Media[] | Preview[];
    isPreview?: boolean;

    allowUpload?: boolean;
    handleNewUpload?: (media: Media) => void;

    searchOptions?: {
        value: MediaTag;
        text?: string;
    }[];
    spinner?: SpinnerComponentProps;

    handleImageClick?: (media: Media) => void;
    handleEdit?: (media: Media) => void;
    handleDelete?: (media: Media) => void;

    handleOnLoad?: () => void;
    handleDiscard?: (index: number) => void;
};

export default function MasonryComponent({
    resources,
    isPreview = false,
    searchOptions,
    spinner,
    allowUpload = false,
    handleNewUpload,
    handleImageClick,
    handleEdit,
    handleDelete,
    handleOnLoad,
    handleDiscard,
}: MasonryComponentProps) {
    const [preview, setPreviewModal] = useState<Media | Preview | null>(null);

    const [category, setCategory] = useState<MediaTag | string | null>(null);

    const queryResults = useMemo(() => {
        if (category == "" || category == null || isPreview) {
            return resources;
        }

        const results = resources.filter((md) => (md as Media).tag == category);

        return results;
    }, [resources, category, isPreview]);

    const pagination = usePagination<Media | Preview>(queryResults, 10);

    // * Upload Handling
    const [uploadNotifications, setUploadNotifications] =
        useState<NotificationProps | null>(null);

    const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);

    const [upload, setUpload] = useState<{
        preview: Preview;
        tag?: MediaTag;
    } | null>(null);

    function uploadResource() {
        if (!upload) {
            return;
        }

        setUploadInProgress(true);
        setUploadNotifications(null);

        const tag = upload.tag;

        if (!tag) {
            setUploadNotifications({
                type: "error",
                messages: [
                    "Tag is required to upload. Please select one before.",
                ],
            });
            setUpload((prev) =>
                prev
                    ? {
                          ...prev,
                          preview: {
                              ...prev.preview,
                              error: "Tag is required",
                          },
                      }
                    : null,
            );
            return;
        }

        if (upload.preview.file.name.length > 100) {
            setUploadNotifications({
                type: "error",
                messages: ["Filename too long. Rename and try upload again."],
            });
            setUpload((prev) =>
                prev
                    ? {
                          ...prev,
                          preview: {
                              ...prev.preview,
                              error: "Filename too long",
                          },
                      }
                    : null,
            );
            return;
        }

        setUpload((prev) =>
            prev ? { ...prev, uploadStatus: UploadStatus.UPLOADING } : null,
        );

        MediaService.createMedia<Media>(
            { file: upload.preview.file, tag },
            (progress) => {
                setUpload((prev) => (prev ? { ...prev, progress } : null));
            },
        )
            .then((resp) => {
                setUploadNotifications({
                    type: "success",
                    messages: [
                        `@${resp.data.mediaName} Uploaded Successfully.`,
                    ],
                });
                setUpload(null);
                handleNewUpload?.(resp.data);
            })
            .catch((e: ErrorResponse) => {
                console.log(e);

                setUploadNotifications({
                    type: "error",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setUploadInProgress(false);
            });
    }

    return spinner && spinner.isLoading ? (
        <SpinnerComponent {...spinner} />
    ) : resources.length > 0 ? (
        <>
            <div className="*:not-last:pb-2 space-y-2 divide-y">
                {!isPreview && (
                    <>
                        {uploadNotifications && (
                            <div>
                                <Notification
                                    type={uploadNotifications.type}
                                    messages={uploadNotifications.messages}
                                />
                            </div>
                        )}
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex-1 flex items-center justify-between gap-4 ">
                                <SelectComponent
                                    options={
                                        searchOptions
                                            ? searchOptions
                                            : Array.from(
                                                  new Set(
                                                      resources.map(
                                                          (md) =>
                                                              (md as Media).tag,
                                                      ),
                                                  ),
                                              ).map((tag) => ({
                                                  value: tag,
                                              }))
                                    }
                                    emptyOption="All Media"
                                    id="select-category"
                                    className="w-full sm:w-3/5 md:w-2/5 lg:w-1/3"
                                    onChange={(e) => {
                                        setCategory(e.target.value as MediaTag);
                                    }}
                                />

                                {allowUpload && (
                                    <div>
                                        <ActionButton
                                            text="Upload"
                                            icon={ArrowUpTrayIcon}
                                            onClick={(e) => {
                                                (
                                                    e.currentTarget
                                                        .nextSibling as HTMLElement
                                                ).click();
                                            }}
                                        />
                                        <input
                                            type="file"
                                            name="uploadResource"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (
                                                    !e.target.files ||
                                                    e.target.files.length == 0
                                                ) {
                                                    if (upload != null) {
                                                        URL.revokeObjectURL(
                                                            upload.preview
                                                                .media,
                                                        );
                                                    }
                                                    setUpload(null);
                                                    return;
                                                }

                                                if (upload != null) {
                                                    URL.revokeObjectURL(
                                                        upload.preview.media,
                                                    );
                                                }

                                                const file = e.target.files[0];
                                                const prv = {
                                                    file,
                                                    progress: {
                                                        loaded: 0,
                                                        percentage: 0,
                                                        total: file.size,
                                                    },
                                                    uploadStatus:
                                                        UploadStatus.PREVIEW,
                                                    media: URL.createObjectURL(
                                                        file,
                                                    ),
                                                    error:
                                                        file.name.length > 100
                                                            ? "Filename too long."
                                                            : undefined,
                                                } as Preview;
                                                setUpload({ preview: prv });
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <PaginationButtons
                                {...pagination}
                                className="ml-auto"
                            />
                        </div>
                    </>
                )}
                {pagination.currentItems.length > 0 || upload != null ? (
                    <div className="columns-1 sm:columns-2 md:columns-3 2xl:columns-4">
                        {upload && (
                            <div
                                className="relative mb-3 break-inside-avoid rounded-md overflow-clip border

                                    hover:[&>.backdrop]:bg-transparent
                                    
                                    hover:[&>img]:scale-105
                                    "
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewModal(upload.preview);
                                }}
                            >
                                {/* Options */}
                                <div
                                    className="z-1 backdrop absolute inset-0 bg-gray-900/20 p-4 cursor-pointer"
                                    title={upload.preview.file.name}
                                >
                                    <div className="flex flex-col gap-1 items-end *:duration-100">
                                        {upload.preview.uploadStatus ==
                                            UploadStatus.PREVIEW && (
                                            <ActionButton
                                                className="p-2 rounded-full z-0 text-rose-400 btn-secondary bg-background-secondary hover:bg-background dark:outline-background"
                                                icon={TrashIcon}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUpload(null);
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 p-4 space-y-1">
                                        <p className="max-w-[30ch] truncate -translate-y-2 w-fit text-xs bg-background-secondary text-primary px-2 py-1 uppercase rounded">
                                            {upload.preview.file.name}
                                        </p>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 p-2 space-y-2">
                                        <SelectComponent
                                            options={Object.keys(MediaTag).map(
                                                (tag) => ({ value: tag }),
                                            )}
                                            emptyOption="Select tag to upload"
                                            className="bg-section-theme rounded"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            onChange={(e) => {
                                                setUpload((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              tag: e.target
                                                                  .value as MediaTag,
                                                          }
                                                        : null,
                                                );
                                            }}
                                        />
                                        <ActionButton
                                            text="Confirm Upload"
                                            icon={CheckCircleIcon}
                                            spinner={{
                                                isLoading: uploadInProgress,
                                            }}
                                            className="w-full justify-center"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                uploadResource();
                                            }}
                                            disabled={
                                                !upload.tag || uploadInProgress
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Preview */}
                                <img
                                    src={upload.preview.media ?? Landscape}
                                    alt={upload.preview.file.name}
                                    className="z-0 w-full h-auto object-cover duration-200"
                                    onLoad={() => {
                                        if (isPreview) handleOnLoad?.();
                                    }}
                                />
                                {upload.preview.uploadStatus ===
                                    UploadStatus.UPLOADING && (
                                    <SpinnerComponent
                                        text={`Uploading... ${formatBytes(upload.preview.progress!.loaded)} / ${formatBytes(upload.preview.progress!.total)} (${upload.preview.progress!.percentage}%)`}
                                        customize="m-2 text-xs mr-auto w-fit!"
                                        animate="animate-pulse"
                                    />
                                )}
                                {upload.preview.uploadStatus ==
                                    UploadStatus.SUCCESS && (
                                    <Notification
                                        type="success"
                                        messages={["Upload complete."]}
                                        customise="py-1"
                                    />
                                )}
                                {upload.preview.error && (
                                    <Notification
                                        type="error"
                                        messages={[upload.preview.error]}
                                        customise="py-1"
                                    />
                                )}
                            </div>
                        )}

                        {pagination.currentItems.map((rsc) => {
                            const media = !isPreview
                                ? (rsc as Media)
                                : ({} as Media);

                            const preview = isPreview
                                ? (rsc as Preview)
                                : ({} as Preview);

                            return (
                                <div
                                    key={isPreview ? preview.id : media.id}
                                    className="relative mb-3 break-inside-avoid rounded-md overflow-clip border

                                    hover:[&>.backdrop]:bg-transparent
                                    
                                    hover:[&>img]:scale-105
                                    "
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isPreview) {
                                            if (handleImageClick) {
                                                handleImageClick(media);
                                                return;
                                            }
                                            setPreviewModal(
                                                isPreview ? preview : media,
                                            );
                                        }
                                    }}
                                >
                                    {/* Options & File Details */}
                                    <div
                                        className="z-1 backdrop absolute inset-0 bg-gray-900/20 p-4 cursor-pointer
                                        hover:[&>*>*]:translate-0 hover:*:visible hover:[&_button]:pointer-events-auto"
                                        title={
                                            isPreview
                                                ? preview.file.name
                                                : media.mediaName
                                        }
                                    >
                                        {/* Options */}
                                        <div className="absolute inset-x-0 bottom-0 p-2 flex flex-wrap gap-1 items-center justify-center invisible pointer-events-none *:duration-100">
                                            {!isPreview ? (
                                                <>
                                                    <ActionButton
                                                        className="p-2 rounded-full translate-y-2 z-1"
                                                        icon={EyeIcon}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewModal(
                                                                isPreview
                                                                    ? preview
                                                                    : media,
                                                            );
                                                        }}
                                                    />
                                                    {handleEdit && (
                                                        <ActionButton
                                                            className="p-2 rounded-full translate-y-2 z-1"
                                                            icon={PencilIcon}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(
                                                                    media,
                                                                );
                                                            }}
                                                        />
                                                    )}
                                                    {handleDelete && (
                                                        <ActionButton
                                                            className="p-2 rounded-full translate-y-2 z-0 text-rose-400 btn-secondary bg-background-secondary hover:bg-background dark:outline-background"
                                                            icon={TrashIcon}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(
                                                                    media,
                                                                );
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                preview.uploadStatus ==
                                                    UploadStatus.PREVIEW &&
                                                handleDiscard && (
                                                    <ActionButton
                                                        className="p-2 rounded-full -translate-y-12 z-0 text-rose-400 btn-secondary bg-background-secondary hover:bg-background dark:outline-background"
                                                        icon={TrashIcon}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDiscard(
                                                                preview.id,
                                                            );
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>

                                        {/* File Details */}
                                        <div className="absolute inset-0 p-4 space-y-1 invisible pointer-events-none">
                                            <p className="border max-w-[30ch] truncate -translate-y-2 w-fit text-xs bg-background-secondary text-primary px-2 py-1 rounded">
                                                <b className="uppercase">
                                                    Name:{" "}
                                                </b>
                                                {isPreview
                                                    ? preview.file.name
                                                    : media.mediaName}
                                            </p>
                                            <p className="border -translate-y-2 w-fit text-xs bg-background-secondary text-primary px-2 py-1 capitalize rounded">
                                                <b className="uppercase">
                                                    Size:{" "}
                                                </b>
                                                {getMediaSize(
                                                    isPreview
                                                        ? preview.file.name
                                                        : media.mediaName,
                                                )}
                                            </p>
                                            {!isPreview && (
                                                <span className="-translate-y-2 w-fit px-1 py-0.5 rounded bg-primary text-xs text-white uppercase">
                                                    {media.tag}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <img
                                        src={
                                            isPreview
                                                ? preview?.media || Landscape
                                                : media?.media
                                                  ? `data:${media.mediaType};base64,${media.media}`
                                                  : Landscape
                                        }
                                        alt={
                                            isPreview
                                                ? preview?.file.name
                                                : media?.mediaName
                                        }
                                        className="z-0 w-full h-auto object-cover duration-200"
                                        onLoad={() => {
                                            if (isPreview) handleOnLoad?.();
                                        }}
                                    />
                                    {isPreview &&
                                        preview.uploadStatus ===
                                            UploadStatus.UPLOADING && (
                                            <SpinnerComponent
                                                text={`Uploading... ${formatBytes(preview.progress!.loaded)} / ${formatBytes(preview.progress!.total)} (${preview.progress!.percentage}%)`}
                                                customize="m-2 text-xs mr-auto w-fit!"
                                                animate="animate-pulse"
                                            />
                                        )}
                                    {isPreview &&
                                        preview.uploadStatus ==
                                            UploadStatus.SUCCESS && (
                                            <Notification
                                                type="success"
                                                messages={["Upload complete."]}
                                                customise="py-1"
                                            />
                                        )}
                                    {isPreview && preview.error && (
                                        <Notification
                                            type="error"
                                            messages={[preview.error]}
                                            customise="py-1"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <Notification
                        type="info"
                        messages={["No Media in selected category."]}
                    />
                )}
            </div>

            {/* Preview Modal */}
            <ModalComponent
                title={"Info"}
                isOpen={preview != null}
                onClose={() => {
                    setPreviewModal(null);
                }}
                maxWidthClass="max-w-6xl"
            >
                {(() => {
                    if (preview == null) return;

                    const usePreviewType =
                        isPreview || "uploadStatus" in preview;

                    const previewType = preview as Preview;
                    const mediaType = preview as Media;

                    const src = usePreviewType
                        ? previewType.media
                        : `data:${mediaType.mediaType};base64,${mediaType.media}`;

                    const fileName = usePreviewType
                        ? previewType.file.name
                        : mediaType.mediaName;
                    const size = getMediaSize(
                        usePreviewType ? previewType.file : mediaType.media,
                    );
                    const tag = usePreviewType ? undefined : mediaType.tag;
                    const createdAt = usePreviewType
                        ? undefined
                        : mediaType.createdAt;

                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="">
                                <h2>
                                    <span>
                                        <b>FileName:</b> {fileName}
                                    </span>
                                </h2>
                                <p className="text-sm">
                                    <b>Size: </b>
                                    <span>{size}</span>
                                </p>
                                {tag && (
                                    <span>
                                        <b>Tag: </b>
                                        <span className="w-fit px-2 py-1 text-xs bg-primary text-white rounded-md">
                                            {tag}
                                        </span>
                                    </span>
                                )}
                                {createdAt && (
                                    <p className="text-sm">
                                        <b>Uploaded on : </b>
                                        {DateFormatter.toFormattedDate(
                                            createdAt,
                                        )}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-2">
                                {handleDelete && !usePreviewType && (
                                    <ActionButton
                                        text="Delete"
                                        icon={TrashIcon}
                                        onClick={() => handleDelete(mediaType)}
                                    />
                                )}
                                {handleEdit && !usePreviewType && (
                                    <ActionButton
                                        text="Edit"
                                        icon={PencilIcon}
                                        onClick={() => handleEdit(mediaType)}
                                    />
                                )}
                            </div>
                            <hr className="col-span-full border-t" />
                            <div className="col-span-full">
                                <img
                                    src={src ?? Landscape}
                                    className="block w-full rounded-md"
                                    alt={fileName}
                                />
                            </div>
                        </div>
                    );
                })()}
            </ModalComponent>
        </>
    ) : (
        <div className="space-y-1.5 *:not-last:pb-1.5">
            {uploadNotifications && (
                <Notification
                    type={uploadNotifications.type}
                    messages={uploadNotifications.messages}
                />
            )}
            {allowUpload && (
                <>
                    <div>
                        <ActionButton
                            text="Upload"
                            icon={ArrowUpTrayIcon}
                            onClick={(e) => {
                                (
                                    e.currentTarget.nextSibling as HTMLElement
                                ).click();
                            }}
                            className="ml-auto"
                        />
                        <input
                            type="file"
                            name="uploadResource"
                            className="hidden"
                            onChange={(e) => {
                                if (
                                    !e.target.files ||
                                    e.target.files.length == 0
                                ) {
                                    if (upload != null) {
                                        URL.revokeObjectURL(
                                            upload.preview.media,
                                        );
                                    }
                                    setUpload(null);
                                    return;
                                }

                                if (upload != null) {
                                    URL.revokeObjectURL(upload.preview.media);
                                }

                                const file = e.target.files[0];
                                const prv = {
                                    file,
                                    progress: {
                                        loaded: 0,
                                        percentage: 0,
                                        total: file.size,
                                    },
                                    uploadStatus: UploadStatus.PREVIEW,
                                    media: URL.createObjectURL(file),
                                    error:
                                        file.name.length > 100
                                            ? "Filename too long."
                                            : undefined,
                                } as Preview;
                                setUpload({ preview: prv });
                            }}
                        />
                    </div>
                    <hr className="border-t" />
                </>
            )}
            {upload && (
                <>
                    <div className="columns-1 sm:columns-2 md:columns-3 2xl:columns-4">
                        <div
                            className="relative mb-3 break-inside-avoid rounded-md overflow-clip border

                                    hover:[&>.backdrop]:bg-transparent
                                    
                                    hover:[&>img]:scale-105
                                    "
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreviewModal(upload.preview);
                            }}
                        >
                            {/* Options */}
                            <div
                                className="z-1 backdrop absolute inset-0 bg-gray-900/20 p-4 cursor-pointer"
                                title={upload.preview.file.name}
                            >
                                <div className="flex flex-col gap-1 items-end *:duration-100">
                                    {upload.preview.uploadStatus ==
                                        UploadStatus.PREVIEW && (
                                        <ActionButton
                                            className="p-2 rounded-full z-0 text-rose-400 btn-secondary bg-background-secondary hover:bg-background dark:outline-background"
                                            icon={TrashIcon}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setUpload(null);
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="absolute inset-0 p-4 space-y-1">
                                    <p className="max-w-[30ch] truncate -translate-y-2 w-fit text-xs bg-background-secondary text-primary px-2 py-1 uppercase rounded">
                                        {upload.preview.file.name}
                                    </p>
                                </div>
                                <div className="absolute bottom-0 inset-x-0 p-2 space-y-2">
                                    <SelectComponent
                                        options={Object.keys(MediaTag).map(
                                            (tag) => ({ value: tag }),
                                        )}
                                        emptyOption="Select tag to upload"
                                        className="bg-section-theme rounded"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        onChange={(e) => {
                                            setUpload((prev) =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          tag: e.target
                                                              .value as MediaTag,
                                                      }
                                                    : null,
                                            );
                                        }}
                                    />
                                    <ActionButton
                                        text="Confirm Upload"
                                        icon={CheckCircleIcon}
                                        spinner={{
                                            isLoading: uploadInProgress,
                                        }}
                                        className="w-full justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            uploadResource();
                                        }}
                                        disabled={
                                            !upload.tag || uploadInProgress
                                        }
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            <img
                                src={upload.preview.media ?? Landscape}
                                alt={upload.preview.file.name}
                                className="z-0 w-full h-auto object-cover duration-200"
                                onLoad={() => {
                                    if (isPreview) handleOnLoad?.();
                                }}
                            />
                            {upload.preview.uploadStatus ===
                                UploadStatus.UPLOADING && (
                                <SpinnerComponent
                                    text={`Uploading... ${formatBytes(upload.preview.progress!.loaded)} / ${formatBytes(upload.preview.progress!.total)} (${upload.preview.progress!.percentage}%)`}
                                    customize="m-2 text-xs mr-auto w-fit!"
                                    animate="animate-pulse"
                                />
                            )}
                            {upload.preview.uploadStatus ==
                                UploadStatus.SUCCESS && (
                                <Notification
                                    type="success"
                                    messages={["Upload complete."]}
                                    customise="py-1"
                                />
                            )}
                            {upload.preview.error && (
                                <Notification
                                    type="error"
                                    messages={[upload.preview.error]}
                                    customise="py-1"
                                />
                            )}
                        </div>
                    </div>
                </>
            )}
            <Notification type="info" messages={["No Media to show"]} />
        </div>
    );
}
