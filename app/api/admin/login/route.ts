import { NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, getAdminCookieConfig, isValidAdminPassword } from '@/lib/server/adminAuth'
import { getAdminSessionValue } from '@/lib/server/adminAuth'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string }
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!isValidAdminPassword(password)) {
      return NextResponse.json({ message: 'Contraseña incorrecta.' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(ADMIN_COOKIE_NAME, getAdminSessionValue(), getAdminCookieConfig())
    return response
  } catch {
    return NextResponse.json({ message: 'No se pudo iniciar sesión.' }, { status: 400 })
  }
}
