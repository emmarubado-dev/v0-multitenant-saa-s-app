import type { AxiosError } from "axios"
import type { ApiError } from "@/types"

export function getErrorMessage(error: unknown): string {
  if (!error) return "Ha ocurrido un error desconocido"

  const axiosError = error as AxiosError<ApiError>
  const errorData = axiosError.response?.data

  if (!errorData) {
    return axiosError.message || "Ha ocurrido un error desconocido"
  }

  // Format 1: Simple error with code and description
  if (errorData.error?.description) {
    return errorData.error.description
  }

  // Format 2: Validation errors with multiple fields
  if (errorData.errors && Object.keys(errorData.errors).length > 0) {
    const errorMessages: string[] = []
    Object.entries(errorData.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        messages.forEach((msg) => errorMessages.push(`${field}: ${msg}`))
      }
    })
    return errorMessages.length > 0 ? errorMessages.join("\n") : errorData.title || "Error de validación"
  }

  // Format 3: Server error with detail
  if (errorData.detail) {
    return errorData.detail
  }

  // Fallback to title if available
  if (errorData.title) {
    return errorData.title
  }

  return axiosError.message || "Ha ocurrido un error desconocido"
}

export function getFieldErrors(error: unknown): Record<string, string[]> {
  if (!error) return {}

  const axiosError = error as AxiosError<ApiError>

  if (axiosError.response?.data?.errors) {
    return axiosError.response.data.errors
  }

  return {}
}

export function getStructuredError(error: unknown): {
  type: "simple" | "validation" | "server" | "unknown"
  message: string
  fields?: Record<string, string[]>
  code?: string
} {
  if (!error) {
    return { type: "unknown", message: "Ha ocurrido un error desconocido" }
  }

  const axiosError = error as AxiosError<ApiError>
  const errorData = axiosError.response?.data

  if (!errorData) {
    return {
      type: "unknown",
      message: axiosError.message || "Ha ocurrido un error desconocido",
    }
  }

  // Format 1: Simple error
  if (errorData.error?.description) {
    return {
      type: "simple",
      message: errorData.error.description,
      code: errorData.error.code,
    }
  }

  // Format 2: Validation errors
  if (errorData.errors && Object.keys(errorData.errors).length > 0) {
    return {
      type: "validation",
      message: errorData.title || "Error de validación",
      fields: errorData.errors,
    }
  }

  // Format 3: Server error
  if (errorData.detail) {
    return {
      type: "server",
      message: errorData.detail,
    }
  }

  return {
    type: "unknown",
    message: errorData.title || axiosError.message || "Ha ocurrido un error desconocido",
  }
}
