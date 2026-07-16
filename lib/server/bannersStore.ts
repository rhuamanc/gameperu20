import { promises as fs } from 'fs'
import path from 'path'
import { Banner } from '@/lib/types'
import { SEED_BANNERS } from '@/lib/data'

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'banners.json')

async function ensureStoreFile() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(dataFile)
  } catch {
    await fs.writeFile(dataFile, JSON.stringify([], null, 2), 'utf8')
  }
}

async function readStoredBanners(): Promise<Banner[]> {
  await ensureStoreFile()
  try {
    const raw = await fs.readFile(dataFile, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Banner[]) : []
  } catch {
    return []
  }
}

async function writeStoredBanners(banners: Banner[]) {
  await ensureStoreFile()
  await fs.writeFile(dataFile, JSON.stringify(banners, null, 2), 'utf8')
}

function sortByOrder(banners: Banner[]): Banner[] {
  return [...banners].sort((a, b) => a.order - b.order)
}

function mergeSeedWithCustom(storedBanners: Banner[]): Banner[] {
  const mergedMap = new Map<string, Banner>()

  for (const seed of SEED_BANNERS) {
    mergedMap.set(seed.id, seed)
  }

  for (const custom of storedBanners) {
    mergedMap.set(custom.id, custom)
  }

  return sortByOrder(Array.from(mergedMap.values()))
}

export async function getAllBanners(): Promise<Banner[]> {
  const custom = await readStoredBanners()
  return mergeSeedWithCustom(custom)
}

export async function createBanner(input: Omit<Banner, 'id'>): Promise<Banner> {
  const custom = await readStoredBanners()

  const newBanner: Banner = {
    ...input,
    id: crypto.randomUUID(),
  }

  const next = sortByOrder([newBanner, ...custom])
  await writeStoredBanners(next)
  return newBanner
}

export async function updateBannerById(id: string, updates: Partial<Banner>): Promise<Banner | null> {
  const all = await getAllBanners()
  const existing = all.find(b => b.id === id)
  if (!existing) return null

  const merged: Banner = {
    ...existing,
    ...updates,
    id,
  }

  const custom = await readStoredBanners()
  const filtered = custom.filter(b => b.id !== id)
  const next = sortByOrder([merged, ...filtered])
  await writeStoredBanners(next)

  return merged
}

export async function deleteBannerById(id: string): Promise<boolean> {
  const custom = await readStoredBanners()
  const isSeed = SEED_BANNERS.some(b => b.id === id)

  if (isSeed) {
    const all = await getAllBanners()
    const target = all.find(b => b.id === id)
    if (!target) return false

    const disabledSeed: Banner = {
      ...target,
      active: false,
    }

    const filtered = custom.filter(b => b.id !== id)
    await writeStoredBanners(sortByOrder([disabledSeed, ...filtered]))
    return true
  }

  const next = custom.filter(b => b.id !== id)
  await writeStoredBanners(sortByOrder(next))
  return next.length !== custom.length
}

export async function upsertManyBanners(banners: Banner[]): Promise<void> {
  if (!banners.length) return

  const custom = await readStoredBanners()
  const mergedById = new Map<string, Banner>()

  for (const existing of custom) {
    mergedById.set(existing.id, existing)
  }

  for (const incoming of banners) {
    mergedById.set(incoming.id, incoming)
  }

  await writeStoredBanners(sortByOrder(Array.from(mergedById.values())))
}
