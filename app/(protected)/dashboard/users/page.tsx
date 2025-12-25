"use client"

import { useState, useEffect } from "react"
import { userService } from "@/services/user.service"
import { tenantService } from "@/services/tenant.service"
import { roleService } from "@/services/role.service"
import { useAuth } from "@/contexts/auth-context"
import type { UserResponse, TenantResponse, RoleResponse } from "@/types"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DataTable, type ColumnDef } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserDialog } from "@/components/users/user-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [tenants, setTenants] = useState<TenantResponse[]>([])
  const [roles, setRoles] = useState<RoleResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null)
  const { toast } = useToast()
  const { selectedTenantId } = useAuth()

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [usersData, tenantsData, rolesData] = await Promise.all([
        userService.getAll(),
        tenantService.getAll(),
        roleService.getAll(),
      ])
      setUsers(usersData)
      setTenants(tenantsData)
      setRoles(rolesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedTenantId) {
      console.log("[v0] Tenant changed, reloading users for tenant:", selectedTenantId)
      loadData()
    }
  }, [selectedTenantId])

  const handleCreate = () => {
    setSelectedUser(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (user: UserResponse) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleDelete = (user: UserResponse) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      await userService.delete(userToDelete.id)
      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setSelectedUser(null)
    loadData()
  }

  const columns: ColumnDef<UserResponse>[] = [
    {
      key: "fullName",
      header: "Nombre",
      cell: (user) => <span className="font-medium">{user.fullName}</span>,
      accessor: (user) => user.fullName,
      minWidth: "min-w-[150px]",
    },
    {
      key: "email",
      header: "Email",
      cell: (user) => user.email,
      accessor: (user) => user.email,
      minWidth: "min-w-[200px]",
    },
    {
      key: "username",
      header: "Username",
      cell: (user) => user.username,
      accessor: (user) => user.username,
      minWidth: "min-w-[120px]",
    },
    {
      key: "createdAt",
      header: "Fecha Creación",
      cell: (user) => new Date(user.createdAt).toLocaleDateString(),
      accessor: (user) => new Date(user.createdAt).toISOString(),
      minWidth: "min-w-[120px]",
    },
    {
      key: "actions",
      header: "Acciones",
      cell: (user) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(user)}
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
          <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-muted-foreground">Gestiona los usuarios del sistema</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {users.length} {users.length === 1 ? "usuario registrado" : "usuarios registrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={users} columns={columns} emptyMessage="No hay usuarios registrados" />
        </CardContent>
      </Card>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        tenants={tenants}
        roles={roles}
        onSuccess={handleSuccess}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="¿Eliminar usuario?"
        description={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.fullName}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}
