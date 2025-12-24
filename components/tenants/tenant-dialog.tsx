"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { tenantService } from "@/services/tenant.service"
import type { TenantResponse, CreateTenantRequest, UpdateTenantRequest } from "@/types"
import { getErrorMessage, getFieldErrors } from "@/lib/error-handler"
import { useAuth } from "@/contexts/auth-context"
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

interface TenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: TenantResponse | null
  onSuccess: () => void
}

export function TenantDialog({ open, onOpenChange, tenant, onSuccess }: TenantDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateTenantRequest>({
    businessName: "",
    fantasyName: "",
    taxIdNumber: "",
    countryId: 0,
    email: "",
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
    businessType: 0,
    domain: "",
    ownerId: "",
    vat: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (tenant) {
      setFormData({
        businessName: tenant.businessName,
        fantasyName: tenant.fantasyName,
        taxIdNumber: tenant.taxIdNumber,
        countryId: tenant.countryId,
        email: tenant.email,
        phoneCountryCode: tenant.phoneCountryCode,
        phoneAreaCode: tenant.phoneAreaCode,
        phoneNumber: tenant.phoneNumber,
        streetName: tenant.streetName,
        streetNumber: tenant.streetNumber,
        floor: tenant.floor || "",
        apartment: tenant.apartment || "",
        city: tenant.city,
        state: tenant.state,
        zipCode: tenant.zipCode,
        businessType: tenant.businessType,
        domain: tenant.domain,
        ownerId: tenant.ownerId,
        vat: tenant.vat,
      })
    } else {
      setFormData({
        businessName: "",
        fantasyName: "",
        taxIdNumber: "",
        countryId: 0,
        email: "",
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
        businessType: 0,
        domain: "",
        ownerId: user?.ownerId || "",
        vat: "",
      })
    }
    setFieldErrors({})
  }, [tenant, open, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFieldErrors({})

    try {
      if (tenant) {
        const updateData: UpdateTenantRequest = {
          ...formData,
          id: tenant.id,
        }
        await tenantService.update(updateData)
        toast({
          title: "Éxito",
          description: "Tenant actualizado correctamente",
        })
      } else {
        await tenantService.create(formData)
        toast({
          title: "Éxito",
          description: "Tenant creado correctamente",
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
        <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle>{tenant ? "Editar Tenant" : "Nuevo Tenant"}</DialogTitle>
            <DialogDescription>
              {tenant ? "Modifica los datos del tenant" : "Crea un nuevo tenant en el sistema"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 overscroll-contain">
            <div className="grid gap-4">
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Información del Negocio</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="businessName">
                      Razón Social <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      disabled={isLoading}
                      placeholder="Empresa S.A."
                      maxLength={150}
                      className={getFieldError("BusinessName") ? "border-destructive" : ""}
                    />
                    {getFieldError("BusinessName") && (
                      <p className="text-xs text-destructive">{getFieldError("BusinessName")}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="fantasyName">
                      Nombre Fantasía <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fantasyName"
                      value={formData.fantasyName}
                      onChange={(e) => setFormData({ ...formData, fantasyName: e.target.value })}
                      disabled={isLoading}
                      placeholder="Mi Empresa"
                      maxLength={150}
                      className={getFieldError("FantasyName") ? "border-destructive" : ""}
                    />
                    {getFieldError("FantasyName") && (
                      <p className="text-xs text-destructive">{getFieldError("FantasyName")}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="taxIdNumber">
                      CUIT/Tax ID <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="taxIdNumber"
                      value={formData.taxIdNumber}
                      onChange={(e) => setFormData({ ...formData, taxIdNumber: e.target.value })}
                      disabled={isLoading}
                      placeholder="20-12345678-9"
                      className={getFieldError("TaxIdNumber") ? "border-destructive" : ""}
                    />
                    {getFieldError("TaxIdNumber") && (
                      <p className="text-xs text-destructive">{getFieldError("TaxIdNumber")}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="vat">
                      VAT <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="vat"
                      value={formData.vat}
                      onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
                      disabled={isLoading}
                      placeholder="IVA Responsable Inscripto"
                      maxLength={50}
                      className={getFieldError("Vat") ? "border-destructive" : ""}
                    />
                    {getFieldError("Vat") && <p className="text-xs text-destructive">{getFieldError("Vat")}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="countryId">
                      País ID <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="countryId"
                      type="number"
                      value={formData.countryId || ""}
                      onChange={(e) => setFormData({ ...formData, countryId: Number(e.target.value) })}
                      disabled={isLoading}
                      placeholder="1"
                      className={getFieldError("CountryId") ? "border-destructive" : ""}
                    />
                    {getFieldError("CountryId") && (
                      <p className="text-xs text-destructive">{getFieldError("CountryId")}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="businessType">
                      Tipo de Negocio <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="businessType"
                      type="number"
                      value={formData.businessType || ""}
                      onChange={(e) => setFormData({ ...formData, businessType: Number(e.target.value) })}
                      disabled={isLoading}
                      placeholder="1"
                      className={getFieldError("BusinessType") ? "border-destructive" : ""}
                    />
                    {getFieldError("BusinessType") && (
                      <p className="text-xs text-destructive">{getFieldError("BusinessType")}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="domain">
                    Dominio <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    disabled={isLoading}
                    placeholder="empresa.com"
                    maxLength={200}
                    className={getFieldError("Domain") ? "border-destructive" : ""}
                  />
                  {getFieldError("Domain") && <p className="text-xs text-destructive">{getFieldError("Domain")}</p>}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Información de Contacto</h3>
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
                    placeholder="contacto@empresa.com"
                    maxLength={150}
                    className={getFieldError("Email") ? "border-destructive" : ""}
                  />
                  {getFieldError("Email") && <p className="text-xs text-destructive">{getFieldError("Email")}</p>}
                </div>

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
                      maxLength={20}
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
                      maxLength={150}
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
                      maxLength={20}
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
                      maxLength={10}
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
                      maxLength={10}
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
                      maxLength={100}
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
                      maxLength={100}
                      className={getFieldError("State") ? "border-destructive" : ""}
                    />
                    {getFieldError("State") && <p className="text-xs text-destructive">{getFieldError("State")}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="zipCode">
                      Código Postal <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      disabled={isLoading}
                      placeholder="C1000"
                      maxLength={20}
                      className={getFieldError("ZipCode") ? "border-destructive" : ""}
                    />
                    {getFieldError("ZipCode") && <p className="text-xs text-destructive">{getFieldError("ZipCode")}</p>}
                  </div>
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
              {tenant ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
