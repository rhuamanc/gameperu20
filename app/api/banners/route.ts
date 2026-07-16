import { NextResponse } from 'next/server'
import { Banner } from '@/lib/types'
import { createBanner, getAllBanners } from '@/lib/server/bannersStore'

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
    const body = (await request.json()) as Omit<Banner, 'id'>
    const created = await createBanner(body)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'No se pudo crear el banner.' }, { status: 400 })
  }
}
