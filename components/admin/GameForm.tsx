'use client'

import { useState } from 'react'
import { Game, ALL_CATEGORIES } from '@/lib/types'
import { calcDiscount } from '@/lib/data'

interface GameFormProps {
  initial?: Partial<Game>
  onSubmit: (game: Omit<Game, 'id' | 'createdAt'>) => void
  onCancel: () => void
  loading?: boolean
}

const emptyForm: Omit<Game, 'id' | 'createdAt'> = {
  title: '',
  slug: '',
  platform: 'Steam',
  originalPrice: 0,
  salePrice: 0,
  coverImage: '',
  horizontalImage: '',
  categories: [],
  isHot: false,
  hasDenuvo: false,
  isFeatured: false,
  isNew: false,
  accountType: 'offline',
  description: '',
  badge: '',
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function GameForm({ initial, onSubmit, onCancel, loading }: GameFormProps) {
  const [form, setForm] = useState<Omit<Game, 'id' | 'createdAt'>>({
    ...emptyForm,
    ...initial,
  })

  const discount = form.originalPrice > 0
    ? calcDiscount(form.originalPrice, form.salePrice)
    : 0

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(f => ({
      ...f,
      [key]: value,
      ...(key === 'title' && !initial?.slug ? { slug: slugify(value as string) } : {}),
    }))
  }

  const toggleCategory = (cat: string) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    const normalizedSlug = slugify(form.slug || form.title)
    onSubmit({
      ...form,
      slug: normalizedSlug,
    })
  }

  const field = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
  const input = 'w-full px-3 py-2.5 bg-bg-primary border border-white/10 focus:border-brand-orange/50 rounded-xl text-white text-sm outline-none transition-all'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={field}>Título del juego *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Ej: God of War Ragnarök"
            className={input}
          />
        </div>
        <div>
          <label className={field}>Slug (URL)</label>
          <input
            type="text"
            value={form.slug}
            onChange={e => set('slug', e.target.value)}
            placeholder="god-of-war-ragnarok"
            className={input}
          />
        </div>
      </div>

      {/* Platform & account type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={field}>Plataforma</label>
          <select
            value={form.platform}
            onChange={e => set('platform', e.target.value as Game['platform'])}
            className={input + ' cursor-pointer'}
          >
            {['Steam', 'Epic', 'Origin', 'Uplay', 'Battle.net'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={field}>Tipo de Cuenta</label>
          <select
            value={form.accountType}
            onChange={e => set('accountType', e.target.value as Game['accountType'])}
            className={input + ' cursor-pointer'}
          >
            <option value="offline">Cuenta Offline</option>
            <option value="online">Cuenta Online Bridge</option>
          </select>
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={field}>Precio Original (S/)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.originalPrice}
            onChange={e => set('originalPrice', Number(e.target.value))}
            className={input}
          />
        </div>
        <div>
          <label className={field}>Precio Oferta (S/)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.salePrice}
            onChange={e => set('salePrice', Number(e.target.value))}
            className={input}
          />
        </div>
        <div>
          <label className={field}>Descuento</label>
          <div className="px-3 py-2.5 bg-bg-primary border border-white/5 rounded-xl text-white text-sm flex items-center gap-2">
            <span className={`font-black text-lg ${discount >= 80 ? 'text-brand-green' : discount >= 50 ? 'text-brand-yellow' : 'text-white'}`}>
              -{discount}%
            </span>
            {discount >= 70 && <span className="text-xs text-gray-500">¡Gran oferta!</span>}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={field}>URL Imagen Cover (vertical)</label>
          <input
            type="url"
            value={form.coverImage}
            onChange={e => set('coverImage', e.target.value)}
            placeholder="https://..."
            className={input}
          />
          {form.coverImage && (
            <img
              src={form.coverImage}
              alt="preview"
              className="mt-2 w-24 h-32 object-cover rounded-lg border border-white/10"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
        </div>
        <div>
          <label className={field}>URL Imagen Horizontal (opcional)</label>
          <input
            type="url"
            value={form.horizontalImage}
            onChange={e => set('horizontalImage', e.target.value)}
            placeholder="https://... (460x215)"
            className={input}
          />
          {form.horizontalImage && (
            <img
              src={form.horizontalImage}
              alt="preview"
              className="mt-2 w-40 h-20 object-cover rounded-lg border border-white/10"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={field}>Descripción</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={3}
          placeholder="Breve descripción del juego..."
          className={input + ' resize-none'}
        />
      </div>

      {/* Badge */}
      <div>
        <label className={field}>Badge especial (opcional)</label>
        <input
          type="text"
          value={form.badge || ''}
          onChange={e => set('badge', e.target.value)}
          placeholder="Ej: ESTRENO, PREVENTA"
          className={input}
        />
      </div>

      {/* Toggle flags */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          ['isHot', '🔥 HOT'],
          ['hasDenuvo', '🛡️ Denuvo'],
          ['isFeatured', '⭐ Destacado'],
          ['isNew', '🆕 Nuevo'],
        ] as [keyof typeof form, string][]).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer bg-bg-primary border border-white/10 hover:border-brand-orange/30 rounded-xl px-3 py-2.5 transition-all">
            <input
              type="checkbox"
              checked={form[key] as boolean}
              onChange={e => set(key, e.target.checked)}
              className="accent-brand-orange"
            />
            <span className="text-sm text-gray-300">{label}</span>
          </label>
        ))}
      </div>

      {/* Categories */}
      <div>
        <label className={field}>Categorías</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                form.categories.includes(cat)
                  ? 'bg-brand-orange border-brand-orange text-white'
                  : 'bg-bg-primary border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orangeLight text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : 'Guardar Juego'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-bg-primary border border-white/10 hover:border-white/30 text-gray-300 hover:text-white font-bold rounded-xl transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
