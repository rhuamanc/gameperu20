import { NextResponse } from 'next/server'
import { Banner } from '@/lib/types'
import { deleteBannerById, updateBannerById } from '@/lib/server/bannersStore'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, isValidAdminSession } from '@/lib/server/adminAuth'

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    if (!isValidAdminSession(session)) {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
    }

    const { id } = await context.params
    const body = (await request.json()) as Partial<Banner>
    const updated = await updateBannerById(id, body)
    if (!updated) {
      return NextResponse.json({ message: 'Banner no encontrado.' }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ message: 'No se pudo actualizar el banner.' }, { status: 400 })
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    if (!isValidAdminSession(session)) {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
    }

    const { id } = await context.params
    const ok = await deleteBannerById(id)
    if (!ok) {
      return NextResponse.json({ message: 'Banner no encontrado.' }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'No se pudo eliminar el banner.' }, { status: 400 })
  }
}
