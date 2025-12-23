"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ScrollBar } from "@/components/ui/scroll-area"
import { userService } from "@/services/user.service"
import { ownerService } from "@/services/owner.service"
import type { UserResponse, OwnerResponse, CreateUserRequest, UpdateUserRequest } from "@/types"
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
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserResponse | null
  onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [owners, setOwners] = useState<OwnerResponse[]>([])
  const [formData, setFormData] = useState<CreateUserRequest>({
    ownerId: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phoneCountryCode: "",
    phoneAreaCode: "",
    phoneNumber: "",
    isAdmin: false,
    enabled: true,
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadOwners()
    }
  }, [open])

  useEffect(() => {
    if (user) {
      setFormData({
        ownerId: user.ownerId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: "",
        phoneCountryCode: user.phoneCountryCode,
        phoneAreaCode: user.phoneAreaCode,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        enabled: user.enabled,
      })
    } else {
      setFormData({
        ownerId: "",
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        phoneCountryCode: "",
        phoneAreaCode: "",
        phoneNumber: "",
        isAdmin: false,
        enabled: true,
      })
    }
    setFieldErrors({})
  }, [user, open])

  const loadOwners = async () => {
    try {
      const data = await ownerService.getAll()
      setOwners(data)
    } catch (error) {
      console.error("[v0] Error loading owners:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFieldErrors({})

    try {
      if (user) {
        const updateData: UpdateUserRequest = {
          ...formData,
          id: user.id,
        }
        await userService.update(updateData)
        toast({
          title: "Éxito",
          description: "Usuario actualizado correctamente",
        })
      } else {
        await userService.create(formData)
        toast({
          title: "Éxito",
          description: "Usuario creado correctamente",
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
      <DialogContent className="sm:max-w-[700px] h-[90dvh] p-0 overflow-hidden flex flex-col">
  <     form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
           <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle>{user ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            <DialogDescription>
              {user ? "Modifica los datos del usuario" : "Crea un nuevo usuario en el sistema"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 overscroll-contain">
            <div className="grid gap-4">
              {/* Owner Selection */}
              <div className="grid gap-2">
                <Label htmlFor="ownerId">
                  Owner <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.ownerId}
                  onValueChange={(value) => setFormData({ ...formData, ownerId: value })}
                >
                  <SelectTrigger className={getFieldError("OwnerId") ? "border-destructive" : ""}>
                    <SelectValue placeholder="Seleccionar owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        {owner.firstName} {owner.lastName} - {owner.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError("OwnerId") && <p className="text-xs text-destructive">{getFieldError("OwnerId")}</p>}
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Información Personal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">
                      Nombre <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={isLoading}
                      placeholder="Juan"
                      maxLength={50}
                      className={getFieldError("FirstName") ? "border-destructive" : ""}
                    />
                    {getFieldError("FirstName") && (
                      <p className="text-xs text-destructive">{getFieldError("FirstName")}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lastName">
                      Apellido <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={isLoading}
                      placeholder="Pérez"
                      maxLength={50}
                      className={getFieldError("LastName") ? "border-destructive" : ""}
                    />
                    {getFieldError("LastName") && (
                      <p className="text-xs text-destructive">{getFieldError("LastName")}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">
                    Nombre de Usuario <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={isLoading}
                    placeholder="juanperez"
                    maxLength={50}
                    className={getFieldError("Username") ? "border-destructive" : ""}
                  />
                  {getFieldError("Username") && <p className="text-xs text-destructive">{getFieldError("Username")}</p>}
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
                    disabled={isLoading}
                    placeholder="juan@ejemplo.com"
                    maxLength={255}
                    className={getFieldError("Email") ? "border-destructive" : ""}
                  />
                  {getFieldError("Email") && <p className="text-xs text-destructive">{getFieldError("Email")}</p>}
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
                      disabled={isLoading}
                      placeholder="Mínimo 6 caracteres"
                      maxLength={100}
                      className={getFieldError("Password") ? "border-destructive" : ""}
                    />
                    {getFieldError("Password") && (
                      <p className="text-xs text-destructive">{getFieldError("Password")}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Phone Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Teléfono</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phoneCountryCode">
                      País <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phoneCountryCode"
                      value={formData.phoneCountryCode}
                      onChange={(e) => setFormData({ ...formData, phoneCountryCode: e.target.value })}
                      disabled={isLoading}
                      placeholder="+54"
                      maxLength={5}
                      className={getFieldError("PhoneCountryCode") ? "border-destructive" : ""}
                    />
                    {getFieldError("PhoneCountryCode") && (
                      <p className="text-xs text-destructive">{getFieldError("PhoneCountryCode")}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phoneAreaCode">
                      Área <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phoneAreaCode"
                      value={formData.phoneAreaCode}
                      onChange={(e) => setFormData({ ...formData, phoneAreaCode: e.target.value })}
                      disabled={isLoading}
                      placeholder="11"
                      maxLength={10}
                      className={getFieldError("PhoneAreaCode") ? "border-destructive" : ""}
                    />
                    {getFieldError("PhoneAreaCode") && (
                      <p className="text-xs text-destructive">{getFieldError("PhoneAreaCode")}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">
                      Número <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      disabled={isLoading}
                      placeholder="12345678"
                      maxLength={20}
                      className={getFieldError("PhoneNumber") ? "border-destructive" : ""}
                    />
                    {getFieldError("PhoneNumber") && (
                      <p className="text-xs text-destructive">{getFieldError("PhoneNumber")}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Permisos</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isAdmin">Es Administrador</Label>
                  <Switch
                    id="isAdmin"
                    checked={formData.isAdmin}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAdmin: checked })}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enabled">Usuario Habilitado</Label>
                  <Switch
                    id="enabled"
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t flex-shrink-0">
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
