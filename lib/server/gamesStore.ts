import { Game } from '@/lib/types'
import { SEED_GAMES } from '@/lib/data'
import { connectDB } from './mongodb'
import { GameModel } from './models'

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function ensureSeedGames() {
  const db = await connectDB()
  const count = await GameModel.countDocuments({})
  if (count === 0) {
    // Insert seed games
    const seedWithMetadata = SEED_GAMES.map(game => ({
      ...game,
      _deleted: false,
    }))
    await GameModel.insertMany(seedWithMetadata, { ordered: false }).catch(() => {
      // Ignore duplicate key errors
    })
  }
}

export async function getAllGames(): Promise<Game[]> {
  await connectDB()
  await ensureSeedGames()
  const games = await GameModel.find({}).lean()
  return games.map(g => {
    const { _deleted, ...doc } = g as any
    return doc as Game
  })
}

export async function getVisibleGames(): Promise<Game[]> {
  await connectDB()
  await ensureSeedGames()
  const games = await GameModel.find({ _deleted: { $ne: true } }).lean()
  return games.map(g => {
    const { _deleted, ...doc } = g as any
    return doc as Game
  })
}

export async function createGame(input: Omit<Game, 'id' | 'createdAt'>): Promise<Game> {
  await connectDB()
  
  const visibleGames = await getVisibleGames()
  const usedSlugs = new Set(visibleGames.map(g => g.slug).filter(Boolean))

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

  await GameModel.create(newGame)
  return newGame
}

export async function updateGameById(id: string, updates: Partial<Game>): Promise<Game | null> {
  await connectDB()
  
  const existing = await GameModel.findOne({ id }).lean()
  if (!existing) return null

  const { _id, __v, _deleted, ...rest } = existing as any

  const visibleGames = await getVisibleGames()
  const usedSlugs = new Set(
    visibleGames.filter(g => g.id !== id).map(g => g.slug).filter(Boolean)
  )

  const merged: Game = {
    ...rest,
    ...updates,
  } as Game

  const desiredSlug = slugify(merged.slug || merged.title) || `juego-${Date.now()}`
  let uniqueSlug = desiredSlug
  let i = 2
  while (usedSlugs.has(uniqueSlug)) {
    uniqueSlug = `${desiredSlug}-${i}`
    i++
  }
  merged.slug = uniqueSlug

  await GameModel.updateOne({ id }, { ...merged, _deleted: false })
  return merged
}

export async function deleteGameById(id: string): Promise<boolean> {
  await connectDB()
  
  const visibleGames = await getVisibleGames()
  const target = visibleGames.find(g => g.id === id)
  if (!target) return false

  const isSeed = SEED_GAMES.some(g => g.id === id)

  if (isSeed) {
    // Soft delete seed games
    await GameModel.updateOne({ id }, { _deleted: true })
    return true
  }

  // Hard delete custom games
  const result = await GameModel.deleteOne({ id })
  return result.deletedCount > 0
}

export async function upsertManyGames(games: Game[]): Promise<void> {
  if (!games.length) return
  await connectDB()

  for (const game of games) {
    await GameModel.updateOne(
      { id: game.id },
      { ...game, _deleted: false },
      { upsert: true }
    )
  }
}
