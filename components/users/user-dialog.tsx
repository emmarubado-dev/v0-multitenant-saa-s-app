"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { userService } from "@/services/user.service"
import type { UserResponse, TenantResponse, RoleResponse, CreateUserRequest, UpdateUserRequest } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserResponse | null
  tenants: TenantResponse[]
  roles: RoleResponse[]
  onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, user, tenants, roles, onSuccess }: UserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    tenantId: "",
    roleId: "",
    isActive: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        tenantId: user.tenantId || "",
        roleId: user.roleId?.toString() || "",
        isActive: user.isActive,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        tenantId: "",
        roleId: "",
        isActive: true,
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (user) {
        const updateData: UpdateUserRequest = {
          id: user.id,
          name: formData.name,
          email: formData.email,
          tenantId: formData.tenantId || undefined,
          roleId: formData.roleId ? Number.parseInt(formData.roleId) : undefined,
          isActive: formData.isActive,
        }
        await userService.update(updateData)
        toast({
          title: "Éxito",
          description: "Usuario actualizado correctamente",
        })
      } else {
        if (!formData.password) {
          toast({
            title: "Error",
            description: "La contraseña es requerida para crear un usuario",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        const createData: CreateUserRequest = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          tenantId: formData.tenantId || undefined,
          roleId: formData.roleId ? Number.parseInt(formData.roleId) : undefined,
        }
        await userService.create(createData)
        toast({
          title: "Éxito",
          description: "Usuario creado correctamente",
        })
      }
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo ${user ? "actualizar" : "crear"} el usuario`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{user ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            <DialogDescription>
              {user ? "Modifica los datos del usuario" : "Crea un nuevo usuario en el sistema"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
                placeholder="Juan Pérez"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
                placeholder="juan@ejemplo.com"
              />
            </div>

            {!user && (
              <div className="grid gap-2">
                <Label htmlFor="password">
                  Contraseña <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="tenantId">Tenant</Label>
              <Select
                value={formData.tenantId}
                onValueChange={(value) => setFormData({ ...formData, tenantId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="roleId">Rol</Label>
              <Select value={formData.roleId} onValueChange={(value) => setFormData({ ...formData, roleId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {user && (
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Estado Activo</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {user ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
