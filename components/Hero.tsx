'use client'

import { useState, useEffect } from 'react'
import { Banner } from '@/lib/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroProps {
  banners: Banner[]
}

export default function Hero({ banners }: HeroProps) {
  const [current, setCurrent] = useState(0)
  const active = banners.filter(b => b.active)

  useEffect(() => {
    if (active.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % active.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [active.length])

  if (active.length === 0) return null

  const banner = active[current]

  return (
    <div className="relative w-full overflow-hidden bg-bg-primary" style={{ height: 'clamp(320px, 50vw, 520px)' }}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${banner.image})` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            {banner.badge && (
              <span className="inline-block px-3 py-1 bg-brand-orange text-white text-xs font-black rounded mb-3 tracking-widest">
                {banner.badge}
                {banner.date && <span className="ml-2 opacity-75">{banner.date}</span>}
              </span>
            )}
            <h1 className="font-black text-white leading-none tracking-tight">
              <span className="block text-3xl sm:text-5xl lg:text-7xl text-brand-orange">{banner.title}</span>
              <span className="block text-2xl sm:text-4xl lg:text-6xl">{banner.subtitle}</span>
            </h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-gray-400 line-through text-lg">S/ {banner.originalPrice.toFixed(2)}</span>
              <span className="text-white font-black text-3xl">S/ {banner.salePrice.toFixed(2)}</span>
              <span className="px-2 py-0.5 bg-brand-green text-white text-sm font-bold rounded">
                -{banner.discount}%
              </span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://wa.me/51905882260?text=Hola%2C%20me%20interesa%20comprar%20un%20juego."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-brand-orange hover:bg-brand-orangeLight text-white font-black rounded-xl transition-all hover:scale-105 text-sm"
              >
                {banner.ctaText || 'COMPRAR AHORA'}
              </a>
              <span className="text-xs text-gray-400">Edición Digital</span>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      {active.length > 1 && (
        <>
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
            onClick={() => setCurrent(c => (c - 1 + active.length) % active.length)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
            onClick={() => setCurrent(c => (c + 1) % active.length)}
          >
            <ChevronRight size={20} />
          </button>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {active.map((_, i) => (
              <button
                key={i}
                className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-brand-orange' : 'w-2 bg-white/30'}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
