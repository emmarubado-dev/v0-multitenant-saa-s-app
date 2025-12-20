"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log("[v0] AuthGuard check - Loading:", isLoading, "User:", user?.email || "none", "Path:", pathname)

    if (!isLoading && !user) {
      console.log("[v0] No user found, redirecting to login...")
      router.push("/login")
    } else if (!isLoading && user) {
      console.log("[v0] User authenticated:", user.email)
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    console.log("[v0] AuthGuard loading...")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    console.log("[v0] AuthGuard blocking - no user")
    return null
  }

  console.log("[v0] AuthGuard allowing access")
  return <>{children}</>
}
