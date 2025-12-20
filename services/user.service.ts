import apiClient from "@/lib/api"
import type { UserResponse, CreateUserRequest, UpdateUserRequest } from "@/types"

export const userService = {
  async getAll(): Promise<UserResponse[]> {
    const response = await apiClient.get<UserResponse[]>("/api/V1/users")
    return response.data
  },

  async getById(id: string): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(`/api/V1/users/${id}`)
    return response.data
  },

  async create(data: CreateUserRequest): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>("/api/V1/users", data)
    return response.data
  },

  async update(data: UpdateUserRequest): Promise<UserResponse> {
    const response = await apiClient.put<UserResponse>("/api/V1/users", data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/V1/users/${id}`)
  },
}
