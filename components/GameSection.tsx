"use client"

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Game } from '@/lib/types'
import GameCard from './GameCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GameSectionProps {
  title: string
  subtitle?: string
  games: Game[]
  viewAllHref?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function GameSection({ title, subtitle, games, viewAllHref, size = 'md' }: GameSectionProps) {
  const [startIndex, setStartIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(2)

  useEffect(() => {
    const computeCardsPerView = () => {
      if (window.innerWidth >= 1280) return 5
      if (window.innerWidth >= 1024) return 4
      if (window.innerWidth >= 640) return 3
      return 2
    }

    const sync = () => setCardsPerView(computeCardsPerView())
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  const maxStart = Math.max(0, games.length - cardsPerView)
  const canGoPrev = startIndex > 0
  const canGoNext = startIndex < maxStart

  useEffect(() => {
    setStartIndex(prev => Math.min(prev, maxStart))
  }, [maxStart])

  const visibleGames = useMemo(
    () => games.slice(startIndex, startIndex + cardsPerView),
    [games, startIndex, cardsPerView]
  )

  const goPrev = () => {
    setStartIndex(prev => Math.max(0, prev - cardsPerView))
  }

  const goNext = () => {
    setStartIndex(prev => Math.min(maxStart, prev + cardsPerView))
  }

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
        <div className="flex items-center gap-3">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm text-brand-orange hover:text-brand-orangeLight font-semibold transition-colors"
            >
              Ver todo <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Button-driven carousel without horizontal scrollbar */}
      <div className="relative overflow-hidden">
        {games.length > cardsPerView && (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label="Ver juegos anteriores"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} className="mx-auto" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              aria-label="Ver siguientes juegos"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} className="mx-auto" />
            </button>
          </>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {visibleGames.map(game => (
            <GameCard key={game.id} game={game} size={size} fluid />
          ))}
        </div>
      </div>
    </section>
  )
}
