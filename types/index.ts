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
  isOwner: boolean
  tenantId?: string
  roleId?: number
  isActive: boolean
  ownerId: string
}

// Tenant Types
export interface TenantResponse {
  id: string
  businessName: string
  fantasyName: string
  taxIdNumber: string
  countryId: number
  email: string
  phoneCountryCode: string
  phoneAreaCode: string
  phoneNumber: string
  streetName: string
  streetNumber: string
  floor: string | null
  apartment: string | null
  city: string
  state: string
  zipCode: string
  businessType: number
  domain: string
  ownerId: string
  vat: string
  createdAt: Date
}

export interface CreateTenantRequest {
  businessName: string
  fantasyName: string
  taxIdNumber: string
  countryId: number
  email: string
  phoneCountryCode: string
  phoneAreaCode: string
  phoneNumber: string
  streetName: string
  streetNumber: string
  floor?: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  businessType: number
  domain: string
  ownerId: string
  vat: string
}

export interface UpdateTenantRequest {
  id: string
  businessName: string
  fantasyName: string
  taxIdNumber: string
  countryId: number
  email: string
  phoneCountryCode: string
  phoneAreaCode: string
  phoneNumber: string
  streetName: string
  streetNumber: string
  floor?: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  businessType: number
  domain: string
  ownerId: string
  vat: string
}

// User Types
export interface UserResponse {
  id: string
  ownerId: string
  fullName: string
  username: string
  email: string
  phoneCountryCode: string
  phoneAreaCode: string
  phoneNumber: string
  isAdmin: boolean
  enabled: boolean
  createdAt: string
}

export interface CreateUserRequest {
  ownerId: string
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  phoneCountryCode: string
  phoneAreaCode: string
  phoneNumber: string
  isAdmin: boolean
  enabled: boolean
}

export interface UpdateUserRequest extends CreateUserRequest {
  id: string
}

// User Roles types for role assignment
export interface UserRoleTenantDto {
  id: string
  userId: string
  userName: string
  roleId: string
  roleName: string
  tenantId: string
  tenantName: string
  createdAt: string
  createdBy: string
}

export interface AssignUserRoleRequest {
  userId: string
  roleId: string
  tenantId: string
}

export interface UserRolesInTenantDto {
  userId: string
  userName: string
  tenantId: string
  roles: RoleBasicDto[]
}

export interface RoleBasicDto {
  id: string
  name: string
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
  firstName: string
  lastName: string
  email: string
  docType: string
  docNumber: string
  phoneCountryCode: string
  phoneAreaCode: string
  phoneNumber: string
  streetName: string
  streetNumber: string
  floor?: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  isActive: boolean
  createdAt: string
  tenantsCount?: number
}

export interface CreateOwnerRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  docType: string
  docNumber: string
  phoneCountryCode: string
  phoneAreaCode: string
  phoneNumber: string
  streetName: string
  streetNumber: string
  floor?: string
  apartment?: string
  city: string
  state: string
  zipCode: string
}

export interface UpdateOwnerRequest extends CreateOwnerRequest {
  id: string
}

// Action types for role-action management
export interface ActionDto {
  id: number
  name: string
}

export interface RoleActionCreateRequest {
  actionId: number
  roleId: string
}

// API Response Types
export interface ApiError {
  title?: string
  status?: number
  instance?: string
  traceId?: string
  errors?: Record<string, string[]>
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
  name: string
  email: string
  isowner: string
  exp?: number
  iat?: number
  ownerId: string
}

// User Permissions Types
export interface UserPermissions {
  userId: string
  tenantId: string
  actions: string[]
}
