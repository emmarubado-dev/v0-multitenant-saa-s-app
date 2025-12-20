"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Shield, Crown } from "lucide-react"

export default function DashboardPage() {
  const { user, selectedTenantId, tenants } = useAuth()

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bienvenido, {user?.name}</h2>
        <p className="text-muted-foreground mt-2">
          {selectedTenant ? `Trabajando en: ${selectedTenant.name}` : "Sistema Multi-Tenant"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
            <p className="text-xs text-muted-foreground">Organizaciones activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Total de usuarios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Roles configurados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Owners</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Propietarios registrados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>Detalles de configuración multi-tenant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm font-medium">Usuario Actual:</span>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm font-medium">Tenant Seleccionado:</span>
              <span className="text-sm text-muted-foreground">{selectedTenant?.name || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado:</span>
              <span className="text-sm text-green-600 font-medium">Activo</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>Navegación rápida a módulos principales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/dashboard/tenants"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Gestionar Tenants</span>
            </a>
            <a
              href="/dashboard/users"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Gestionar Usuarios</span>
            </a>
            <a
              href="/dashboard/roles"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Gestionar Roles</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
