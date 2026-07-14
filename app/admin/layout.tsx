'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src="/images/logo_game.jpg" alt="GamePeru+20" className="h-16 w-auto rounded-2xl object-contain mx-auto mb-4" />
            <h1 className="text-2xl font-black text-white">Panel Admin</h1>
            <p className="text-gray-500 text-sm mt-1">GamePeru+20</p>
          </div>

          <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (password === ADMIN_PASSWORD) {
                    setAuthenticated(true)
                  } else {
                    setError('Contraseña incorrecta')
                  }
                }
              }}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-bg-primary border border-white/10 focus:border-brand-orange/50 rounded-xl text-white text-sm outline-none transition-all mb-4"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <button
              onClick={() => {
                if (password === ADMIN_PASSWORD) {
                  setAuthenticated(true)
                } else {
                  setError('Contraseña incorrecta')
                }
              }}
              className="w-full py-2.5 bg-brand-orange hover:bg-brand-orangeLight text-white font-bold rounded-xl transition-all"
            >
              Ingresar
            </button>
            <p className="text-gray-600 text-xs text-center mt-4">
              Contraseña por defecto: <code className="text-gray-500">admin123</code>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
