'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-bg-secondary border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/images/logo_game.jpg" alt="GamePeru+20" className="h-9 w-auto rounded-lg object-contain" />
            <span className="font-black text-white text-lg tracking-tight group-hover:text-brand-orange transition-colors">
              GamePeru+20
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              Inicio
            </Link>
            <Link href="/tienda" className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              Tienda
            </Link>
            <Link href="/tienda?q=hot" className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              🔥 Ofertas
            </Link>
            <Link href="/tienda?q=nuevo" className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              Nuevos
            </Link>
            <Link href="/streaming" className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              Streaming
            </Link>
            <Link href="/faq" className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              FAQ
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link href="/tienda" className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <Search size={18} />
            </Link>
            <Link
              href="/adminstyven24"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-brand-orange border border-brand-orange/40 rounded-lg hover:bg-brand-orange/10 transition-all"
            >
              <User size={14} />
              ADMIN
            </Link>
            <div className="flex items-center gap-1 text-xs text-gray-400 border border-white/10 rounded-lg px-2 py-1.5">
              <span>🇵🇪</span>
              <span>PEN</span>
            </div>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg-secondary border-t border-white/5 px-4 py-4 space-y-2">
          <Link href="/" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link href="/tienda" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg" onClick={() => setMenuOpen(false)}>Tienda</Link>
          <Link href="/tienda?q=hot" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg" onClick={() => setMenuOpen(false)}>🔥 Ofertas</Link>
          <Link href="/tienda?q=nuevo" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg" onClick={() => setMenuOpen(false)}>Nuevos</Link>
          <Link href="/streaming" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg" onClick={() => setMenuOpen(false)}>Streaming</Link>
          <Link href="/faq" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg" onClick={() => setMenuOpen(false)}>FAQ</Link>
          <Link href="/adminstyven24" className="block px-3 py-2 text-sm text-brand-orange font-semibold rounded-lg" onClick={() => setMenuOpen(false)}>Panel Admin</Link>
        </div>
      )}
    </nav>
  )
}
