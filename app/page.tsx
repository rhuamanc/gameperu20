'use client';

import Hero from '@/components/Hero';
import GameSection from '@/components/GameSection';
import { useGames, useBanners } from '@/lib/hooks';
import { SEED_GAMES, SEED_BANNERS } from '@/lib/data';

export default function Home() {
  const { games } = useGames();
  const { banners } = useBanners();
  
  // Use seed games as fallback
  const displayGames = games.length > 0 ? games : SEED_GAMES;
  const displayBanners = banners.length > 0 ? banners : SEED_BANNERS;
  
  // Filter games by badge/category
  const featuredGames = displayGames.filter(g => g.isFeatured);
  const hotGames = displayGames.filter(g => g.isHot);
  const indieGames = displayGames.filter(g => g.categories.some(c => c.toLowerCase().includes('indie')));
  const newGames = [...displayGames].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  return (
    <main className="min-h-screen bg-gradient-to-b from-[--bg-primary] to-[--bg-secondary]">
      {/* Hero Carousel */}
      <Hero banners={displayBanners} />

      {/* Featured Games Section */}
      {featuredGames.length > 0 && (
        <GameSection title="Juegos Destacados" games={featuredGames.slice(0, 6)} viewAllHref="/tienda" />
      )}

      {/* Hot Games Section */}
      {hotGames.length > 0 && (
        <GameSection title="🔥 Trending" games={hotGames.slice(0, 6)} viewAllHref="/tienda" />
      )}

      {/* Indie Games Section */}
      {indieGames.length > 0 && (
        <GameSection title="Juegos Indie" games={indieGames.slice(0, 6)} viewAllHref="/tienda" />
      )}

      {/* Recently Added Section */}
      {newGames.length > 0 && (
        <GameSection title="Agregados Recientemente" games={newGames.slice(0, 6)} viewAllHref="/tienda" />
      )}

      {/* Promotional Banner */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Descubre tu próximo juego favorito
          </h2>
          <p className="text-gray-300 mb-6">
            Con GamePeru+20 accede a miles de juegos con el mejor catálogo y los mejores precios del mercado
          </p>
          <a
            href="/tienda"
            className="inline-block bg-[--br-orange] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Explorar Tienda
          </a>
        </div>
      </section>
    </main>
  );
}
