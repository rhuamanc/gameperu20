import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - GamePeru+20',
}

const faqs = [
  {
    q: '¿Tengo que comprar necesariamente desde la página?',
    a: 'No, de momento la página contiene el catálogo de los juegos a disposición. Una vez que ya sepas qué videojuego quieres adquirir, te contactas con nosotros por WhatsApp y coordinamos la compra.',
  },
  {
    q: '¿Cómo activan el videojuego en mi steam?',
    a: 'Lo realizamos por conexión remota por Rustdesk. Nos facilitas el control remoto de tu equipo por unos momentos y activamos el juego directamente al cliente de Steam, y te aparecerá disponible en tu Biblioteca.',
  },
  {
    q: '¿Tienen cualquier juego disponible?',
    a: 'De momento solo aquellos que no cuentan con DENUVO. En caso no lo veas disponible en la lista, contáctanos y haz la consulta porque podríamos conseguirlo con facilidad.',
  },
  {
    q: '¿El juego se activa directamente a mi cuenta de steam?',
    a: 'Sí, se instala directamente a tu cliente de Steam ejecutándose, más no en los servidores de Steam, eso evita también riesgos de baneo en tu cuenta. De todas maneras recomendamos crearse una nueva cuenta de Steam para activar los juegos.',
  },
  {
    q: '¿Se guardan las partidas jugadas?',
    a: 'Sí, las partidas se siguen guardando de forma local en tu equipo. Se recomienda poder jugarlo en modo desconectado. Recuerda que los juegos los descargas directamente de los Storage de Steam, por lo tanto son juegos crackeados, al menos que requieran un Bypass o Fix particular.',
  },
]

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-white mb-2">Preguntas Frecuentes</h1>
      <p className="text-gray-500 mb-10">Todo lo que necesitas saber antes de comprar.</p>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-bg-card border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-3 text-sm sm:text-base">{faq.q}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl text-center">
        <p className="text-white font-semibold mb-3">¿Tienes más preguntas?</p>
        <a
          href="https://wa.me/51950352842?text=Hola%20GamePeru%2B20%2C%20tengo%20una%20consulta."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-brand-green hover:bg-brand-greenDark text-white font-bold rounded-xl transition-all"
        >
          Contáctanos por WhatsApp
        </a>
      </div>
    </div>
  )
}
