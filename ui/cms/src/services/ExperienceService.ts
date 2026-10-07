import { apiClient, type ApiResponse } from "../api/api";

type ExperiencePayload = {
    company: string;
    position: string;
    startDate: string;
    ednDate?: string;
    isWorking: boolean;
};

class ExperienceService {
    async getExperiences<T>(id?: string): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            service: "experience",
            uri: `/${id ?? ""}`,
        });
    }

    async createExperience<T>(
        payload: ExperiencePayload,
    ): Promise<ApiResponse<T>> {
        return apiClient({
            type: "post",
            service: "experience",
            uri: "/",
            payload,
        });
    }

    async updateExperience<T>(
        payload: ExperiencePayload & { expId: string },
    ): Promise<ApiResponse<T>> {
        return apiClient({
            type: "put",
            service: "experience",
            uri: "/",
            payload,
        });
    }

    async deleteExperience(id: string): Promise<ApiResponse<void>> {
        return apiClient({
            type: "delete",
            service: "experience",
            uri: `/${id}`,
        });
    }
}

export default new ExperienceService();
