import { apiClient } from "@/lib/api"
import type { AssignUserRoleRequest, UserRoleTenantDto, UserRolesInTenantDto } from "@/types"

export const userRoleService = {
  async assignRole(request: AssignUserRoleRequest): Promise<UserRoleTenantDto> {
    const response = await apiClient.post("/api/v1/user-roles", request)
    return response.data
  },

  async removeRole(userId: string, roleId: string, tenantId: string): Promise<void> {
    await apiClient.delete(`/api/v1/user-roles`, {
      params: { userId, roleId, tenantId },
    })
  },

  async getUserRoles(userId: string, tenantId: string): Promise<UserRolesInTenantDto> {
    const response = await apiClient.get(`/api/v1/user-roles/user/${userId}/tenant/${tenantId}`)
    return response.data
  },

  async getTenantUsers(tenantId: string): Promise<UserRoleTenantDto[]> {
    const response = await apiClient.get(`/api/v1/user-roles/tenant/${tenantId}`)
    return response.data
  },
}
