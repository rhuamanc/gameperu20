'use client'

import { useState } from 'react'
import { useGames } from '@/lib/hooks'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2, Star, Flame, Shield } from 'lucide-react'

export default function AdminJuegosPage() {
  const { games, loaded, deleteGame } = useGames()
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = games.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.platform.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: string) => {
    deleteGame(id)
    setConfirmDelete(null)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Juegos</h1>
          <p className="text-gray-500 text-sm mt-1">{loaded ? games.length : '—'} juegos en el catálogo</p>
        </div>
        <Link
          href="/admin/juegos/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orangeLight text-white font-bold text-sm rounded-xl transition-all"
        >
          <Plus size={16} />
          Nuevo Juego
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Buscar por nombre o plataforma..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-bg-card border border-white/10 focus:border-brand-orange/50 rounded-xl text-white text-sm outline-none transition-all"
        />
      </div>

      {/* Table */}
      {!loaded ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-5">Juego</div>
            <div className="col-span-2 text-right">Precio</div>
            <div className="col-span-2 text-center">Estado</div>
            <div className="col-span-3 text-right">Acciones</div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">No se encontraron juegos</div>
          ) : (
            filtered.map((game, i) => (
              <div
                key={game.id}
                className={`grid grid-cols-12 gap-4 px-5 py-3 items-center ${i < filtered.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/2 transition-colors`}
              >
                {/* Game info */}
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-9 h-12 object-cover rounded-lg flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{game.title}</p>
                    <p className="text-gray-500 text-xs">{game.platform}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-right">
                  <p className="text-white text-sm font-bold">S/ {game.salePrice.toFixed(2)}</p>
                  <p className="text-gray-600 line-through text-xs">S/ {game.originalPrice.toFixed(2)}</p>
                </div>

                {/* Badges */}
                <div className="col-span-2 flex items-center justify-center gap-1 flex-wrap">
                  {game.isFeatured && <span title="Destacado"><Star size={14} className="text-yellow-400" /></span>}
                  {game.isHot && <span title="Hot"><Flame size={14} className="text-red-400" /></span>}
                  {game.hasDenuvo && <span title="Denuvo"><Shield size={14} className="text-gray-400" /></span>}
                  {game.isNew && <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-bold">NEW</span>}
                </div>

                {/* Actions */}
                <div className="col-span-3 flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/juegos/${game.id}`}
                    className="p-2 bg-bg-primary border border-white/10 hover:border-brand-orange/40 text-gray-400 hover:text-white rounded-lg transition-all"
                    title="Editar"
                  >
                    <Edit2 size={14} />
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(game.id)}
                    className="p-2 bg-bg-primary border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-black text-white mb-2">¿Eliminar juego?</h3>
            <p className="text-gray-400 text-sm mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all"
              >
                Eliminar
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 bg-bg-primary border border-white/10 hover:border-white/30 text-gray-300 font-bold rounded-xl transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
