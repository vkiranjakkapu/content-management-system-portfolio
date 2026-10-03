import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import ActionButton from "../../components/ActionButtonComponent";
import Notification from "../../components/notifications/Notification";
import SpinnerComponent, {
    type SpinnerComponentProps,
} from "../../components/SpinnerComponent";
import type { Media } from "../../services/DtoModels";
import { UploadStatus } from "../../services/MediaService";
import { formatBytes } from "../../utils/FileUploadHelper";
import type { Preview } from "./useFilePreview";

type MasonryComponentProps = {
    resources:
        | (Media & {
              isUploading?: boolean;
          })[]
        | Preview[];
    isPreview?: boolean;

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
    spinner,
    handleImageClick,
    handleEdit,
    handleDelete,
    handleOnLoad,
    handleDiscard,
}: MasonryComponentProps) {
    return spinner && spinner.isLoading ? (
        <SpinnerComponent {...spinner} />
    ) : resources.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 2xl:columns-4">
            {resources.map((rsc) => {
                const media = !isPreview
                    ? (rsc as Media & {
                          isUploading?: boolean;
                      })
                    : ({} as Media & {
                          isUploading?: boolean;
                      });

                const preview = isPreview ? (rsc as Preview) : ({} as Preview);

                return (
                    <div
                        key={isPreview ? preview.id : media.id}
                        className="relative mb-3 break-inside-avoid rounded-md overflow-clip border

                                    hover:[&>.backdrop]:bg-transparent
                                    
                                    hover:[&>img]:scale-105
                                    "
                    >
                        {/* Options */}
                        <div
                            className="z-1 backdrop absolute inset-0 bg-gray-900/20 p-4 cursor-pointer
                                        hover:[&>*>*]:translate-0 hover:*:visible hover:[&_button]:pointer-events-auto"
                        >
                            <div className="flex flex-col gap-1 items-end invisible pointer-events-none *:duration-100">
                                {!isPreview ? (
                                    <>
                                        {handleEdit && (
                                            <ActionButton
                                                className="p-2 rounded-full -translate-y-2 z-1"
                                                icon={EllipsisVerticalIcon}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(media);
                                                }}
                                            />
                                        )}
                                        {handleDelete && (
                                            <ActionButton
                                                className="p-2 rounded-full -translate-y-12 z-0 text-rose-400 btn-secondary bg-background-secondary hover:bg-background dark:outline-background"
                                                icon={TrashIcon}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(media);
                                                }}
                                            />
                                        )}
                                    </>
                                ) : (
                                    handleDiscard && (
                                        <ActionButton
                                            className="p-2 rounded-full -translate-y-12 z-0 text-rose-400 btn-secondary bg-background-secondary hover:bg-background dark:outline-background"
                                            icon={TrashIcon}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDiscard(preview.id);
                                            }}
                                        />
                                    )
                                )}
                            </div>
                            <div className="absolute inset-0 p-4 space-y-1 invisible pointer-events-none">
                                <p className="max-w-[30ch] truncate -translate-y-2 w-fit text-xs bg-background-secondary text-primary px-2 py-1 uppercase rounded">
                                    {isPreview
                                        ? preview.file.name
                                        : media.mediaName}
                                </p>
                                {!isPreview && (
                                    <p className="-translate-y-2 w-fit px-2 py-1 rounded bg-primary text-xs text-white uppercase">
                                        {media.tag}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Preview */}
                        <img
                            src={
                                isPreview
                                    ? preview.media
                                    : URL.createObjectURL(media.media)
                            }
                            className="z-0 w-full h-auto object-cover duration-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isPreview) {
                                    handleImageClick?.(media);
                                }
                            }}
                            onLoad={() => {
                                if (isPreview) handleOnLoad?.();
                            }}
                        />
                        {((isPreview &&
                            preview.uploadStatus === UploadStatus.UPLOADING) ||
                            media.isUploading) && (
                            <SpinnerComponent
                                text={`Uploading... ${formatBytes(preview.progress!.loaded)} / ${formatBytes(preview.progress!.total)} (${preview.progress!.percentage}%)`}
                                customize="m-2 text-xs mr-auto w-fit!"
                                animate="animate-pulse"
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
        <Notification type="info" messages={["No Media to show"]} />
    );
}
