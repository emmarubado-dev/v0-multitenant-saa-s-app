import type { AxiosError } from "axios"
import type { ApiError } from "@/types"

export function getErrorMessage(error: unknown): string {
  if (!error) return "Ha ocurrido un error desconocido"

  const axiosError = error as AxiosError<ApiError>

  // Check if it's an API validation error with errors object
  if (axiosError.response?.data?.errors) {
    const errors = axiosError.response.data.errors
    const errorMessages: string[] = []

    // Collect all error messages from all fields
    Object.entries(errors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        messages.forEach((msg) => errorMessages.push(msg))
      }
    })

    // Return all messages joined
    return errorMessages.length > 0 ? errorMessages.join(". ") : "Error de validación"
  }

  // Check for title or generic message
  if (axiosError.response?.data?.title) {
    return axiosError.response.data.title
  }

  // Check for generic error message
  if (axiosError.message) {
    return axiosError.message
  }

  return "Ha ocurrido un error desconocido"
}

export function getFieldErrors(error: unknown): Record<string, string[]> {
  if (!error) return {}

  const axiosError = error as AxiosError<ApiError>

  if (axiosError.response?.data?.errors) {
    return axiosError.response.data.errors
  }

  return {}
}
