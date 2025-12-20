// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export interface User {
  id: string
  name: string
  email: string
  tenantId?: string
  roleId?: number
  isActive: boolean
}

// Tenant Types
export interface TenantResponse {
  id: string
  name: string
  subdomain?: string
  isActive: boolean
  createdAt: string
  ownerId?: string
}

export interface CreateTenantRequest {
  name: string
  subdomain?: string
  ownerId?: string
}

export interface UpdateTenantRequest {
  id: string
  name: string
  subdomain?: string
  isActive: boolean
}

// User Types
export interface UserResponse {
  id: string
  name: string
  email: string
  tenantId?: string
  roleId?: number
  isActive: boolean
  createdAt: string
  roleName?: string
  tenantName?: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  tenantId?: string
  roleId?: number
}

export interface UpdateUserRequest {
  id: string
  name: string
  email: string
  tenantId?: string
  roleId?: number
  isActive: boolean
}

// Role Types
export interface RoleResponse {
  id: number
  name: string
  description?: string
  isActive: boolean
  createdAt: string
}

export interface CreateRoleRequest {
  name: string
  description?: string
}

export interface UpdateRoleRequest {
  id: number
  name: string
  description?: string
  isActive: boolean
}

// Owner Types
export interface OwnerResponse {
  id: string
  name: string
  email: string
  isActive: boolean
  createdAt: string
  tenantsCount?: number
}

export interface CreateOwnerRequest {
  name: string
  email: string
  password: string
}

export interface UpdateOwnerRequest {
  id: string
  name: string
  email: string
  isActive: boolean
}

// API Response Types
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
}

// Token Types
export interface TokenPayload {
  userId: string
  email?: string
  exp?: number
  iat?: number
}
