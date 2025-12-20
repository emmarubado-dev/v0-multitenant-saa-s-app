import apiClient from "@/lib/api"
import type { RoleResponse, CreateRoleRequest, UpdateRoleRequest } from "@/types"

export const roleService = {
  async getAll(): Promise<RoleResponse[]> {
    const response = await apiClient.get<RoleResponse[]>("/api/V1/roles")
    return response.data
  },

  async getById(id: number): Promise<RoleResponse> {
    const response = await apiClient.get<RoleResponse>(`/api/V1/roles/${id}`)
    return response.data
  },

  async create(data: CreateRoleRequest): Promise<RoleResponse> {
    const response = await apiClient.post<RoleResponse>("/api/V1/roles", data)
    return response.data
  },

  async update(data: UpdateRoleRequest): Promise<RoleResponse> {
    const response = await apiClient.put<RoleResponse>("/api/V1/roles", data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/V1/roles/${id}`)
  },
}
