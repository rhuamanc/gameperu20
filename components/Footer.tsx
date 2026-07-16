import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-white/5 mt-16">
      {/* Payment methods */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-xs text-gray-500 font-semibold mb-3 tracking-widest uppercase">Aceptamos:</p>
          <div className="flex flex-wrap gap-3 items-center">
            {['Yape'].map(m => (
              <span
                key={m}
                className="px-3 py-1.5 bg-bg-card border border-white/10 rounded-lg text-xs font-semibold text-gray-300"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image
                src="/images/logo_game.jpg"
                alt="Logo GamePeru+20"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-black text-white text-lg">GamePeru+20</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Vive tu mundo, juega el nuestro.<br />Entrega inmediata e instalación.
            </p>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Ayuda</h4>
            <ul className="space-y-2">
              {[
                { label: 'Preguntas frecuentes', href: '/faq' },
                { label: 'Políticas de reembolso', href: '/reembolsos' },
                { label: 'Términos y condiciones', href: '/terminos' },
                { label: 'Políticas de privacidad', href: '/privacidad' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Contáctanos</h4>
            <p className="text-gray-500 text-sm mb-2">soportegameperu+20@gmail.com</p>
            <p className="text-gray-500 text-sm mb-4">Soporte constante</p>
            <a
              href="https://wa.me/51950352842?text=Hola%20GamePeru%2B20%2C%20estoy%20interesado%20en%20un%20juego."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-greenDark text-white text-sm font-semibold rounded-xl transition-all"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Síguenos en</h4>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/GamePeru20/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-bg-card border border-white/10 hover:border-brand-orange/40 text-gray-400 hover:text-white rounded-xl transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="p-2.5 bg-bg-card border border-white/10 hover:border-brand-orange/40 text-gray-400 hover:text-white rounded-xl transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="p-2.5 bg-bg-card border border-white/10 hover:border-brand-orange/40 text-gray-400 hover:text-white rounded-xl transition-all"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.97a8.16 8.16 0 004.79 1.52V7.04a4.85 4.85 0 01-1.02-.35z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-600 text-xs">© 2026 GamePeru+20 S.A.C. Todos los derechos reservados.</p>
          <p className="text-gray-700 text-xs">Garantizado </p>
        </div>
      </div>
    </footer>
  )
}
