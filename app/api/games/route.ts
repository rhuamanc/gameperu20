import { NextResponse } from 'next/server'
import { Game } from '@/lib/types'
import { createGame, getVisibleGames } from '@/lib/server/gamesStore'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, isValidAdminSession } from '@/lib/server/adminAuth'

export async function GET() {
  try {
    const games = await getVisibleGames()
    return NextResponse.json(games)
  } catch {
    return NextResponse.json({ message: 'No se pudieron listar los juegos.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    if (!isValidAdminSession(session)) {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
    }

    const body = (await request.json()) as Omit<Game, 'id' | 'createdAt'>
    const created = await createGame(body)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'No se pudo crear el juego.' }, { status: 400 })
  }
}
