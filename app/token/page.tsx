import { getCurrentAdminToken } from '@/lib/server/adminAuth'

export default function TokenPage() {
  const token = getCurrentAdminToken()

  return (
    <div className="min-h-screen bg-bg-primary text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-bg-card border border-white/10 rounded-2xl p-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Token del día</p>
        <h1 className="text-3xl font-black break-all text-brand-orange">{token}</h1>
        <p className="text-sm text-gray-400 mt-4">La contraseña del admin es <span className="text-white font-semibold">styven24 + token</span>.</p>
      </div>
    </div>
  )
}
