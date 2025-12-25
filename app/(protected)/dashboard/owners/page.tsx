"use client"

import { useState, useEffect } from "react"
import { ownerService } from "@/services/owner.service"
import { useAuth } from "@/contexts/auth-context"
import type { OwnerResponse } from "@/types"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DataTable, type ColumnDef } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { OwnerDialog } from "@/components/owners/owner-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OwnersPage() {
  const [owners, setOwners] = useState<OwnerResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOwner, setSelectedOwner] = useState<OwnerResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [ownerToDelete, setOwnerToDelete] = useState<OwnerResponse | null>(null)
  const { toast } = useToast()
  const { selectedTenantId } = useAuth()

  const loadData = async () => {
    try {
      setIsLoading(true)
      const ownersData = await ownerService.getAll()
      setOwners(ownersData)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los owners",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedTenantId) {
      console.log("[v0] Tenant changed, reloading owners for tenant:", selectedTenantId)
      loadData()
    }
  }, [selectedTenantId])

  const handleCreate = () => {
    setSelectedOwner(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (owner: OwnerResponse) => {
    setSelectedOwner(owner)
    setIsDialogOpen(true)
  }

  const handleDelete = (owner: OwnerResponse) => {
    setOwnerToDelete(owner)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!ownerToDelete) return

    try {
      await ownerService.delete(ownerToDelete.id)
      toast({
        title: "Éxito",
        description: "Owner eliminado correctamente",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el owner",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setOwnerToDelete(null)
    }
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setSelectedOwner(null)
    loadData()
  }

  const columns: ColumnDef<OwnerResponse>[] = [
    {
      key: "name",
      header: "Nombre",
      cell: (owner) => <span className="font-medium">{`${owner.firstName} ${owner.lastName}`}</span>,
      accessor: (owner) => `${owner.firstName} ${owner.lastName}`,
      minWidth: "min-w-[200px]",
    },
    {
      key: "email",
      header: "Email",
      cell: (owner) => owner.email,
      accessor: (owner) => owner.email,
      minWidth: "min-w-[200px]",
    },
    {
      key: "tenantsCount",
      header: "Tenants",
      cell: (owner) => <Badge variant="outline">{owner.tenantsCount || 0}</Badge>,
      accessor: (owner) => String(owner.tenantsCount || 0),
      minWidth: "min-w-[100px]",
    },
    {
      key: "isActive",
      header: "Estado",
      cell: (owner) => (
        <Badge variant={owner.isActive ? "default" : "secondary"}>{owner.isActive ? "Activo" : "Inactivo"}</Badge>
      ),
      accessor: (owner) => (owner.isActive ? "Activo" : "Inactivo"),
      minWidth: "min-w-[100px]",
    },
    {
      key: "createdAt",
      header: "Fecha Creación",
      cell: (owner) => new Date(owner.createdAt).toLocaleDateString(),
      accessor: (owner) => new Date(owner.createdAt).toISOString(),
      minWidth: "min-w-[120px]",
    },
    {
      key: "actions",
      header: "Acciones",
      cell: (owner) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(owner)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(owner)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      sortable: false,
      filterable: false,
      minWidth: "min-w-[100px] text-right",
    },
  ]

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
          <h2 className="text-2xl font-bold tracking-tight">Owners</h2>
          <p className="text-muted-foreground">Gestiona los propietarios de tenants</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Owner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Owners</CardTitle>
          <CardDescription>
            {owners.length} {owners.length === 1 ? "owner registrado" : "owners registrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={owners} columns={columns} emptyMessage="No hay owners registrados" />
        </CardContent>
      </Card>

      <OwnerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} owner={selectedOwner} onSuccess={handleSuccess} />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="¿Eliminar owner?"
        description={`¿Estás seguro de que deseas eliminar al owner "${ownerToDelete?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}
