'use client'

import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-green hover:bg-brand-greenDark text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
        aria-label="Chat de soporte"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Card */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-brand-orange px-4 py-3 flex items-center gap-3">
            <img src="/images/logo_game.jpg" alt="GamePeru+20" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-black text-white text-sm">¡Hola! GamePeru+20</p>
              <p className="text-orange-100 text-xs">Soporte constante</p>
            </div>
          </div>
          {/* Body */}
          <div className="p-4 text-sm text-gray-300 leading-relaxed">
            Recuerda que contamos siempre con descuentos y promociones.
            <br />
            <br />
            Cualquier duda o consulta, escríbenos a nuestro WhatsApp haciendo click abajo.
          </div>
          <div className="px-4 pb-4">
            <a
              href="https://wa.me/51905882260?text=Hola%20KiroGaming%2C%20estoy%20interesado%20en%20un%20juego."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-green hover:bg-brand-greenDark text-white font-semibold rounded-xl text-sm transition-all"
            >
              <MessageCircle size={16} />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  )
}
