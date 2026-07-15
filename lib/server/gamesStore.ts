import { promises as fs } from 'fs'
import path from 'path'
import { Game } from '@/lib/types'
import { SEED_GAMES } from '@/lib/data'

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'games.json')

type StoredGame = Game & {
  _deleted?: boolean
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function ensureStoreFile() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(dataFile)
  } catch {
    await fs.writeFile(dataFile, JSON.stringify([], null, 2), 'utf8')
  }
}

async function readStoredGames(): Promise<StoredGame[]> {
  await ensureStoreFile()
  try {
    const raw = await fs.readFile(dataFile, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as StoredGame[]) : []
  } catch {
    return []
  }
}

async function writeStoredGames(games: StoredGame[]) {
  await ensureStoreFile()
  await fs.writeFile(dataFile, JSON.stringify(games, null, 2), 'utf8')
}

function mergeSeedWithCustom(storedGames: StoredGame[]): StoredGame[] {
  const mergedMap = new Map<string, StoredGame>()

  for (const seed of SEED_GAMES) {
    mergedMap.set(seed.id, seed)
  }

  for (const custom of storedGames) {
    mergedMap.set(custom.id, custom)
  }

  return Array.from(mergedMap.values())
}

export async function getAllGames(): Promise<Game[]> {
  const custom = await readStoredGames()
  return mergeSeedWithCustom(custom)
}

export async function getVisibleGames(): Promise<Game[]> {
  const custom = await readStoredGames()
  const merged = mergeSeedWithCustom(custom)
  return merged.filter(game => !game._deleted)
}

export async function createGame(input: Omit<Game, 'id' | 'createdAt'>): Promise<Game> {
  const custom = await readStoredGames()
  const usedSlugs = new Set((await getVisibleGames()).map(g => g.slug).filter(Boolean))

  const base = slugify(input.slug || input.title) || `juego-${Date.now()}`
  let slug = base
  let i = 2
  while (usedSlugs.has(slug)) {
    slug = `${base}-${i}`
    i++
  }

  const newGame: Game = {
    ...input,
    id: crypto.randomUUID(),
    slug,
    createdAt: new Date().toISOString(),
  }

  const next: StoredGame[] = [newGame, ...custom]
  await writeStoredGames(next)
  return newGame
}

export async function updateGameById(id: string, updates: Partial<Game>): Promise<Game | null> {
  const all = await getVisibleGames()
  const existing = all.find(g => g.id === id)
  if (!existing) return null

  const custom = await readStoredGames()
  const usedSlugs = new Set(
    all.filter(g => g.id !== id).map(g => g.slug).filter(Boolean)
  )

  const merged: Game = {
    ...existing,
    ...updates,
  }

  const desiredSlug = slugify(merged.slug || merged.title) || `juego-${Date.now()}`
  let uniqueSlug = desiredSlug
  let i = 2
  while (usedSlugs.has(uniqueSlug)) {
    uniqueSlug = `${desiredSlug}-${i}`
    i++
  }
  merged.slug = uniqueSlug

  // Persist updates into custom store (for both seed ids and custom ids)
  const filtered = custom.filter(g => g.id !== id)
  const next: StoredGame[] = [merged, ...filtered]
  await writeStoredGames(next)

  return merged
}

export async function deleteGameById(id: string): Promise<boolean> {
  const custom = await readStoredGames()
  const all = await getVisibleGames()
  const target = all.find(g => g.id === id)
  if (!target) return false

  const isSeed = SEED_GAMES.some(g => g.id === id)

  if (isSeed) {
    const tombstone: StoredGame = { ...target, _deleted: true }
    const filtered = custom.filter(g => g.id !== id)
    await writeStoredGames([tombstone, ...filtered])
    return true
  }

  const next = custom.filter(g => g.id !== id)
  await writeStoredGames(next)
  return next.length !== custom.length
}

export async function upsertManyGames(games: Game[]): Promise<void> {
  if (!games.length) return

  const custom = await readStoredGames()
  const mergedById = new Map<string, StoredGame>()

  for (const existing of custom) {
    mergedById.set(existing.id, existing)
  }

  for (const incoming of games) {
    mergedById.set(incoming.id, incoming)
  }

  await writeStoredGames(Array.from(mergedById.values()))
}
