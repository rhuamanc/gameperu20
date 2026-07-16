import { NextResponse } from 'next/server'
import { Banner } from '@/lib/types'
import { upsertManyBanners } from '@/lib/server/bannersStore'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { banners?: Banner[] }
    const banners = Array.isArray(body?.banners) ? body.banners : []
    await upsertManyBanners(banners)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'No se pudo migrar banners.' }, { status: 400 })
  }
}
