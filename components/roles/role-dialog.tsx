"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { roleService } from "@/services/role.service"
import { actionService } from "@/services/action.service"
import type { RoleResponse, CreateRoleRequest, UpdateRoleRequest, ActionDto } from "@/types"
import { getErrorMessage, getFieldErrors } from "@/lib/error-handler"
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
import { Checkbox } from "@/components/ui/checkbox"
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
  const [actions, setActions] = useState<ActionDto[]>([])
  const [selectedActions, setSelectedActions] = useState<number[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadActions()
    }
  }, [open])

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
    setFieldErrors({})
    setSelectedActions([])
  }, [role, open])

  const loadActions = async () => {
    try {
      const data = await actionService.getAll()
      setActions(data)
    } catch (error) {
      console.error("[v0] Error loading actions:", error)
    }
  }

  const handleActionToggle = (actionId: number) => {
    setSelectedActions((prev) => (prev.includes(actionId) ? prev.filter((id) => id !== actionId) : [...prev, actionId]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFieldErrors({})

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
      onOpenChange(false)
    } catch (error) {
      const errors = getFieldErrors(error)
      setFieldErrors(errors)

      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName]?.[0]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90dvh] p-0 overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle>{role ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
            <DialogDescription>
              {role ? "Modifica los datos del rol" : "Crea un nuevo rol en el sistema"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 overscroll-contain">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                  placeholder="Administrador"
                  className={getFieldError("Name") ? "border-destructive" : ""}
                />
                {getFieldError("Name") && <p className="text-xs text-destructive">{getFieldError("Name")}</p>}
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
                  className={getFieldError("Description") ? "border-destructive" : ""}
                />
                {getFieldError("Description") && (
                  <p className="text-xs text-destructive">{getFieldError("Description")}</p>
                )}
              </div>

              {!role && actions.length > 0 && (
                <div className="grid gap-2">
                  <Label>Acciones del Rol</Label>
                  <div className="space-y-2 border rounded-md p-3">
                    {actions.map((action) => (
                      <div key={action.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`action-${action.id}`}
                          checked={selectedActions.includes(action.id!)}
                          onCheckedChange={() => handleActionToggle(action.id!)}
                          disabled={isLoading}
                        />
                        <label
                          htmlFor={`action-${action.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {action.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
          </div>

          <DialogFooter className="px-6 py-4 border-t flex-shrink-0">
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
