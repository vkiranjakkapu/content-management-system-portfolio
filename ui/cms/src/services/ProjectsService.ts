import { apiClient, type ApiResponse } from "../api/api";

class ProjectsService {
    async getProjects<T>(id?: string): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            service: "projects",
            uri: `/${id ?? ""}`,
        });
    }

    async createProject<T>(payload: {
        title: string;
        description: string;
        techStack: string[];
        gallery: string[];
        gitUrl: string;
    }): Promise<ApiResponse<T>> {
        return apiClient({
            type: "post",
            service: "projects",
            uri: "/",
            payload,
        });
    }

    async updateProject<T>(payload: {
        id: string;
        title?: string;
        description?: string;
        techStack?: string[];
        gallery?: string[];
        gitUrl?: string;
    }): Promise<ApiResponse<T>> {
        return apiClient({
            type: "patch",
            service: "projects",
            uri: "/",
            payload,
        });
    }

    async addSkillToProject(
        projectId: string,
        skillId: string,
    ): Promise<ApiResponse<void>> {
        return apiClient({
            type: "put",
            service: "projects",
            uri: `/${projectId}/skill/${skillId}`,
        });
    }

    async removeSkillFromProject(
        projectId: string,
        skillId: string,
    ): Promise<ApiResponse<void>> {
        return apiClient({
            type: "delete",
            service: "projects",
            uri: `/${projectId}/skill/${skillId}`,
        });
    }

    async addMediaToProject(
        projectId: string,
        mediaId: string,
    ): Promise<ApiResponse<void>> {
        return apiClient({
            type: "put",
            service: "projects",
            uri: `/${projectId}/media/${mediaId}`,
        });
    }

    async removeMediaFromProject(
        projectId: string,
        mediaId: string,
    ): Promise<ApiResponse<void>> {
        return apiClient({
            type: "delete",
            service: "projects",
            uri: `/${projectId}/media/${mediaId}`,
        });
    }

    async deleteProject(id: string): Promise<ApiResponse<void>> {
        return apiClient({
            type: "delete",
            service: "projects",
            uri: `/${id}`,
        });
    }
}

export default new ProjectsService();
