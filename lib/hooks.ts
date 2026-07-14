'use client'

import { useState, useEffect, useCallback } from 'react'
import { Game, Banner } from './types'
import { SEED_GAMES, SEED_BANNERS } from './data'

const GAMES_KEY = 'kgstore_games'
const BANNERS_KEY = 'kgstore_banners'

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

export function useGames() {
  const [games, setGamesState] = useState<Game[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = loadFromStorage<Game[]>(GAMES_KEY, SEED_GAMES)
    setGamesState(stored)
    setLoaded(true)
  }, [])

  const setGames = useCallback((updater: Game[] | ((prev: Game[]) => Game[])) => {
    setGamesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveToStorage(GAMES_KEY, next)
      return next
    })
  }, [])

  const addGame = useCallback((game: Game) => {
    setGames(prev => {
      const next = [game, ...prev]
      saveToStorage(GAMES_KEY, next)
      return next
    })
  }, [setGames])

  const updateGame = useCallback((id: string, updates: Partial<Game>) => {
    setGames(prev => {
      const next = prev.map(g => g.id === id ? { ...g, ...updates } : g)
      saveToStorage(GAMES_KEY, next)
      return next
    })
  }, [setGames])

  const deleteGame = useCallback((id: string) => {
    setGames(prev => {
      const next = prev.filter(g => g.id !== id)
      saveToStorage(GAMES_KEY, next)
      return next
    })
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
