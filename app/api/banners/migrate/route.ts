import { NextResponse } from 'next/server'
import { Banner } from '@/lib/types'
import { upsertManyBanners } from '@/lib/server/bannersStore'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, isValidAdminSession } from '@/lib/server/adminAuth'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    if (!isValidAdminSession(session)) {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
    }

    const body = (await request.json()) as { banners?: Banner[] }
    const banners = Array.isArray(body?.banners) ? body.banners : []
    await upsertManyBanners(banners)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'No se pudo migrar banners.' }, { status: 400 })
  }
}
