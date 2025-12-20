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

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Agregar TenantId al header si está disponible
    if (tenantId && config.headers) {
      config.headers["X-Tenant-Id"] = tenantId
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar respuestas y refrescar token si es necesario
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Si el error es 401 y no hemos reintentado, intentar refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")

        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, refreshToken, {
            headers: { "Content-Type": "application/json" },
          })

          const { accessToken, refreshToken: newRefreshToken } = response.data

          localStorage.setItem("accessToken", accessToken)
          localStorage.setItem("refreshToken", newRefreshToken)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }

          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar storage y redirigir al login
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        localStorage.removeItem("selectedTenantId")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
