import { apiClient, type ApiResponse } from "../api/api";
import type { SkillRequestType } from "./DtoModels";

class SkillsService {
    async getSkills<T>(id?: string): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            service: "skills",
            uri: `/${id ?? ""}`,
        });
    }

    async createSkill<T>(payload: {
        type: SkillRequestType;
        tech: string;
        name: string;
    }): Promise<ApiResponse<T>> {
        return apiClient({
            type: "post",
            service: "skills",
            uri: `/`,
            payload,
        });
    }

    async updateSkill<T>(payload: {
        id: string;
        name: string;
        techId: string;
    }): Promise<ApiResponse<T>> {
        return apiClient({
            type: "put",
            service: "skills",
            uri: `/`,
            payload,
        });
    }

    async getTechnologies<T>(): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            service: "technologies",
            uri: `/`,
        });
    }

    async updateTech<T>(payload: {
        id: string;
        name: string;
    }): Promise<ApiResponse<T>> {
        return apiClient({
            type: "put",
            service: "technologies",
            uri: `/`,
            payload,
        });
    }

    async deleteSkill(id: string): Promise<ApiResponse<void>> {
        return apiClient({
            type: "delete",
            service: "skills",
            uri: `/${id}`,
        });
    }
}

export default new SkillsService();
