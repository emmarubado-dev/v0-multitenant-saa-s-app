import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

// Base URL de la API (ajustar según necesidad)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7054"

// Cliente axios configurado
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para agregar el token JWT a todas las peticiones
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken")
    const tenantId = localStorage.getItem("selectedTenantId")

    console.log("[v0] API Request:", config.method?.toUpperCase(), config.url)

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("[v0] Token added to request")
    }

    // Agregar TenantId al header si está disponible
    if (tenantId && config.headers) {
      config.headers["X-Tenant-Id"] = tenantId
      console.log("[v0] Tenant-Id added to request:", tenantId)
    }

    return config
  },
  (error) => {
    console.error("[v0] Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    console.log("[v0] API Response:", response.status, response.config.url)
    return response
  },
  async (error: AxiosError) => {
    console.error("[v0] API Error:", error.response?.status, error.config?.url, error.message)

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Si el error es 401 y no hemos reintentado, limpiar y redirigir
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("[v0] Unauthorized error, clearing auth and redirecting to login")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("user")
      localStorage.removeItem("selectedTenantId")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)

export default apiClient
