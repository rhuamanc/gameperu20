'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Send } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  gameTitle: string
  amount: number
}

export default function PaymentModal({
  isOpen,
  onClose,
  gameTitle,
  amount
}: PaymentModalProps) {
  const [operationNumber, setOperationNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSendToWhatsApp = async () => {
    if (!operationNumber.trim()) {
      alert('Por favor ingresa el número de operación')
      return
    }

    setIsLoading(true)

    try {
      // Construir mensaje
      let message = `*COMPRA DE JUEGO*\n\n`
      message += `🎮 Juego: ${gameTitle}\n`
      message += `💰 Monto: S/ ${amount.toFixed(2)}\n`

      if (operationNumber) {
        message += `📱 Nº de operación: ${operationNumber}\n`
      }

      message += `\n_Gracias por tu compra_`

      // Codificar mensaje
      const encodedMessage = encodeURIComponent(message)
      const whatsappNumber = '51950352842'

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      window.open(whatsappUrl, '_blank')

      // Limpiar
      setOperationNumber('')
      setTimeout(onClose, 1000)
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error al enviar. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-bg-secondary border-b border-white/10 p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white">Pagar con Yape</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-white/10 rounded-lg transition disabled:opacity-50"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Juego y monto */}
          <div className="bg-bg-card border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Juego</p>
            <p className="text-white font-semibold mb-4">{gameTitle}</p>
            <p className="text-gray-400 text-sm mb-2">Monto a pagar</p>
            <p className="text-2xl sm:text-3xl font-bold text-brand-orange">
              S/ {amount.toFixed(2)}
            </p>
          </div>

          {/* QR */}
          <div className="bg-bg-card border border-white/10 rounded-lg p-4 flex flex-col items-center">
            <p className="text-gray-400 text-sm mb-3">Código QR</p>
            <div className="relative w-48 h-48 bg-white p-2 rounded-lg">
              <Image
                src="/api/private/images/yape.jpeg"
                alt="QR Yape"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-gray-400 text-xs mt-3 text-center">
              Escanea con tu app Yape
            </p>
          </div>

          {/* Número de operación */}
          <div className="space-y-3">
            <p className="text-white font-semibold text-sm">Número de operación</p>
            <div>
              <input
                type="text"
                placeholder="Ej: 12345678"
                value={operationNumber}
                onChange={(e) => setOperationNumber(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange disabled:opacity-50"
              />
              <p className="text-gray-500 text-xs mt-2">
                Encontrarás este número en tu app Yape
              </p>
            </div>
          </div>

          {/* Botón Enviar */}
          <button
            onClick={handleSendToWhatsApp}
            disabled={isLoading || !operationNumber.trim()}
            className="w-full px-4 py-3 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Enviar a WhatsApp</span>
              </>
            )}
          </button>

          {/* Aviso */}
          <p className="text-gray-500 text-xs text-center bg-white/5 border border-white/10 rounded-lg p-2">
            Al enviar, se abrirá WhatsApp Web con el juego, monto y número de operación para confirmar tu compra.
          </p>
        </div>
      </div>
    </div>
  )
}
