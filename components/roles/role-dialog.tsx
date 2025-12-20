"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { roleService } from "@/services/role.service"
import type { RoleResponse, CreateRoleRequest, UpdateRoleRequest } from "@/types"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: RoleResponse | null
  onSuccess: () => void
}

export function RoleDialog({ open, onOpenChange, role, onSuccess }: RoleDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || "",
        isActive: role.isActive,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        isActive: true,
      })
    }
  }, [role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (role) {
        const updateData: UpdateRoleRequest = {
          id: role.id,
          name: formData.name,
          description: formData.description || undefined,
          isActive: formData.isActive,
        }
        await roleService.update(updateData)
        toast({
          title: "Éxito",
          description: "Rol actualizado correctamente",
        })
      } else {
        const createData: CreateRoleRequest = {
          name: formData.name,
          description: formData.description || undefined,
        }
        await roleService.create(createData)
        toast({
          title: "Éxito",
          description: "Rol creado correctamente",
        })
      }
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo ${role ? "actualizar" : "crear"} el rol`,
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
            <DialogTitle>{role ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
            <DialogDescription>
              {role ? "Modifica los datos del rol" : "Crea un nuevo rol en el sistema"}
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
                placeholder="Administrador"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isLoading}
                placeholder="Descripción del rol y sus permisos..."
                rows={3}
              />
            </div>

            {role && (
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
              {role ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
