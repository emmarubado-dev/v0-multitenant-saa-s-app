import apiClient from "@/lib/api"
import type { ActionDto } from "@/types"

export const actionService = {
  getAll: async (): Promise<ActionDto[]> => {
    const response = await apiClient.get<ActionDto[]>("/api/v1/actions")
    return response.data
  },
}
