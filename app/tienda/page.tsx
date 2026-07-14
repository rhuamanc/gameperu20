'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useGames } from '@/lib/hooks'
import GameCard from '@/components/GameCard'
import { ALL_CATEGORIES } from '@/lib/types'
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react'

function TiendaContent() {
  const searchParams = useSearchParams()
  const { games, loaded } = useGames()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [platform, setPlatform] = useState<string>('')
  const [accountType, setAccountType] = useState<string>('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500)
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const PER_PAGE = 24

  // Apply initial query
  useEffect(() => {
    const q = searchParams.get('q') || ''
    if (q === 'hot') {
      setSearch('')
    } else if (q === 'nuevo') {
      setSearch('')
    } else {
      setSearch(q)
    }
  }, [searchParams])

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = searchParams.get('q') || ''
    let result = [...games]

    // Quick filters from URL
    if (q === 'hot') result = result.filter(g => g.isHot)
    else if (q === 'nuevo') result = result.filter(g => g.isNew)
    else if (q === 'indie') result = result.filter(g => g.categories.includes('Indie'))
    else if (q && !search) result = result.filter(g =>
      g.title.toLowerCase().includes(q.toLowerCase()) ||
      g.categories.some(c => c.toLowerCase().includes(q.toLowerCase()))
    )

    if (search) {
      result = result.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.categories.some(c => c.toLowerCase().includes(search.toLowerCase()))
      )
    }
    if (selectedCategories.length > 0) {
      result = result.filter(g => selectedCategories.some(cat => g.categories.includes(cat)))
    }
    if (platform) result = result.filter(g => g.platform === platform)
    if (accountType) result = result.filter(g => g.accountType === accountType)
    result = result.filter(g => g.salePrice >= minPrice && g.salePrice <= maxPrice)

    // Sort
    if (sortBy === 'price-asc') result.sort((a, b) => a.salePrice - b.salePrice)
    else if (sortBy === 'price-desc') result.sort((a, b) => b.salePrice - a.salePrice)
    else if (sortBy === 'discount') result.sort((a, b) => {
      const da = (a.originalPrice - a.salePrice) / a.originalPrice
      const db = (b.originalPrice - b.salePrice) / b.originalPrice
      return db - da
    })

    return result
  }, [games, search, selectedCategories, platform, accountType, minPrice, maxPrice, sortBy, searchParams])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const clearFilters = () => {
    setSearch('')
    setSelectedCategories([])
    setPlatform('')
    setAccountType('')
    setMinPrice(0)
    setMaxPrice(500)
    setSortBy('default')
    setPage(1)
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tight">
        CATÁLOGO
      </h1>

      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Buscar juegos..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-white/10 focus:border-brand-orange/50 rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-all"
          />
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-bg-card border border-white/10 hover:border-brand-orange/30 rounded-xl text-sm text-gray-300 hover:text-white transition-all sm:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={16} />
          Filtros
          {(selectedCategories.length > 0 || platform || accountType) && (
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
          )}
        </button>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2.5 bg-bg-card border border-white/10 focus:border-brand-orange/50 rounded-xl text-sm text-gray-300 outline-none transition-all cursor-pointer"
        >
          <option value="default">Ordenar por: Defecto</option>
          <option value="price-asc">Precio: Menor a mayor</option>
          <option value="price-desc">Precio: Mayor a menor</option>
          <option value="discount">Mayor descuento</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-60 flex-shrink-0`}>
          <div className="bg-bg-card border border-white/5 rounded-2xl p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Filtros</h3>
              {(selectedCategories.length > 0 || platform || accountType) && (
                <button onClick={clearFilters} className="text-xs text-brand-orange hover:text-brand-orangeLight flex items-center gap-1">
                  <X size={12} /> Limpiar
                </button>
              )}
            </div>

            {/* Price range */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Precio</label>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <span>MIN {minPrice}</span>
                <div className="flex-1" />
                <span>MAX {maxPrice}</span>
              </div>
              <input
                type="range"
                min={0}
                max={500}
                value={maxPrice}
                onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1) }}
                className="w-full mt-1 accent-brand-orange"
              />
            </div>

            {/* Platform */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Plataforma</label>
              <div className="mt-2 space-y-1.5">
                {['Steam', 'Epic', 'Battle.net'].map(p => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="platform"
                      checked={platform === p}
                      onChange={() => { setPlatform(platform === p ? '' : p); setPage(1) }}
                      className="accent-brand-orange"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categorías</label>
              <div className="mt-2 space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {ALL_CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="accent-brand-orange"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Account type */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tipo de Cuenta</label>
              <div className="mt-2 space-y-1.5">
                {['offline', 'online'].map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === t}
                      onChange={() => { setAccountType(accountType === t ? '' : t); setPage(1) }}
                      className="accent-brand-orange"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors capitalize">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ver resultados */}
            <button
              onClick={() => setShowFilters(false)}
              className="mt-5 w-full py-2.5 bg-brand-orange hover:bg-brand-orangeLight text-white font-bold text-sm rounded-xl transition-all sm:hidden"
            >
              VER {filtered.length} RESULTADOS
            </button>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-sm mb-4">
            Mostrando <span className="text-white font-semibold">{filtered.length}</span> juego{filtered.length !== 1 ? 's' : ''}
          </p>

          {paginated.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg font-semibold mb-2">No se encontraron juegos</p>
              <button onClick={clearFilters} className="text-brand-orange hover:underline text-sm">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {paginated.map(game => (
                <div key={game.id} className="flex justify-center">
                  <GameCard game={game} size="sm" />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 bg-bg-card border border-white/10 hover:border-brand-orange/40 text-sm text-gray-400 hover:text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ←
              </button>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    p === page
                      ? 'bg-brand-orange text-white font-bold'
                      : 'bg-bg-card border border-white/10 hover:border-brand-orange/40 text-gray-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 bg-bg-card border border-white/10 hover:border-brand-orange/40 text-sm text-gray-400 hover:text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TiendaPage() {
  return (
    <Suspense>
      <TiendaContent />
    </Suspense>
  )
}
