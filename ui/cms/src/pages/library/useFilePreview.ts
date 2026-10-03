import {
    useCallback,
    useState,
    type ChangeEvent,
    type Dispatch,
    type SetStateAction,
} from "react";
import {
    UploadStatus,
    type UploadProgressDetails,
} from "../../services/MediaService";

export type Preview = {
    id: number;
    file: File;
    media: string;
    progress?: UploadProgressDetails;
    uploadStatus?: UploadStatus;
    error?: string;
};

type FilePreviewProps = {
    previews: Preview[];
    previewInProgress: boolean;

    loadedCount: number;
    updatePreviews: Dispatch<SetStateAction<Preview[]>>;
    handleLoadComplete: () => void;
    clearPreviews: (id: number) => void;
    handlePreviews: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function useFilePreview(): FilePreviewProps {
    const [loadedCount, setLoadedCount] = useState<number>(0);
    const [previews, setPreviews] = useState<Preview[]>([]);

    const [previewInProgress, setPreviewProgress] = useState<boolean>(false);

    const handlePreviews = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);

            if (files.length === 0) return;

            previews.forEach((prv) => URL.revokeObjectURL(prv.media));

            const newPreviews = files.map(
                (file, id) =>
                    ({
                        id,
                        file,
                        media: URL.createObjectURL(file),
                        progress: {
                            loaded: 0,
                            total: file.size,
                            percentage: 0,
                        },
                        uploadStatus: UploadStatus.PREVIEW,
                    }) as Preview,
            );
            setPreviews(newPreviews);

            setLoadedCount(0);
            setPreviewProgress(true);
        },
        [previews],
    );

    const handleLoadComplete = useCallback(() => {
        setLoadedCount((prev) => {
            const nextCount = prev + 1;
            if (nextCount >= previews.length) {
                setPreviewProgress(false);
            }
            return nextCount;
        });
    }, [previews.length]);

    const clearPreviews = useCallback(
        (index?: number) => {
            if (previews.length === 0) return;

            if (index === undefined) {
                previews.forEach((prv) => URL.revokeObjectURL(prv.media));
                setPreviews([]);
                setLoadedCount(0);
                return;
            }

            setPreviews((prevPreviews) => {
                const updatedPreviews = prevPreviews.filter((prv, idx) => {
                    if (idx === index) {
                        URL.revokeObjectURL(prv.media);
                        return false;
                    }
                    return true;
                });

                setLoadedCount((prevCount) => Math.max(0, prevCount - 1));

                return updatedPreviews;
            });
        },
        [previews],
    );

    return {
        previews,
        previewInProgress,
        loadedCount,
        updatePreviews: setPreviews,
        handleLoadComplete,
        clearPreviews,
        handlePreviews,
    };
}
