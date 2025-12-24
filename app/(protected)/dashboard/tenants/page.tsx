"use client"

import { useState, useEffect } from "react"
import { tenantService } from "@/services/tenant.service"
import { ownerService } from "@/services/owner.service"
import { useAuth } from "@/contexts/auth-context"
import type { TenantResponse, OwnerResponse } from "@/types"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TenantDialog } from "@/components/tenants/tenant-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantResponse[]>([])
  const [owners, setOwners] = useState<OwnerResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTenant, setSelectedTenant] = useState<TenantResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tenantToDelete, setTenantToDelete] = useState<TenantResponse | null>(null)
  const { toast } = useToast()
  const { selectedTenantId } = useAuth()

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [tenantsData, ownersData] = await Promise.all([tenantService.getAll(), ownerService.getAll()])
      setTenants(tenantsData)
      setOwners(ownersData)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los tenants",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedTenantId) {
      console.log("[v0] Tenant changed, reloading tenants for tenant:", selectedTenantId)
      loadData()
    }
  }, [selectedTenantId])

  const handleCreate = () => {
    setSelectedTenant(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (tenant: TenantResponse) => {
    setSelectedTenant(tenant)
    setIsDialogOpen(true)
  }

  const handleDelete = (tenant: TenantResponse) => {
    setTenantToDelete(tenant)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!tenantToDelete) return

    try {
      await tenantService.delete(tenantToDelete.id)
      toast({
        title: "Éxito",
        description: "Tenant eliminado correctamente",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el tenant",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setTenantToDelete(null)
    }
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setSelectedTenant(null)
    loadData()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tenants</h2>
          <p className="text-muted-foreground">Gestiona las organizaciones del sistema</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Tenant
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tenants</CardTitle>
          <CardDescription>
            {tenants.length} {tenants.length === 1 ? "tenant registrado" : "tenants registrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Nombre</TableHead>
                  <TableHead className="min-w-[150px]">Subdominio</TableHead>
                  <TableHead className="min-w-[120px]">Fecha Creación</TableHead>
                  <TableHead className="text-right min-w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No hay tenants registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  tenants.map((tenant) => {
                    const owner = owners.find((o) => o.id === tenant.ownerId)
                    return (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">{tenant.businessName}</TableCell>
                        <TableCell>{tenant.domain || "-"}</TableCell>
                        <TableCell>{new Date(tenant.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(tenant)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(tenant)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TenantDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tenant={selectedTenant}
        owners={owners}
        onSuccess={handleSuccess}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="¿Eliminar tenant?"
        description={`¿Estás seguro de que deseas eliminar el tenant "${tenantToDelete?.businessName}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}
