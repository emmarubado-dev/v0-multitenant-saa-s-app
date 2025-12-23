"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ownerService } from "@/services/owner.service"
import type { OwnerResponse, CreateOwnerRequest, UpdateOwnerRequest } from "@/types"
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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OwnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  owner: OwnerResponse | null
  onSuccess: () => void
}

export function OwnerDialog({ open, onOpenChange, owner, onSuccess }: OwnerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateOwnerRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    docType: "",
    docNumber: "",
    phoneCountryCode: "",
    phoneAreaCode: "",
    phoneNumber: "",
    streetName: "",
    streetNumber: "",
    floor: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const { toast } = useToast()

  useEffect(() => {
    if (owner) {
      setFormData({
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        password: "",
        docType: owner.docType,
        docNumber: owner.docNumber,
        phoneCountryCode: owner.phoneCountryCode,
        phoneAreaCode: owner.phoneAreaCode,
        phoneNumber: owner.phoneNumber,
        streetName: owner.streetName,
        streetNumber: owner.streetNumber,
        floor: owner.floor || "",
        apartment: owner.apartment || "",
        city: owner.city,
        state: owner.state,
        zipCode: owner.zipCode,
      })
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        docType: "",
        docNumber: "",
        phoneCountryCode: "",
        phoneAreaCode: "",
        phoneNumber: "",
        streetName: "",
        streetNumber: "",
        floor: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
      })
    }
    setFieldErrors({})
  }, [owner, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFieldErrors({})

    try {
      if (owner) {
        const updateData: UpdateOwnerRequest = {
          ...formData,
          id: owner.id,
        }
        await ownerService.update(updateData)
        toast({
          title: "Éxito",
          description: "Owner actualizado correctamente",
        })
      } else {
        await ownerService.create(formData)
        toast({
          title: "Éxito",
          description: "Owner creado correctamente",
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{owner ? "Editar Owner" : "Nuevo Owner"}</DialogTitle>
            <DialogDescription>
              {owner ? "Modifica los datos del owner" : "Crea un nuevo owner en el sistema"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 -mx-6 px-6 my-4" style={{ maxHeight: "calc(90vh - 180px)" }}>
            <div className="grid gap-4 pr-4">
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
                      placeholder="María"
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
                      placeholder="García"
                      className={getFieldError("LastName") ? "border-destructive" : ""}
                    />
                    {getFieldError("LastName") && (
                      <p className="text-xs text-destructive">{getFieldError("LastName")}</p>
                    )}
                  </div>
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
                    placeholder="maria@ejemplo.com"
                    className={getFieldError("Email") ? "border-destructive" : ""}
                  />
                  {getFieldError("Email") && <p className="text-xs text-destructive">{getFieldError("Email")}</p>}
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
                      disabled={isLoading}
                      placeholder="Mínimo 6 caracteres"
                      className={getFieldError("Password") ? "border-destructive" : ""}
                    />
                    {getFieldError("Password") && (
                      <p className="text-xs text-destructive">{getFieldError("Password")}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Document Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Documento</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="docType">
                      Tipo <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="docType"
                      value={formData.docType}
                      onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                      disabled={isLoading}
                      placeholder="DNI"
                      className={getFieldError("DocType") ? "border-destructive" : ""}
                    />
                    {getFieldError("DocType") && <p className="text-xs text-destructive">{getFieldError("DocType")}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="docNumber">
                      Número <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="docNumber"
                      value={formData.docNumber}
                      onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                      disabled={isLoading}
                      placeholder="12345678"
                      className={getFieldError("DocNumber") ? "border-destructive" : ""}
                    />
                    {getFieldError("DocNumber") && (
                      <p className="text-xs text-destructive">{getFieldError("DocNumber")}</p>
                    )}
                  </div>
                </div>
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
                      className={getFieldError("PhoneNumber") ? "border-destructive" : ""}
                    />
                    {getFieldError("PhoneNumber") && (
                      <p className="text-xs text-destructive">{getFieldError("PhoneNumber")}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Dirección</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="streetName">
                      Calle <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="streetName"
                      value={formData.streetName}
                      onChange={(e) => setFormData({ ...formData, streetName: e.target.value })}
                      disabled={isLoading}
                      placeholder="Av. Corrientes"
                      className={getFieldError("StreetName") ? "border-destructive" : ""}
                    />
                    {getFieldError("StreetName") && (
                      <p className="text-xs text-destructive">{getFieldError("StreetName")}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="streetNumber">
                      Número <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="streetNumber"
                      value={formData.streetNumber}
                      onChange={(e) => setFormData({ ...formData, streetNumber: e.target.value })}
                      disabled={isLoading}
                      placeholder="1234"
                      className={getFieldError("StreetNumber") ? "border-destructive" : ""}
                    />
                    {getFieldError("StreetNumber") && (
                      <p className="text-xs text-destructive">{getFieldError("StreetNumber")}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="floor">Piso</Label>
                    <Input
                      id="floor"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      disabled={isLoading}
                      placeholder="5"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="apartment">Depto</Label>
                    <Input
                      id="apartment"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      disabled={isLoading}
                      placeholder="A"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">
                      Ciudad <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={isLoading}
                      placeholder="Buenos Aires"
                      className={getFieldError("City") ? "border-destructive" : ""}
                    />
                    {getFieldError("City") && <p className="text-xs text-destructive">{getFieldError("City")}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="state">
                      Provincia <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      disabled={isLoading}
                      placeholder="CABA"
                      className={getFieldError("State") ? "border-destructive" : ""}
                    />
                    {getFieldError("State") && <p className="text-xs text-destructive">{getFieldError("State")}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="zipCode">
                      CP <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      disabled={isLoading}
                      placeholder="1000"
                      className={getFieldError("ZipCode") ? "border-destructive" : ""}
                    />
                    {getFieldError("ZipCode") && <p className="text-xs text-destructive">{getFieldError("ZipCode")}</p>}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="flex-shrink-0 mt-4">
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
