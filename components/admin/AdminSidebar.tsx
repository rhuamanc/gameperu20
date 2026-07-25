'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Gamepad2, ImageIcon, ChevronRight, LogOut, Home } from 'lucide-react'

const navItems = [
  { href: '/adminstyven24', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/adminstyven24/juegos', label: 'Juegos', icon: Gamepad2 },
  { href: '/adminstyven24/banners', label: 'Banners', icon: ImageIcon },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="w-64 flex-shrink-0 bg-bg-secondary border-r border-white/5 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center font-black text-white text-sm">
            GP+20
          </div>
          <div>
            <p className="font-black text-white text-sm leading-tight">GamePeru+20</p>
            <p className="text-gray-500 text-xs">Panel Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 flex-1 space-y-1">
        {navItems.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-orange text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <Home size={18} />
          Ver sitio
        </Link>
        <button
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' })
            router.push('/adminstyven24')
            router.refresh()
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
