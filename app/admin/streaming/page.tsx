'use client'

import { useState } from 'react'
import { useStreaming } from '@/lib/hooks'
import { StreamingProduct } from '@/lib/types'
import { Plus, Save, X, Edit2, Trash2, Tv } from 'lucide-react'

const emptyForm: Omit<StreamingProduct, 'id' | 'createdAt'> = {
  title: '',
  provider: 'Netflix',
  plan: '',
  duration: '1 mes',
  originalPrice: 0,
  salePrice: 0,
  image: '',
  description: '',
  active: true,
  featured: false,
  badge: '',
}

const providers: StreamingProduct['provider'][] = ['Netflix', 'HBO Max', 'Disney+', 'Prime Video', 'Spotify', 'YouTube Premium', 'Otro']

export default function AdminStreamingPage() {
  const { items, loaded, addStreaming, updateStreaming, deleteStreaming } = useStreaming()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<StreamingProduct | null>(null)
  const [form, setForm] = useState<Omit<StreamingProduct, 'id' | 'createdAt'>>(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const openCreate = () => {
    setCreating(true)
    setEditing(null)
    setForm(emptyForm)
  }

  const openEdit = (item: StreamingProduct) => {
    setEditing(item)
    setCreating(false)
    const { id, createdAt, ...rest } = item
    setForm(rest)
  }

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const save = async () => {
    if (!form.title.trim() || !form.plan.trim()) return
    if (creating) {
      await addStreaming(form)
    } else if (editing) {
      await updateStreaming(editing.id, form)
    }
    closeForm()
  }

  const field = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
  const input = 'w-full px-3 py-2.5 bg-bg-primary border border-white/10 focus:border-brand-orange/50 rounded-xl text-white text-sm outline-none transition-all'

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Streaming</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona planes de Netflix, HBO, Disney+, Spotify y más</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orangeLight text-white font-bold text-sm rounded-xl transition-all"
        >
          <Plus size={16} /> Nuevo Plan
        </button>
      </div>

      {(creating || editing) && (
        <div className="bg-bg-card border border-white/5 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-white">{creating ? 'Nuevo plan de streaming' : 'Editar plan de streaming'}</h3>
            <button onClick={closeForm} className="p-1 text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={field}>Título</label>
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Netflix Premium 4K" className={input} />
            </div>
            <div>
              <label className={field}>Proveedor</label>
              <select value={form.provider} onChange={e => set('provider', e.target.value as StreamingProduct['provider'])} className={input + ' cursor-pointer'}>
                {providers.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={field}>Plan</label>
              <input type="text" value={form.plan} onChange={e => set('plan', e.target.value)} placeholder="Premium, Familiar, Individual" className={input} />
            </div>
            <div>
              <label className={field}>Duración</label>
              <input type="text" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="1 mes" className={input} />
            </div>
            <div>
              <label className={field}>Precio original (S/)</label>
              <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => set('originalPrice', Number(e.target.value))} className={input} />
            </div>
            <div>
              <label className={field}>Precio oferta (S/)</label>
              <input type="number" min="0" step="0.01" value={form.salePrice} onChange={e => set('salePrice', Number(e.target.value))} className={input} />
            </div>
            <div className="sm:col-span-2">
              <label className={field}>Imagen (URL)</label>
              <input type="url" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." className={input} />
            </div>
            <div className="sm:col-span-2">
              <label className={field}>Descripción</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={input} />
            </div>
            <div>
              <label className={field}>Badge (opcional)</label>
              <input type="text" value={form.badge || ''} onChange={e => set('badge', e.target.value)} placeholder="HOT" className={input} />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-brand-orange" />
                <span className="text-sm text-gray-300">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-brand-orange" />
                <span className="text-sm text-gray-300">Destacado</span>
              </label>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-brand-orangeLight text-white font-bold text-sm rounded-xl transition-all">
              <Save size={16} /> Guardar
            </button>
            <button onClick={closeForm} className="px-5 py-2.5 bg-bg-primary border border-white/10 hover:border-white/30 text-gray-300 font-bold text-sm rounded-xl transition-all">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {!loaded ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-bg-card border border-white/5 rounded-2xl p-10 text-center text-gray-500">
          No hay productos de streaming. Crea el primero.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-bg-card border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all">
              <div className="h-36 rounded-xl overflow-hidden bg-bg-primary mb-3">
                <img
                  src={item.image || `https://placehold.co/500x300/1a1a2e/2563eb?text=${encodeURIComponent(item.title)}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-white font-bold leading-tight">{item.title}</h3>
                <Tv size={16} className="text-purple-300 flex-shrink-0" />
              </div>
              <p className="text-xs text-gray-400">{item.provider} · {item.plan} · {item.duration}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-gray-500 line-through text-xs">S/ {item.originalPrice.toFixed(2)}</span>
                <span className="text-white font-black text-lg">S/ {item.salePrice.toFixed(2)}</span>
                {!item.active && <span className="text-[10px] px-1.5 py-0.5 bg-white/10 text-gray-400 rounded">INACTIVO</span>}
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button onClick={() => openEdit(item)} className="p-2 bg-bg-primary border border-white/10 hover:border-brand-orange/40 text-gray-400 hover:text-white rounded-lg transition-all" title="Editar">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setConfirmDelete(item.id)} className="p-2 bg-bg-primary border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 rounded-lg transition-all" title="Eliminar">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-black text-white mb-2">¿Eliminar producto?</h3>
            <p className="text-gray-400 text-sm mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await deleteStreaming(confirmDelete)
                  setConfirmDelete(null)
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all"
              >
                Eliminar
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 bg-bg-primary border border-white/10 hover:border-white/30 text-gray-300 font-bold rounded-xl transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
