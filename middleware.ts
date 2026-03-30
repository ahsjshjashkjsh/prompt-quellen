// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page through
  if (pathname === '/login') return NextResponse.next()

  const cookie = request.cookies.get(AUTH_COOKIE)
  const sitePassword = process.env.SITE_PASSWORD

  if (!cookie || cookie.value !== sitePassword) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
