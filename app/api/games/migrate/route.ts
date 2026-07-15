import { NextResponse } from 'next/server'
import { Game } from '@/lib/types'
import { upsertManyGames } from '@/lib/server/gamesStore'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { games?: Game[] }
    const games = Array.isArray(body.games) ? body.games : []
    await upsertManyGames(games)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'No se pudo migrar la data.' }, { status: 400 })
  }
}
