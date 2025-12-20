import apiClient from "@/lib/api"
import type { TenantResponse, CreateTenantRequest, UpdateTenantRequest } from "@/types"

export const tenantService = {
  async getAll(): Promise<TenantResponse[]> {
    const response = await apiClient.get<TenantResponse[]>("/api/V1/tenants")
    return response.data
  },

  async getById(id: string): Promise<TenantResponse> {
    const response = await apiClient.get<TenantResponse>(`/api/V1/tenants/${id}`)
    return response.data
  },

  async create(data: CreateTenantRequest): Promise<TenantResponse> {
    const response = await apiClient.post<TenantResponse>("/api/V1/tenants", data)
    return response.data
  },

  async update(data: UpdateTenantRequest): Promise<TenantResponse> {
    const response = await apiClient.put<TenantResponse>("/api/V1/tenants", data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/V1/tenants/${id}`)
  },
}
