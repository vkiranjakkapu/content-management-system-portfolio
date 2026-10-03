import { apiClient, type ApiResponse } from "../api/api";

class AboutService {
    async getAbouts<T>(id?: string): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            service: "about",
            uri: `/${id ?? ""}`,
        });
    }

    async createNewAbout<T>(payload: {
        name: string;
        summary: string;
    }): Promise<ApiResponse<T>> {
        return apiClient({
            type: "post",
            service: "about",
            uri: "/",
            payload,
        });
    }

    async updateAbout<T>(payload: {
        id: string;
        name: string;
        summary: string;
    }): Promise<ApiResponse<T>> {
        return apiClient({
            type: "put",
            service: "about",
            uri: "/",
            payload,
        });
    }

    async deleteAbout(id: string): Promise<ApiResponse<void>> {
        return apiClient({
            type: "delete",
            service: "about",
            uri: "/" + id,
        });
    }
}

export default new AboutService();
