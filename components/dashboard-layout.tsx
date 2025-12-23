"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Users, Shield, Crown, Menu, X, LogOut, ChevronDown, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, ownerOnly: false },
  { name: "Tenants", href: "/dashboard/tenants", icon: Building2, ownerOnly: false },
  { name: "Usuarios", href: "/dashboard/users", icon: Users, ownerOnly: false },
  { name: "Roles", href: "/dashboard/roles", icon: Shield, ownerOnly: false },
  { name: "Owners", href: "/dashboard/owners", icon: Crown, ownerOnly: true },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, tenants, selectedTenantId, logout, setSelectedTenant } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId)

  const filteredNavigation = navigation.filter((item) => !item.ownerOnly || user?.isOwner)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar para desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-sidebar px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">Multi-Tenant</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Sidebar móvil */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar lg:hidden">
            <div className="flex h-full flex-col gap-y-5 overflow-y-auto px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
                  </div>
                  <span className="text-lg font-semibold text-sidebar-foreground">Multi-Tenant</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {filteredNavigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={cn(
                                "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors",
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              )}
                            >
                              <item.icon className="h-5 w-5 shrink-0" />
                              {item.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        </>
      )}

      {/* Contenido principal */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-foreground">
                {filteredNavigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Selector de Tenant */}
              {tenants.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Building2 className="h-4 w-4" />
                      <span className="hidden sm:inline">{selectedTenant?.businessName || "Seleccionar Tenant"}</span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Cambiar Tenant</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {tenants.map((tenant) => (
                      <DropdownMenuItem
                        key={tenant.id}
                        onClick={() => setSelectedTenant(tenant.id)}
                        className={cn(selectedTenantId === tenant.id && "bg-accent")}
                      >
                        <Building2 className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="font-medium">{tenant.businessName}</span>
                          {tenant.domain && (
                            <span className="text-xs text-muted-foreground">{tenant.domain}</span>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Menú de usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      {user?.isOwner && <p className="text-xs leading-none text-primary font-medium">Owner</p>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
