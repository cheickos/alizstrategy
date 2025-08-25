import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Protect admin routes
  if (path.startsWith('/admin') && path !== '/admin') {
    // Check localStorage via cookie or session
    const userToken = request.cookies.get('userToken')?.value
    const isAdminStored = request.cookies.get('isAdmin')?.value === 'true'
    
    // For now, check if admin is set in any way
    if (!isAdminStored && !userToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}