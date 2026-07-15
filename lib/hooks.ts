'use client'

import { useState, useEffect, useCallback } from 'react'
import { Game, Banner } from './types'
import { SEED_GAMES, SEED_BANNERS } from './data'

const GAMES_KEY = 'kgstore_games'
const BANNERS_KEY = 'kgstore_banners'
const GAMES_MIGRATED_KEY = 'kgstore_games_migrated_to_json_v1'

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

function mergeSeedGamesWithStored(storedGames: Game[]): Game[] {
  const seedById = new Map(SEED_GAMES.map(game => [game.id, game]))
  const merged: Game[] = []
  const seen = new Set<string>()

  // Preserve existing admin/localStorage configuration for known IDs.
  for (const stored of storedGames) {
    const seed = seedById.get(stored.id)
    merged.push(seed ? { ...seed, ...stored } : stored)
    seen.add(stored.id)
  }

  // Add any new seed games not yet present in localStorage.
  for (const seed of SEED_GAMES) {
    if (!seen.has(seed.id)) merged.push(seed)
  }

  return merged
}

export function useGames() {
  const [games, setGamesState] = useState<Game[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let mounted = true

    const fetchGames = async () => {
      try {
        if (typeof window !== 'undefined') {
          const alreadyMigrated = localStorage.getItem(GAMES_MIGRATED_KEY) === '1'
          if (!alreadyMigrated) {
            const stored = loadFromStorage<Game[]>(GAMES_KEY, [])
            if (stored.length > 0) {
              await fetch('/api/games/migrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ games: stored }),
              })
            }
            localStorage.setItem(GAMES_MIGRATED_KEY, '1')
          }
        }

        const res = await fetch('/api/games', { cache: 'no-store' })
        if (!res.ok) throw new Error('failed')
        const data = (await res.json()) as Game[]
        if (mounted) {
          setGamesState(data)
          setLoaded(true)
        }
      } catch {
        const stored = loadFromStorage<Game[]>(GAMES_KEY, [])
        const merged = mergeSeedGamesWithStored(stored)
        if (mounted) {
          setGamesState(merged)
          setLoaded(true)
        }
      }
    }

    fetchGames()

    return () => {
      mounted = false
    }
  }, [])

  const setGames = useCallback((updater: Game[] | ((prev: Game[]) => Game[])) => {
    setGamesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return next
    })
  }, [])

  const addGame = useCallback(async (game: Omit<Game, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game),
    })
    if (!res.ok) throw new Error('No se pudo crear el juego')
    const created = (await res.json()) as Game
    setGames(prev => [created, ...prev])
    return created
  }, [setGames])

  const updateGame = useCallback(async (id: string, updates: Partial<Game>) => {
    const res = await fetch(`/api/games/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error('No se pudo actualizar el juego')
    const updated = (await res.json()) as Game
    setGames(prev => prev.map(g => (g.id === id ? updated : g)))
    return updated
  }, [setGames])

  const deleteGame = useCallback(async (id: string) => {
    const res = await fetch(`/api/games/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('No se pudo eliminar el juego')
    setGames(prev => prev.filter(g => g.id !== id))
  }, [setGames])

  const resetToSeed = useCallback(() => {
    saveToStorage(GAMES_KEY, SEED_GAMES)
    setGamesState(SEED_GAMES)
  }, [])

  return { games, loaded, addGame, updateGame, deleteGame, resetToSeed }
}

export function useBanners() {
  const [banners, setBannersState] = useState<Banner[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = loadFromStorage<Banner[]>(BANNERS_KEY, SEED_BANNERS)
    setBannersState(stored.sort((a, b) => a.order - b.order))
    setLoaded(true)
  }, [])

  const saveBanners = useCallback((next: Banner[]) => {
    const sorted = [...next].sort((a, b) => a.order - b.order)
    saveToStorage(BANNERS_KEY, sorted)
    setBannersState(sorted)
  }, [])

  const addBanner = useCallback((b: Banner) => {
    setBannersState(prev => {
      const next = [...prev, b].sort((a, b2) => a.order - b2.order)
      saveToStorage(BANNERS_KEY, next)
      return next
    })
  }, [])

  const updateBanner = useCallback((id: string, updates: Partial<Banner>) => {
    setBannersState(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...updates } : b).sort((a, b) => a.order - b.order)
      saveToStorage(BANNERS_KEY, next)
      return next
    })
  }, [])

  const deleteBanner = useCallback((id: string) => {
    setBannersState(prev => {
      const next = prev.filter(b => b.id !== id)
      saveToStorage(BANNERS_KEY, next)
      return next
    })
  }, [])

  return { banners, loaded, saveBanners, addBanner, updateBanner, deleteBanner }
}
