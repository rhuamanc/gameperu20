import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GamePeru+20 - Vive tu mundo, juega el nuestro',
  description: 'Compra videojuegos digitales con grandes descuentos. Entrega inmediata e instalación. Juegos para Steam, PC y más.',
  keywords: 'videojuegos, juegos baratos, steam, gaming, peru, ofertas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-bg-primary text-white antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}
