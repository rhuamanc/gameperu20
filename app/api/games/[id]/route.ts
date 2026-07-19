import { NextResponse } from 'next/server'
import { Game } from '@/lib/types'
import { deleteGameById, updateGameById } from '@/lib/server/gamesStore'

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = (await request.json()) as Partial<Game>
    
    // Validación básica
    if (!id) {
      return NextResponse.json({ message: 'ID requerido.' }, { status: 400 })
    }
    
    const updated = await updateGameById(id, body)
    if (!updated) {
      return NextResponse.json({ message: 'Juego no encontrado.' }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/games/[id] error:', error)
    const msg = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json({ message: 'No se pudo actualizar el juego: ' + msg }, { status: 400 })
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const ok = await deleteGameById(id)
    if (!ok) {
      return NextResponse.json({ message: 'Juego no encontrado.' }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'No se pudo eliminar el juego.' }, { status: 400 })
  }
}
