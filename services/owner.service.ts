import apiClient from "@/lib/api"
import type { OwnerResponse, CreateOwnerRequest, UpdateOwnerRequest } from "@/types"

export const ownerService = {
  async getAll(): Promise<OwnerResponse[]> {
    const response = await apiClient.get<OwnerResponse[]>("/api/V1/owners")
    return response.data
  },

  async getById(id: string): Promise<OwnerResponse> {
    const response = await apiClient.get<OwnerResponse>(`/api/V1/owners/${id}`)
    return response.data
  },

  async create(data: CreateOwnerRequest): Promise<OwnerResponse> {
    const response = await apiClient.post<OwnerResponse>("/api/V1/owners", data)
    return response.data
  },

  async update(data: UpdateOwnerRequest): Promise<OwnerResponse> {
    const response = await apiClient.put<OwnerResponse>("/api/V1/owners", data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/V1/owners/${id}`)
  },
}
