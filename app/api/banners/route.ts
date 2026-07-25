import { NextResponse } from 'next/server'
import { Banner } from '@/lib/types'
import { createBanner, getAllBanners } from '@/lib/server/bannersStore'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, isValidAdminSession } from '@/lib/server/adminAuth'

export async function GET() {
  try {
    const banners = await getAllBanners()
    return NextResponse.json(banners)
  } catch {
    return NextResponse.json({ message: 'No se pudieron listar los banners.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    if (!isValidAdminSession(session)) {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
    }

    const body = (await request.json()) as Omit<Banner, 'id'>
    const created = await createBanner(body)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'No se pudo crear el banner.' }, { status: 400 })
  }
}
