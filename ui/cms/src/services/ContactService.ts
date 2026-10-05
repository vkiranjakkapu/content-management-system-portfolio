import { apiClient, type ApiResponse } from "../api/api";

class ContactService {
    async getContactRequests<T>(id?: string): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            service: "contact",
            uri: `/${id ?? ""}`,
        });
    }

    async deleteContactReq(id: string): Promise<ApiResponse<void>> {
        return apiClient({
            type: "delete",
            service: "contact",
            uri: "/" + id,
        });
    }
}

export default new ContactService();
