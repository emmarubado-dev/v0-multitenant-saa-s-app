import apiClient from "@/lib/api"
import type { LoginRequest, LoginResponse } from "@/types"

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/api/v1/auth/login", credentials)
    console.log("[v0] Login response:", response.data)
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/v1/auth/revoke", {})
    } catch (error) {
      console.error("Error during logout:", error)
    }
  },
}
