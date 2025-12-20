"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ownerService } from "@/services/owner.service"
import type { OwnerResponse, CreateOwnerRequest, UpdateOwnerRequest } from "@/types"
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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface OwnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  owner: OwnerResponse | null
  onSuccess: () => void
}

export function OwnerDialog({ open, onOpenChange, owner, onSuccess }: OwnerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isActive: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (owner) {
      setFormData({
        name: owner.name,
        email: owner.email,
        password: "",
        isActive: owner.isActive,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        isActive: true,
      })
    }
  }, [owner])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (owner) {
        const updateData: UpdateOwnerRequest = {
          id: owner.id,
          name: formData.name,
          email: formData.email,
          isActive: formData.isActive,
        }
        await ownerService.update(updateData)
        toast({
          title: "Éxito",
          description: "Owner actualizado correctamente",
        })
      } else {
        if (!formData.password) {
          toast({
            title: "Error",
            description: "La contraseña es requerida para crear un owner",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        const createData: CreateOwnerRequest = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
        await ownerService.create(createData)
        toast({
          title: "Éxito",
          description: "Owner creado correctamente",
        })
      }
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo ${owner ? "actualizar" : "crear"} el owner`,
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
            <DialogTitle>{owner ? "Editar Owner" : "Nuevo Owner"}</DialogTitle>
            <DialogDescription>
              {owner ? "Modifica los datos del owner" : "Crea un nuevo owner en el sistema"}
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
                placeholder="María García"
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
                placeholder="maria@ejemplo.com"
              />
            </div>

            {!owner && (
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

            {owner && (
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
              {owner ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
