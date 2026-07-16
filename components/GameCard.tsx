import Link from 'next/link'
import { Game } from '@/lib/types'
import { calcDiscount } from '@/lib/data'

interface GameCardProps {
  game: Game
  size?: 'sm' | 'md' | 'lg'
  fluid?: boolean
}

export default function GameCard({ game, size = 'md', fluid = false }: GameCardProps) {
  const discount = calcDiscount(game.originalPrice, game.salePrice)
  const targetPath = game.slug ? `/juego/${game.slug}` : `/juego/${game.id}`

  const widths = { sm: 'w-36 sm:w-40', md: 'w-44 sm:w-48 md:w-52', lg: 'w-52 sm:w-56 md:w-60' }
  const imgH = { sm: 'h-52', md: 'h-64', lg: 'h-72' }
  const imageFitClass = fluid ? 'object-contain' : 'object-cover'

  return (
    <Link
      href={targetPath}
      className={`${fluid ? 'w-full min-w-0' : `${widths[size]} flex-shrink-0`} group cursor-pointer`}
    >
      <div className="relative overflow-hidden rounded-xl bg-bg-card border border-white/5 group-hover:border-brand-orange/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-brand-orange/10 group-hover:-translate-y-1">
        {/* Cover image */}
        <div className={`relative ${imgH[size]} bg-bg-hover overflow-hidden`}>
          <img
            src={game.coverImage}
            alt={game.title}
            className={`w-full h-full ${imageFitClass} group-hover:scale-105 transition-transform duration-500`}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://placehold.co/280x390/1a1a2e/2563eb?text=${encodeURIComponent(game.title.substring(0, 15))}`
            }}
          />

          {/* Top badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="px-1.5 py-0.5 bg-brand-green text-white text-xs font-black rounded">
                -{discount}%
              </span>
            )}
            {game.badge && (
              <span className="px-1.5 py-0.5 bg-brand-orange text-white text-[10px] font-black rounded tracking-wider">
                {game.badge}
              </span>
            )}
          </div>

          {/* Top right badges */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {game.isHot && (
              <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-black rounded">
                🔥 HOT
              </span>
            )}
            {game.hasDenuvo && (
              <span className="px-1.5 py-0.5 bg-gray-700 text-gray-300 text-[10px] font-bold rounded">
                🛡️ DENUVO
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          {/* Platform */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-semibold px-1.5 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/30">
              {game.platform}
            </span>
            <span className="text-[10px] text-gray-500 capitalize">{game.accountType}</span>
          </div>

          {/* Title */}
          <p className="text-white text-xs sm:text-sm font-semibold leading-tight line-clamp-2 group-hover:text-brand-orange transition-colors">
            {game.title}
          </p>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-gray-500 line-through text-xs">
              S/ {game.originalPrice.toFixed(2)}
            </span>
            <span className="text-white font-black text-sm sm:text-base">
              S/ {game.salePrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
