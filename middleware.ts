import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_PUBLIC_PATH, isValidAdminSession } from '@/lib/server/adminAuth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === ADMIN_PUBLIC_PATH || pathname.startsWith(`${ADMIN_PUBLIC_PATH}/`)) {
    const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    const isLoginPage = pathname === ADMIN_PUBLIC_PATH
    const isAuthed = isValidAdminSession(session)

    if (!isAuthed && !isLoginPage) {
      return NextResponse.redirect(new URL(ADMIN_PUBLIC_PATH, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/adminstyven24/:path*'],
}
