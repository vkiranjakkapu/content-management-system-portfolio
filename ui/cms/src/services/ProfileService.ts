import { apiClient, type ApiResponse } from "../api/api";

class ProfileService {
    async getAllProfiles<T>(id?: string): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            service: "profile",
            uri: `/${id ?? ""}`,
        });
    }

    async createProfile<T>(
        payload:
            | {
                  dp?: File;
                  email: string;
                  name: string;
                  phone: string;
                  designation: string;
                  location: string;
                  availability: string;
                  banner?: File;
              }
            | FormData,
    ): Promise<ApiResponse<T>> {
        return apiClient({
            type: "post",
            service: "profile",
            uri: "/",
            payload,
        });
    }

    async updateProfile<T>(
        payload:
            | {
                  dp?: string;
                  email?: string;
                  name?: string;
                  phone?: string;
                  designation?: string;
                  location?: string;
                  availability?: string;
                  banner?: string;
              }
            | FormData,
    ): Promise<ApiResponse<T>> {
        return apiClient({
            type: "put",
            service: "profile",
            uri: "/",
            payload,
        });
    }

    async deleteProfile(id: string): Promise<ApiResponse<void>> {
        return apiClient({
            type: "delete",
            service: "profile",
            uri: "/" + id,
        });
    }
}

export default new ProfileService();
