import Link from 'next/link'

const pages = [
  { title: 'Políticas de Reembolso', slug: 'reembolsos', content: 'En KiroGaming entendemos que pueden surgir inconvenientes. Si tienes problemas con la activación del juego, nos comprometemos a resolverlo. Los reembolsos se evalúan caso a caso. Contáctanos por WhatsApp para iniciar el proceso.' },
  { title: 'Políticas de Reembolso', slug: 'reembolsos', content: 'En GamePeru+20 entendemos que pueden surgir inconvenientes. Si tienes problemas con la activación del juego, nos comprometemos a resolverlo. Los reembolsos se evalúan caso a caso. Contáctanos por WhatsApp para iniciar el proceso.' },
  { title: 'Términos y Condiciones', slug: 'terminos', content: 'Al comprar en GamePeru+20 aceptas que los juegos son de uso personal y no pueden ser revendidos. La activación se realiza de forma remota por nuestro equipo. GamePeru+20 no se hace responsable por baneos derivados del mal uso.' },
  { title: 'Políticas de Privacidad', slug: 'privacidad', content: 'En GamePeru+20 respetamos tu privacidad. No compartimos tus datos con terceros. La información de contacto se usa únicamente para gestionar tu compra y darte soporte.' },
]

export function generateStaticParams() {
  return pages.map(p => ({ slug: p.slug }))
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = pages.find(p => p.slug === slug)
  if (!page) return null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="text-brand-orange hover:underline text-sm mb-6 inline-block">← Volver al inicio</Link>
      <h1 className="text-3xl font-black text-white mb-6">{page.title}</h1>
      <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
        <p className="text-gray-400 leading-relaxed">{page.content}</p>
      </div>
    </div>
  )
}
