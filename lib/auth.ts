import type { LoginResponse, User } from "@/types"

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  SELECTED_TENANT_ID: "selectedTenantId",
} as const

export const setAuthData = (data: LoginResponse) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, data.accessToken)
  localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken)
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(data.user))

  // Si hay tenants, seleccionar el primero por defecto
  if (data.tenants && data.tenants.length > 0) {
    localStorage.setItem(AUTH_STORAGE_KEYS.SELECTED_TENANT_ID, data.tenants[0].id)
  }
}

export const getAuthData = () => {
  if (typeof window === "undefined") return null

  const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
  const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
  const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER)
  const selectedTenantId = localStorage.getItem(AUTH_STORAGE_KEYS.SELECTED_TENANT_ID)

  if (!accessToken || !userStr) return null

  try {
    const user = JSON.parse(userStr) as User
    return {
      accessToken,
      refreshToken,
      user,
      selectedTenantId,
    }
  } catch {
    return null
  }
}

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER)
  localStorage.removeItem(AUTH_STORAGE_KEYS.SELECTED_TENANT_ID)
}

export const isAuthenticated = (): boolean => {
  return !!getAuthData()
}

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
}

export const setSelectedTenant = (tenantId: string) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.SELECTED_TENANT_ID, tenantId)
}

export const getSelectedTenant = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_STORAGE_KEYS.SELECTED_TENANT_ID)
}
