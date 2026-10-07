import { apiClient, type ApiResponse } from "../api/api";

class PublicationService {
    async getPublicaitons<T>(id?: string): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            service: "publication",
            uri: `/${id ?? ""}`,
        });
    }

    async updatePublication<T>(payload: unknown): Promise<ApiResponse<T>> {
        return apiClient({
            type: "put",
            service: "publication",
            uri: "/",
            payload,
        });
    }

    async publish<T>(id: string): Promise<ApiResponse<T>> {
        return apiClient({
            type: "post",
            service: "publication",
            uri: `/${id}`,
        });
    }
}

export default new PublicationService();

export type PublicationPayload = {
    publicationId?: string;
    aboutId?: string;
    skillIds?: string[];
    projectIds?: string[];
    experienceIds?: string[];
    showSkills?: boolean;
    showProjects?: boolean;
    showExperience?: boolean;
    showContact?: boolean;
    seo?: SeoPayload;
};

export type SeoPayload = {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImageId?: string;
    robots?: string;
};
