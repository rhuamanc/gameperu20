'use client'

import { useState } from 'react'
import { useBanners } from '@/lib/hooks'
import { Banner } from '@/lib/types'
import { Plus, Trash2, Edit2, Eye, EyeOff, X, Save } from 'lucide-react'

const emptyBanner: Omit<Banner, 'id'> = {
  title: '',
  subtitle: '',
  image: '',
  badge: '',
  date: '',
  originalPrice: 0,
  salePrice: 0,
  discount: 0,
  ctaText: 'COMPRAR AHORA',
  active: true,
  order: 99,
}

export default function AdminBannersPage() {
  const { banners, loaded, addBanner, updateBanner, deleteBanner } = useBanners()
  const [editing, setEditing] = useState<Banner | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<Banner, 'id'>>(emptyBanner)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const openCreate = () => {
    setForm(emptyBanner)
    setCreating(true)
    setEditing(null)
  }

  const openEdit = (banner: Banner) => {
    setForm({ ...banner })
    setEditing(banner)
    setCreating(false)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    const discount = form.originalPrice > 0
      ? Math.round(((form.originalPrice - form.salePrice) / form.originalPrice) * 100)
      : form.discount

    if (creating) {
      addBanner({ ...form, discount, id: Date.now().toString() })
      setCreating(false)
    } else if (editing) {
      updateBanner(editing.id, { ...form, discount })
      setEditing(null)
    }
  }

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(f => ({ ...f, [key]: value }))
  }

  const input = 'w-full px-3 py-2 bg-bg-primary border border-white/10 focus:border-brand-orange/50 rounded-xl text-white text-sm outline-none transition-all'
  const field = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
  const showForm = creating || editing !== null

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona los banners del hero de la página principal</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orangeLight text-white font-bold text-sm rounded-xl transition-all"
        >
          <Plus size={16} />
          Nuevo Banner
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-bg-card border border-white/5 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-white">{creating ? 'Nuevo Banner' : 'Editar Banner'}</h3>
            <button
              onClick={() => { setCreating(false); setEditing(null) }}
              className="p-1 text-gray-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={field}>Título principal</label>
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ej: 007" className={input} />
            </div>
            <div>
              <label className={field}>Subtítulo</label>
              <input type="text" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Ej: FIRST LIGHT" className={input} />
            </div>
            <div className="sm:col-span-2">
              <label className={field}>URL de imagen (1200x500 recomendado)</label>
              <input type="url" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." className={input} />
              {form.image && (
                <img src={form.image} alt="preview" className="mt-2 w-full max-w-md h-28 object-cover rounded-xl border border-white/10"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              )}
            </div>
            <div>
              <label className={field}>Badge (ESTRENO, HOT, etc.)</label>
              <input type="text" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="ESTRENO" className={input} />
            </div>
            <div>
              <label className={field}>Fecha (opcional)</label>
              <input type="text" value={form.date} onChange={e => set('date', e.target.value)} placeholder="27/05/26" className={input} />
            </div>
            <div>
              <label className={field}>Precio original (S/)</label>
              <input type="number" step="0.01" min="0" value={form.originalPrice} onChange={e => set('originalPrice', Number(e.target.value))} className={input} />
            </div>
            <div>
              <label className={field}>Precio oferta (S/)</label>
              <input type="number" step="0.01" min="0" value={form.salePrice} onChange={e => set('salePrice', Number(e.target.value))} className={input} />
            </div>
            <div>
              <label className={field}>Texto del botón</label>
              <input type="text" value={form.ctaText} onChange={e => set('ctaText', e.target.value)} className={input} />
            </div>
            <div>
              <label className={field}>Orden</label>
              <input type="number" min="1" value={form.order} onChange={e => set('order', Number(e.target.value))} className={input} />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-brand-orange" />
              <span className="text-sm text-gray-300">Banner activo</span>
            </label>
          </div>

          <div className="mt-5 flex gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-brand-orangeLight text-white font-bold text-sm rounded-xl transition-all">
              <Save size={16} />
              Guardar
            </button>
            <button onClick={() => { setCreating(false); setEditing(null) }} className="px-5 py-2.5 bg-bg-primary border border-white/10 hover:border-white/30 text-gray-300 font-bold text-sm rounded-xl transition-all">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Banner list */}
      {!loaded ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hay banners. Crea el primero.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map(banner => (
            <div key={banner.id} className="bg-bg-card border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all">
              <div className="flex flex-col sm:flex-row gap-0">
                {/* Preview */}
                <div className="sm:w-48 h-28 flex-shrink-0 relative overflow-hidden">
                  <img
                    src={banner.image || `https://placehold.co/400x200/1a1a2e/f97316?text=${encodeURIComponent(banner.title)}`}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x200/1a1a2e/f97316?text=${encodeURIComponent(banner.title)}` }}
                  />
                  {!banner.active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-xs text-gray-400 font-semibold">INACTIVO</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    {banner.badge && (
                      <span className="px-2 py-0.5 bg-brand-orange text-white text-[10px] font-black rounded mb-1 inline-block">
                        {banner.badge}
                      </span>
                    )}
                    <p className="font-black text-white text-lg leading-tight">{banner.title}</p>
                    <p className="text-gray-400 text-sm">{banner.subtitle}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-gray-500 line-through text-xs">S/ {banner.originalPrice}</span>
                      <span className="text-white font-bold text-sm">S/ {banner.salePrice}</span>
                      <span className="px-1.5 py-0.5 bg-brand-green text-white text-xs font-bold rounded">-{banner.discount}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateBanner(banner.id, { active: !banner.active })}
                      className={`p-2 border rounded-lg transition-all ${banner.active ? 'border-brand-green/40 text-brand-green hover:bg-brand-green/10' : 'border-white/10 text-gray-500 hover:text-white'}`}
                      title={banner.active ? 'Desactivar' : 'Activar'}
                    >
                      {banner.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => openEdit(banner)}
                      className="p-2 border border-white/10 hover:border-brand-orange/40 text-gray-400 hover:text-white rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(banner.id)}
                      className="p-2 border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-black text-white mb-2">¿Eliminar banner?</h3>
            <p className="text-gray-400 text-sm mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => { deleteBanner(confirmDelete); setConfirmDelete(null) }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
                Eliminar
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 bg-bg-primary border border-white/10 hover:border-white/30 text-gray-300 font-bold rounded-xl transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
