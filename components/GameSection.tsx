import Link from 'next/link'
import { Game } from '@/lib/types'
import GameCard from './GameCard'
import { ChevronRight } from 'lucide-react'

interface GameSectionProps {
  title: string
  subtitle?: string
  games: Game[]
  viewAllHref?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function GameSection({ title, subtitle, games, viewAllHref, size = 'md' }: GameSectionProps) {
  if (games.length === 0) return null

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {title}
          </h2>
          {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm text-brand-orange hover:text-brand-orangeLight font-semibold transition-colors"
          >
            Ver todo <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-bg-hover scrollbar-track-transparent -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {games.map(game => (
          <GameCard key={game.id} game={game} size={size} />
        ))}
      </div>
    </section>
  )
}
