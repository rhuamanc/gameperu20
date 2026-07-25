import { NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, getAdminCookieConfig } from '@/lib/server/adminAuth'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    ...getAdminCookieConfig(),
    maxAge: 0,
  })
  return response
}
