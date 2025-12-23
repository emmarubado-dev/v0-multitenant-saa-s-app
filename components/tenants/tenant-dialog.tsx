"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { tenantService } from "@/services/tenant.service"
import type { TenantResponse, OwnerResponse, CreateTenantRequest, UpdateTenantRequest } from "@/types"
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

interface TenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: TenantResponse | null
  owners: OwnerResponse[]
  onSuccess: () => void
}

export function TenantDialog({ open, onOpenChange, tenant, owners, onSuccess }: TenantDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    ownerId: "",
    isActive: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        subdomain: tenant.subdomain || "",
        ownerId: tenant.ownerId || "",
        isActive: tenant.isActive,
      })
    } else {
      setFormData({
        name: "",
        subdomain: "",
        ownerId: "",
        isActive: true,
      })
    }
  }, [tenant])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (tenant) {
        const updateData: UpdateTenantRequest = {
          id: tenant.id,
          name: formData.name,
          subdomain: formData.subdomain || undefined,
          isActive: formData.isActive,
        }
        await tenantService.update(updateData)
        toast({
          title: "Éxito",
          description: "Tenant actualizado correctamente",
        })
      } else {
        const createData: CreateTenantRequest = {
          name: formData.name,
          subdomain: formData.subdomain || undefined,
          ownerId: formData.ownerId || undefined,
        }
        await tenantService.create(createData)
        toast({
          title: "Éxito",
          description: "Tenant creado correctamente",
        })
      }
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo ${tenant ? "actualizar" : "crear"} el tenant`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{tenant ? "Editar Tenant" : "Nuevo Tenant"}</DialogTitle>
            <DialogDescription>
              {tenant ? "Modifica los datos del tenant" : "Crea un nuevo tenant en el sistema"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 py-4">
            <div className="grid gap-4">
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
                  placeholder="Acme Corporation"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subdomain">Subdominio</Label>
                <Input
                  id="subdomain"
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                  disabled={isLoading}
                  placeholder="acme"
                />
              </div>

              {!tenant && (
                <div className="grid gap-2">
                  <Label htmlFor="ownerId">Owner</Label>
                  <Select
                    value={formData.ownerId}
                    onValueChange={(value) => setFormData({ ...formData, ownerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {owners.map((owner) => (
                        <SelectItem key={owner.id} value={owner.id}>
                          {owner.name} - {owner.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {tenant && (
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

          <DialogFooter className="flex-shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {tenant ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
