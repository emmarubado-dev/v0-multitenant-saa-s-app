import type { User } from "@/types"

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER: "user",
  SELECTED_TENANT_ID: "selectedTenantId",
} as const

export const setAuthCookie = (token: string) => {
  const expires = new Date()
  expires.setDate(expires.getDate() + 7)
  document.cookie = `accessToken=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

export const removeAuthCookie = () => {
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token)
  setAuthCookie(token)
}

export const setUserData = (user: User) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user))
}

export const getAuthData = () => {
  if (typeof window === "undefined") return null

  const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
  const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER)
  const selectedTenantId = localStorage.getItem(AUTH_STORAGE_KEYS.SELECTED_TENANT_ID)

  if (!accessToken) return null

  try {
    const user = userStr ? (JSON.parse(userStr) as User) : null
    return {
      accessToken,
      user,
      selectedTenantId,
    }
  } catch {
    return null
  }
}

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER)
  localStorage.removeItem(AUTH_STORAGE_KEYS.SELECTED_TENANT_ID)
  removeAuthCookie()
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

export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}
