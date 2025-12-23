"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { tenantService } from "@/services/tenant.service"
import { permissionsService } from "@/services/permissions.service"
import type { LoginRequest, User, TenantResponse } from "@/types"
import {
  setAuthToken,
  setUserData,
  getAuthData,
  clearAuthData,
  setSelectedTenant as setStoredTenant,
  decodeToken,
  setUserPermissions,
  getUserPermissions,
} from "@/lib/auth"

interface AuthContextType {
  user: User | null
  tenants: TenantResponse[]
  selectedTenantId: string | null
  userPermissions: string[]
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  setSelectedTenant: (tenantId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tenants, setTenants] = useState<TenantResponse[]>([])
  const [selectedTenantId, setSelectedTenantIdState] = useState<string | null>(null)
  const [userPermissions, setUserPermissionsState] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      console.log("[v0] Initializing auth context...")
      const authData = getAuthData()
      console.log("[v0] Auth data from storage:", authData ? "exists" : "none")

      if (authData) {
        setUser(authData.user)
        setSelectedTenantIdState(authData.selectedTenantId)
        setUserPermissionsState(getUserPermissions())

        // Cargar tenants disponibles
        try {
          const tenantsData = await tenantService.getAll()
          console.log("[v0] Tenants loaded:", tenantsData.length)
          setTenants(tenantsData)
        } catch (error) {
          console.error("[v0] Error loading tenants:", error)
        }
      }

      setIsLoading(false)
      console.log("[v0] Auth initialization complete. User:", authData?.user?.email || "none")
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      console.log("[v0] Login attempt for:", credentials.email)
      const response = await authService.login(credentials)
      console.log("[v0] Login response received:", response)

      setAuthToken(response.accessToken)
      console.log("[v0] Token saved and cookie set")

      const tokenPayload = decodeToken(response.accessToken)
      console.log("[v0] Decoded token payload:", tokenPayload)

      if (!tokenPayload) {
        throw new Error("Invalid token")
      }

      const userData: User = {
        id: tokenPayload.userId,
        name: tokenPayload.name,
        email: tokenPayload.email,
        isOwner: tokenPayload.isowner?.toUpperCase() === "S",
        isActive: true,
        ownerId:tokenPayload.ownerId
      }

      setUserData(userData)
      setUser(userData)
      console.log("[v0] User data set:", userData)
      console.log("[v0] Is Owner:", userData.isOwner)

      try {
        const tenantsData = await tenantService.getAll()
        console.log("[v0] Tenants loaded after login:", tenantsData.length)
        setTenants(tenantsData)

        if (tenantsData.length > 0) {
          await loadTenantPermissions(userData.id, tenantsData[0].id)
          setSelectedTenantIdState(tenantsData[0].id)
          setStoredTenant(tenantsData[0].id)
          console.log("[v0] Selected first tenant:", tenantsData[0].id)
        }
      } catch (error) {
        console.error("[v0] Error loading tenants after login:", error)
      }

      console.log("[v0] Redirecting to dashboard...")
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    }
  }

  const loadTenantPermissions = async (userId: string, tenantId: string) => {
    try {
      console.log("[v0] Loading permissions for user:", userId, "tenant:", tenantId)
      const permissions = await permissionsService.getUserPermissions(userId, tenantId)
      console.log("[v0] Permissions loaded:", permissions.actions)
      setUserPermissions(permissions.actions)
      setUserPermissionsState(permissions.actions)
    } catch (error) {
      console.error("[v0] Error loading permissions:", error)
      setUserPermissions([])
      setUserPermissionsState([])
    }
  }

  const logout = async () => {
    console.log("[v0] Logging out...")
    await authService.logout()
    clearAuthData()
    setUser(null)
    setTenants([])
    setSelectedTenantIdState(null)
    setUserPermissionsState([])
    console.log("[v0] Logout complete, redirecting to login...")
    router.push("/login")
  }

  const setSelectedTenant = async (tenantId: string) => {
    console.log("[v0] Selecting tenant:", tenantId)
    setStoredTenant(tenantId)
    setSelectedTenantIdState(tenantId)

    if (user && !user.isOwner) {
      await loadTenantPermissions(user.id, tenantId)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tenants,
        selectedTenantId,
        userPermissions,
        isLoading,
        login,
        logout,
        setSelectedTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
