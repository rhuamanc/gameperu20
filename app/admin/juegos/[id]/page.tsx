'use client'

import { useRouter } from 'next/navigation'
import { useGames } from '@/lib/hooks'
import GameForm from '@/components/admin/GameForm'
import { Game } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import { use } from 'react'

export default function EditarJuegoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { games, updateGame } = useGames()

  const game = games.find(g => g.id === id)

  const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const uniqueSlug = (base: string, currentId: string) => {
    const safeBase = slugify(base) || `juego-${Date.now()}`
    const used = new Set(games.filter(g => g.id !== currentId).map(g => g.slug))
    if (!used.has(safeBase)) return safeBase
    let i = 2
    while (used.has(`${safeBase}-${i}`)) i++
    return `${safeBase}-${i}`
  }

  const handleSubmit = async (data: Omit<Game, 'id' | 'createdAt'>) => {
    const slug = uniqueSlug(data.slug || data.title, id)
    await updateGame(id, { ...data, slug })
    router.push('/admin/juegos')
  }

  if (!game && games.length > 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Juego no encontrado.</p>
        <button onClick={() => router.push('/admin/juegos')} className="mt-4 text-brand-orange hover:underline text-sm">
          Volver al listado
        </button>
      </div>
    )
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
          <h1 className="text-2xl font-black text-white">Editar Juego</h1>
          <p className="text-gray-500 text-sm truncate max-w-xs">{game?.title}</p>
        </div>
      </div>

      {!game ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
          <GameForm
            initial={game}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/admin/juegos')}
          />
        </div>
      )}
    </div>
  )
}
