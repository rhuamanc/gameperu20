'use client'

import Link from 'next/link'
import { useStreaming } from '@/lib/hooks'
import { calcDiscount } from '@/lib/data'

export default function StreamingPage() {
  const { items, loaded } = useStreaming()
  const activeItems = items.filter(item => item.active)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Streaming</h1>
        <p className="text-gray-500 mt-2">Planes de Netflix, HBO Max, Disney+, Prime Video, Spotify y más.</p>
      </div>

      {!loaded ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeItems.length === 0 ? (
        <div className="bg-bg-card border border-white/5 rounded-2xl p-10 text-center text-gray-500">
          Aún no hay planes de streaming publicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activeItems.map(item => {
            const discount = calcDiscount(item.originalPrice, item.salePrice)
            const message = encodeURIComponent(`Hola, quiero comprar ${item.title} (${item.provider} - ${item.plan}) por S/ ${item.salePrice.toFixed(2)}`)
            const whatsapp = `https://wa.me/51950352842?text=${message}`

            return (
              <article key={item.id} className="bg-bg-card border border-white/5 hover:border-brand-orange/40 rounded-2xl overflow-hidden transition-all group">
                <div className="relative h-44 bg-bg-primary overflow-hidden">
                  <img
                    src={item.image || `https://placehold.co/500x300/1a1a2e/2563eb?text=${encodeURIComponent(item.title)}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-brand-green text-white text-xs font-black rounded">-{discount}%</span>
                  )}
                  {item.badge && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-brand-orange text-white text-xs font-black rounded">{item.badge}</span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-white font-bold leading-tight line-clamp-2">{item.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">{item.provider} · {item.plan}</p>
                  <p className="text-gray-500 text-xs mt-1">Duración: {item.duration}</p>
                  <p className="text-gray-400 text-xs mt-2 line-clamp-2">{item.description}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-gray-500 line-through text-xs">S/ {item.originalPrice.toFixed(2)}</span>
                    <span className="text-white font-black text-lg">S/ {item.salePrice.toFixed(2)}</span>
                  </div>

                  <Link
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block text-center py-2.5 bg-brand-orange hover:bg-brand-orangeLight text-white font-bold text-sm rounded-xl transition-all"
                  >
                    Comprar por WhatsApp
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
