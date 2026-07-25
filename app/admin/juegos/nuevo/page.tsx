'use client'

import { useRouter } from 'next/navigation'
import { useGames } from '@/lib/hooks'
import GameForm from '@/components/admin/GameForm'
import { Game } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'

export default function NuevoJuegoPage() {
  const router = useRouter()
  const { games, addGame } = useGames()

  const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const uniqueSlug = (base: string) => {
    const safeBase = slugify(base) || `juego-${Date.now()}`
    const used = new Set(games.map(g => g.slug))
    if (!used.has(safeBase)) return safeBase
    let i = 2
    while (used.has(`${safeBase}-${i}`)) i++
    return `${safeBase}-${i}`
  }

  const handleSubmit = async (data: Omit<Game, 'id' | 'createdAt'>) => {
    const slug = uniqueSlug(data.slug || data.title)
    const gamePayload: Omit<Game, 'id' | 'createdAt'> = {
      ...data,
      slug,
    }
    await addGame(gamePayload)
    router.push('/adminstyven24/juegos')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 bg-bg-card border border-white/10 hover:border-white/30 text-gray-400 hover:text-white rounded-xl transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">Nuevo Juego</h1>
          <p className="text-gray-500 text-sm">Agrega un juego al catálogo</p>
        </div>
      </div>

      <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
        <GameForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/adminstyven24/juegos')}
        />
      </div>
    </div>
  )
}
