'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' })
        if (!mounted) return
        setAuthenticated(res.ok)
      } catch {
        if (!mounted) return
        setAuthenticated(false)
      } finally {
        if (mounted) setCheckingSession(false)
      }
    }

    void checkSession()

    return () => {
      mounted = false
    }
  }, [])

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Contraseña incorrecta' }))
        setError(data.message || 'Contraseña incorrecta')
        return
      }

      setAuthenticated(true)
    } catch {
      setError('No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="w-10 h-10 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

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
                  void handleLogin()
                }
              }}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-bg-primary border border-white/10 focus:border-brand-orange/50 rounded-xl text-white text-sm outline-none transition-all mb-4"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <button
              onClick={() => { void handleLogin() }}
              disabled={loading}
              className="w-full py-2.5 bg-brand-orange hover:bg-brand-orangeLight disabled:opacity-60 text-white font-bold rounded-xl transition-all"
            >
              {loading ? 'Validando...' : 'Ingresar'}
            </button>
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
