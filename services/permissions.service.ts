import { apiClient } from "@/lib/api"
import type { UserPermissions } from "@/types"

export const permissionsService = {
  getUserPermissions: async (userId: string, tenantId: string): Promise<UserPermissions> => {
    const response = await apiClient.get<UserPermissions>(
      `/api/v1/user-roles/user/${userId}/tenant/${tenantId}/permissions`,
    )
    return response.data
  },
}
