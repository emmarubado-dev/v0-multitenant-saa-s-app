import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Verificar si hay token en las cookies o headers
  const token = request.cookies.get("accessToken")?.value

  // Si es ruta pública y está autenticado, redirigir al dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Si es ruta protegida y no está autenticado, redirigir al login
  if (!isPublicRoute && !token && pathname !== "/login") {
    // Guardar la URL original para redirigir después del login
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
