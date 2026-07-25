import { NextResponse } from 'next/server'
import { Game } from '@/lib/types'
import { upsertManyGames } from '@/lib/server/gamesStore'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, isValidAdminSession } from '@/lib/server/adminAuth'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    if (!isValidAdminSession(session)) {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
    }

    const body = (await request.json()) as { games?: Game[] }
    const games = Array.isArray(body.games) ? body.games : []
    await upsertManyGames(games)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'No se pudo migrar la data.' }, { status: 400 })
  }
}
