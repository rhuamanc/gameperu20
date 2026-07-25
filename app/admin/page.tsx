'use client'

import { useGames } from '@/lib/hooks'
import { useBanners } from '@/lib/hooks'
import Link from 'next/link'
import { Gamepad2, ImageIcon, Tv, TrendingUp, Package, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const { games, loaded } = useGames()
  const { banners } = useBanners()

  const featured = games.filter(g => g.isFeatured).length
  const hotGames = games.filter(g => g.isHot).length
  const newGames = games.filter(g => g.isNew).length
  const activeBanners = banners.filter(b => b.active).length

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen de tu tienda GamePeru+20</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Juegos', value: games.length, icon: Gamepad2, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
          { label: 'Destacados', value: featured, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Juegos Hot', value: hotGames, icon: Package, color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'Banners activos', value: activeBanners, icon: ImageIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        ].map(stat => (
          <div key={stat.label} className="bg-bg-card border border-white/5 rounded-2xl p-5">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={stat.color} size={20} />
            </div>
            <p className="text-2xl font-black text-white">{loaded ? stat.value : '—'}</p>
            <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-bold text-white mb-4">Acciones rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/adminstyven24/juegos/nuevo"
          className="flex items-center gap-4 p-5 bg-bg-card border border-white/5 hover:border-brand-orange/40 rounded-2xl transition-all group"
        >
          <div className="w-12 h-12 bg-brand-orange/10 group-hover:bg-brand-orange/20 rounded-xl flex items-center justify-center transition-all">
            <Plus className="text-brand-orange" size={22} />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Agregar Juego</p>
            <p className="text-gray-500 text-xs">Añade un nuevo juego al catálogo</p>
          </div>
        </Link>
        <Link
          href="/adminstyven24/banners"
          className="flex items-center gap-4 p-5 bg-bg-card border border-white/5 hover:border-brand-orange/40 rounded-2xl transition-all group"
        >
          <div className="w-12 h-12 bg-blue-500/10 group-hover:bg-blue-500/20 rounded-xl flex items-center justify-center transition-all">
            <ImageIcon className="text-blue-400" size={22} />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Gestionar Banners</p>
            <p className="text-gray-500 text-xs">Edita los banners del hero</p>
          </div>
        </Link>
        <Link
          href="/adminstyven24/streaming"
          className="flex items-center gap-4 p-5 bg-bg-card border border-white/5 hover:border-brand-orange/40 rounded-2xl transition-all group"
        >
          <div className="w-12 h-12 bg-purple-500/10 group-hover:bg-purple-500/20 rounded-xl flex items-center justify-center transition-all">
            <Tv className="text-purple-300" size={22} />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Gestionar Streaming</p>
            <p className="text-gray-500 text-xs">Netflix, HBO, Disney+ y más</p>
          </div>
        </Link>
      </div>

      {/* Recent games */}
      <h2 className="text-lg font-bold text-white mb-4">Juegos recientes</h2>
      <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden">
        {games.slice(0, 5).map((game, i) => (
          <div
            key={game.id}
            className={`flex items-center gap-4 px-5 py-3 ${i < 4 ? 'border-b border-white/5' : ''}`}
          >
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{game.title}</p>
              <p className="text-gray-500 text-xs">{game.platform} · {game.accountType}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white text-sm font-bold">S/ {game.salePrice.toFixed(2)}</p>
              <p className="text-gray-500 line-through text-xs">S/ {game.originalPrice.toFixed(2)}</p>
            </div>
            <Link
              href={`/adminstyven24/juegos/${game.id}`}
              className="px-3 py-1.5 bg-bg-primary border border-white/10 hover:border-brand-orange/40 text-gray-400 hover:text-white text-xs rounded-lg transition-all flex-shrink-0"
            >
              Editar
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
