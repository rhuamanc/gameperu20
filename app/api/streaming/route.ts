import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { StreamingProduct } from '@/lib/types'
import { ADMIN_COOKIE_NAME, isValidAdminSession } from '@/lib/server/adminAuth'
import { createStreaming, getAllStreaming } from '@/lib/server/streamingStore'

export async function GET() {
  try {
    const items = await getAllStreaming()
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ message: 'No se pudieron listar los productos de streaming.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    if (!isValidAdminSession(session)) {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
    }

    const body = (await request.json()) as Omit<StreamingProduct, 'id' | 'createdAt'>
    const created = await createStreaming(body)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'No se pudo crear el producto de streaming.' }, { status: 400 })
  }
}
