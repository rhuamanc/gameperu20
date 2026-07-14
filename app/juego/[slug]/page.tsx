'use client'

import { use } from 'react'
import { useGames } from '@/lib/hooks'
import { calcDiscount } from '@/lib/data'
import Link from 'next/link'
import { ArrowLeft, Shield, Zap, Clock, MessageCircle, ExternalLink, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function JuegoDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { games, loaded } = useGames()
  const [activeTab, setActiveTab] = useState<'acerca' | 'guia'>('acerca')

  const game = games.find(g => g.slug === slug)
  const discount = game ? calcDiscount(game.originalPrice, game.salePrice) : 0
  const waMessage = game
    ? `Hola GamePeru+20, me interesa comprar el juego: ${game.title}`
    : 'Hola GamePeru+20, estoy interesado en un juego.'

  // Related games (same category, excluding current)
  const related = game
    ? games
        .filter(g => g.id !== game.id && g.categories.some(c => game.categories.includes(c)))
        .slice(0, 6)
    : []

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-5xl mb-4">🎮</p>
        <h1 className="text-2xl font-black text-white mb-2">Juego no encontrado</h1>
        <p className="text-gray-500 text-sm mb-6">El juego que buscas no existe o fue eliminado.</p>
        <Link href="/tienda" className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orangeLight text-white font-bold rounded-xl transition-all">
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/tienda" className="hover:text-white transition-colors">Tienda</Link>
        <span>/</span>
        <span className="text-gray-300 truncate max-w-xs">{game.title}</span>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Cover + screenshots placeholder */}
        <div className="lg:col-span-1">
          <div className="relative rounded-2xl overflow-hidden bg-bg-card border border-white/5">
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-full object-cover"
              style={{ aspectRatio: '2/3' }}
              onError={e => {
                const t = e.target as HTMLImageElement
                t.src = `https://placehold.co/400x600/1a1a2e/f97316?text=${encodeURIComponent(game.title.substring(0, 16))}`
              }}
            />
            {/* Badges overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="px-2.5 py-1 bg-brand-green text-white text-sm font-black rounded-lg">
                  -{discount}%
                </span>
              )}
              {game.badge && (
                <span className="px-2.5 py-1 bg-brand-orange text-white text-xs font-black rounded-lg tracking-wider">
                  {game.badge}
                </span>
              )}
              {game.isHot && (
                <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-black rounded-lg">
                  🔥 HOT
                </span>
              )}
            </div>
            {game.hasDenuvo && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-gray-800/90 text-gray-300 text-xs font-bold rounded-lg">
                  🛡️ DENUVO
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CENTER: Info */}
        <div className="lg:col-span-1">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
            {game.title}
          </h1>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {game.categories.map(cat => (
              <Link
                key={cat}
                href={`/tienda?q=${encodeURIComponent(cat)}`}
                className="px-2.5 py-1 bg-bg-card border border-white/10 hover:border-brand-orange/40 text-gray-400 hover:text-white text-xs rounded-lg transition-all"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-5">
            <button
              className={`px-4 py-2.5 text-sm font-bold transition-all border-b-2 -mb-px ${
                activeTab === 'acerca'
                  ? 'border-brand-orange text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('acerca')}
            >
              ACERCA DEL PRODUCTO
            </button>
            <button
              className={`px-4 py-2.5 text-sm font-bold transition-all border-b-2 -mb-px ${
                activeTab === 'guia'
                  ? 'border-brand-orange text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('guia')}
            >
              GUÍA DE CANJE
            </button>
          </div>

          {activeTab === 'acerca' ? (
            <div className="text-gray-400 text-sm leading-relaxed space-y-3">
              <p>{game.description || 'Disfruta de este increíble juego con entrega inmediata e instalación incluida.'}</p>
              <div className="space-y-2 pt-2">
                {[
                  'Acceso permanente: Juega cuando quieras, tu registro siempre estará en Kirogaming.',
                  'Progreso: Guarda tu partida de forma segura, sin problemas.',
                  'Disfruta sin límites: Disfruta del juego todo el tiempo que desees.',
                  'Asistencia: Soporte constante y Garantía, siempre puedes contactarnos.',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={15} className="text-brand-green flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm leading-relaxed space-y-3">
              <p>
                Entrega de un código para canjear el juego en la plataforma de Kirogaming, que
                luego desde la biblioteca podrás liberar el juego (Offline) para que se instale,
                en la cuenta de Steam que tienes instalado en tu PC.
              </p>
              <p>
                Se indica un instructivo claro de los pasos a realizar para salvaguardar la
                integridad de la cuenta y disfrutar de su jugabilidad.
              </p>
              <div className="bg-bg-card border border-white/5 rounded-xl p-4 mt-4">
                <p className="text-white font-semibold text-sm mb-2">¿Cómo funciona?</p>
                <ol className="space-y-2 text-xs text-gray-400 list-decimal list-inside">
                  <li>Contáctanos por WhatsApp con el nombre del juego</li>
                  <li>Coordina el pago por tu método preferido</li>
                  <li>Nos conectamos por Rustdesk (conexión remota)</li>
                  <li>Activamos el juego directamente en tu Steam</li>
                  <li>¡Listo! El juego aparece en tu biblioteca</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Purchase box */}
        <div className="lg:col-span-1">
          <div className="bg-bg-card border border-white/5 rounded-2xl p-5 sticky top-20">
            {/* Price */}
            <div className="mb-5">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-gray-500 line-through text-base">
                  S/ {game.originalPrice.toFixed(2)}
                </span>
                <span className="px-2 py-0.5 bg-brand-green text-white text-xs font-black rounded-lg">
                  -{discount}%
                </span>
              </div>
              <p className="text-white font-black text-4xl">
                S/ {game.salePrice.toFixed(2)}
              </p>
            </div>

            {/* Platform & type */}
            <div className="space-y-2 mb-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Plataforma:</span>
                <span className="font-semibold text-white px-2.5 py-1 bg-bg-hover rounded-lg border border-white/10">
                  {game.platform}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tipo:</span>
                <span className="font-semibold text-white capitalize">{game.accountType}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 mb-5">
              <a
                href={`https://wa.me/51905882260?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-brand-orange hover:bg-brand-orangeLight text-white font-black rounded-xl transition-all hover:scale-[1.02] text-sm"
              >
                Comprar Ahora
              </a>
              <a
                href={`https://wa.me/51905882260?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-bg-hover hover:bg-bg-card border border-white/10 hover:border-brand-orange/40 text-white font-bold rounded-xl transition-all text-sm"
              >
                <MessageCircle size={16} />
                Consultar por WhatsApp
              </a>
            </div>

            {/* Garantías */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { icon: Shield, label: 'Garantía\nDe Por Vida', color: 'text-brand-orange' },
                { icon: Zap, label: 'Entrega\nInmediata', color: 'text-brand-yellow' },
                { icon: Clock, label: 'Activación\nen 5 min', color: 'text-brand-green' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-2 bg-bg-hover/50 rounded-xl text-center">
                  <Icon size={18} className={color} />
                  <span className="text-[10px] text-gray-400 leading-tight whitespace-pre-line">{label}</span>
                </div>
              ))}
            </div>

            {/* Payment methods */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Métodos de pago</p>
              <div className="flex flex-wrap gap-2">
                {['Visa', 'MasterCard', 'Yape', 'Plin', 'PayPal', 'Binance'].map(m => (
                  <span
                    key={m}
                    className="px-2 py-1 bg-bg-hover border border-white/10 rounded-lg text-xs text-gray-300 font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related games */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-black text-white mb-5">Juegos Relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {related.map(g => {
              const d = calcDiscount(g.originalPrice, g.salePrice)
              return (
                <Link key={g.id} href={`/juego/${g.slug}`} className="group">
                  <div className="relative rounded-xl overflow-hidden bg-bg-card border border-white/5 group-hover:border-brand-orange/40 transition-all group-hover:-translate-y-1 duration-300">
                    <div className="relative" style={{ aspectRatio: '2/3' }}>
                      <img
                        src={g.coverImage}
                        alt={g.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          const t = e.target as HTMLImageElement
                          t.src = `https://placehold.co/200x300/1a1a2e/f97316?text=${encodeURIComponent(g.title.substring(0, 10))}`
                        }}
                      />
                      {d > 0 && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-brand-green text-white text-[10px] font-black rounded">
                          -{d}%
                        </span>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-white text-xs font-semibold line-clamp-2 group-hover:text-brand-orange transition-colors leading-tight">
                        {g.title}
                      </p>
                      <p className="text-white font-black text-sm mt-1">S/ {g.salePrice.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
