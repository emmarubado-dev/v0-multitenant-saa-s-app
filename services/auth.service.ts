import apiClient from "@/lib/api"
import type { LoginRequest, LoginResponse } from "@/types"

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/api/v1/auth/login", credentials)
    return response.data
  },

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/api/v1/auth/refresh", refreshToken)
    return response.data
  },

  async logout(refreshToken: string): Promise<void> {
    try {
      await apiClient.post("/api/v1/auth/revoke", refreshToken)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  },
}
