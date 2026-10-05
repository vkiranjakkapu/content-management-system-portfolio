import type { AxiosProgressEvent } from "axios";
import { apiClient, type ApiResponse } from "../api/api";
import type { MediaTag } from "./DtoModels";

class MediaService {
    async getMedia<T>(id?: string): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            service: "media",
            uri: `/${id ?? ""}`,
        });
    }

    async getAllMediaByTag<T>(tag: MediaTag): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            service: "media",
            uri: `/tag/${tag}`,
        });
    }

    async getAllMediaByTagList<T>(payload: {
        tags: MediaTag[];
    }): Promise<ApiResponse<T>> {
        return apiClient({
            type: "post",
            service: "media",
            uri: `/tag/`,
            payload,
        });
    }

    async fetchMediaById<T>(id: string): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            service: "media",
            uri: "/fetch/" + id,
        });
    }

    async fetchMediaByList<T>(payload: {
        ids: string[];
    }): Promise<ApiResponse<T>> {
        return apiClient({
            type: "post",
            service: "media",
            uri: "/fetch",
            payload,
        });
    }

    async createMedia<T>(
        payload: { file: File; tag: MediaTag },
        onProgress: (progressDetails: UploadProgressDetails) => void,
    ): Promise<ApiResponse<T>> {
        return apiClient({
            type: "post",
            service: "media",
            uri: "/",
            payload,
            config: {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const loaded = progressEvent.loaded;

                    // Fallback to file.size if total is undefined
                    const total = progressEvent.total || payload.file.size;

                    const percentage = Math.round((loaded * 100) / total);

                    onProgress({
                        loaded,
                        total,
                        percentage,
                    });
                },
            },
        });
    }

    async updateMedia<T>(payload: {
        id: string;
        tag: MediaTag;
    }): Promise<ApiResponse<T>> {
        return apiClient({
            type: "put",
            service: "media",
            uri: "/",
            payload,
        });
    }

    async deleteMedia(id: string): Promise<ApiResponse<void>> {
        return apiClient({
            type: "delete",
            service: "media",
            uri: "/" + id,
        });
    }
}

export default new MediaService();

export interface UploadProgressDetails {
    loaded: number;
    total: number;
    percentage: number;
}

export const UploadStatus = {
    PREVIEW: "PREVIEW",
    UPLOADING: "UPLOADING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
};

export type UploadStatus = (typeof UploadStatus)[keyof typeof UploadStatus];

export interface UploadDetails {
    id: number;
    file: File;
    progress: UploadProgressDetails;
    status: UploadStatus;
    error?: string;
}
