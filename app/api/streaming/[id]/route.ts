import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { StreamingProduct } from '@/lib/types'
import { ADMIN_COOKIE_NAME, isValidAdminSession } from '@/lib/server/adminAuth'
import { deleteStreamingById, updateStreamingById } from '@/lib/server/streamingStore'

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
    const body = (await request.json()) as Partial<StreamingProduct>
    const updated = await updateStreamingById(id, body)
    if (!updated) {
      return NextResponse.json({ message: 'Producto no encontrado.' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ message: 'No se pudo actualizar el producto.' }, { status: 400 })
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
    const ok = await deleteStreamingById(id)
    if (!ok) {
      return NextResponse.json({ message: 'Producto no encontrado.' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'No se pudo eliminar el producto.' }, { status: 400 })
  }
}
