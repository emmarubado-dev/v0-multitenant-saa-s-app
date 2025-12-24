"use client"

import { useState, useEffect } from "react"
import { roleService } from "@/services/role.service"
import { useAuth } from "@/contexts/auth-context"
import type { RoleResponse } from "@/types"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RoleDialog } from "@/components/roles/role-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<RoleResponse | null>(null)
  const { toast } = useToast()
  const { selectedTenantId } = useAuth()

  const loadData = async () => {
    try {
      setIsLoading(true)
      const rolesData = await roleService.getAll()
      setRoles(rolesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los roles",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedTenantId) {
      console.log("[v0] Tenant changed, reloading roles for tenant:", selectedTenantId)
      loadData()
    }
  }, [selectedTenantId])

  const handleCreate = () => {
    setSelectedRole(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (role: RoleResponse) => {
    setSelectedRole(role)
    setIsDialogOpen(true)
  }

  const handleDelete = (role: RoleResponse) => {
    setRoleToDelete(role)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!roleToDelete) return

    try {
      await roleService.delete(roleToDelete.id)
      toast({
        title: "Éxito",
        description: "Rol eliminado correctamente",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el rol",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setSelectedRole(null)
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
          <h2 className="text-2xl font-bold tracking-tight">Roles</h2>
          <p className="text-muted-foreground">Gestiona los roles y permisos del sistema</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Rol
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Roles</CardTitle>
          <CardDescription>
            {roles.length} {roles.length === 1 ? "rol configurado" : "roles configurados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[150px]">Nombre</TableHead>
                  <TableHead className="min-w-[120px]">Fecha Creación</TableHead>
                  <TableHead className="text-right min-w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No hay roles configurados
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-mono text-muted-foreground">{role.id}</TableCell>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(role)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(role)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <RoleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} role={selectedRole} onSuccess={handleSuccess} />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="¿Eliminar rol?"
        description={`¿Estás seguro de que deseas eliminar el rol "${roleToDelete?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}
