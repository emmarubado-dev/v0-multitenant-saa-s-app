"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { tenantService } from "@/services/tenant.service"
import type { LoginRequest, User, TenantResponse } from "@/types"
import { setAuthData, getAuthData, clearAuthData, setSelectedTenant as setStoredTenant } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  tenants: TenantResponse[]
  selectedTenantId: string | null
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  setSelectedTenant: (tenantId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tenants, setTenants] = useState<TenantResponse[]>([])
  const [selectedTenantId, setSelectedTenantIdState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const authData = getAuthData()

      if (authData) {
        setUser(authData.user)
        setSelectedTenantIdState(authData.selectedTenantId)

        // Cargar tenants disponibles
        try {
          const tenantsData = await tenantService.getAll()
          setTenants(tenantsData)
        } catch (error) {
          console.error("Error loading tenants:", error)
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials)
      setAuthData(response)
      setUser(response.user)
      setTenants(response.tenants || [])

      if (response.tenants && response.tenants.length > 0) {
        setSelectedTenantIdState(response.tenants[0].id)
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    const authData = getAuthData()

    if (authData?.refreshToken) {
      await authService.logout(authData.refreshToken)
    }

    clearAuthData()
    setUser(null)
    setTenants([])
    setSelectedTenantIdState(null)
    router.push("/login")
  }

  const setSelectedTenant = (tenantId: string) => {
    setStoredTenant(tenantId)
    setSelectedTenantIdState(tenantId)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tenants,
        selectedTenantId,
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
