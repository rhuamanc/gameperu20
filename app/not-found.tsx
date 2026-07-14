export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-8xl font-black text-brand-orange">404</h1>
      <p className="text-xl font-bold text-white mt-4">Página no encontrada</p>
      <p className="text-gray-500 text-sm mt-2">La página que buscas no existe.</p>
      <a href="/" className="mt-6 px-6 py-3 bg-brand-orange hover:bg-brand-orangeLight text-white font-bold rounded-xl transition-all">
        Volver al inicio
      </a>
    </div>
  )
}
