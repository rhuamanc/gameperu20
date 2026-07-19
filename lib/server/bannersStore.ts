import { Banner } from '@/lib/types'
import { SEED_BANNERS } from '@/lib/data'
import { connectDB } from './mongodb'
import { BannerModel } from './models'

async function ensureSeedBanners() {
  await connectDB()
  const count = await BannerModel.countDocuments({})
  if (count === 0) {
    const bannerWithMetadata = SEED_BANNERS.map(banner => ({
      ...banner,
      _deleted: false,
    }))
    await BannerModel.insertMany(bannerWithMetadata, { ordered: false }).catch(() => {
      // Ignore duplicate key errors
    })
  }
}

export async function getAllBanners(): Promise<Banner[]> {
  await connectDB()
  await ensureSeedBanners()
  const banners = await BannerModel.find({}).lean()
  return banners.map(b => {
    const { _deleted, ...doc } = b as any
    return doc as Banner
  })
}

export async function getVisibleBanners(): Promise<Banner[]> {
  await connectDB()
  await ensureSeedBanners()
  const banners = await BannerModel.find({ _deleted: { $ne: true } }).lean()
  return banners.map(b => {
    const { _deleted, ...doc } = b as any
    return doc as Banner
  })
}

export async function createBanner(input: Omit<Banner, 'id'>): Promise<Banner> {
  await connectDB()

  const newBanner: Banner = {
    ...input,
    id: crypto.randomUUID(),
  }

  await BannerModel.create(newBanner)
  return newBanner
}

export async function updateBannerById(id: string, updates: Partial<Banner>): Promise<Banner | null> {
  await connectDB()

  const existing = await BannerModel.findOne({ id, _deleted: { $ne: true } }).lean()
  if (!existing) return null

  const merged: Banner = {
    ...existing,
    ...updates,
  } as Banner

  await BannerModel.updateOne({ id }, merged)
  return merged
}

export async function deleteBannerById(id: string): Promise<boolean> {
  await connectDB()

  const visibleBanners = await getVisibleBanners()
  const target = visibleBanners.find(b => b.id === id)
  if (!target) return false

  const isSeed = SEED_BANNERS.some(b => b.id === id)

  if (isSeed) {
    // Soft delete seed banners
    await BannerModel.updateOne({ id }, { _deleted: true })
    return true
  }

  // Hard delete custom banners
  const result = await BannerModel.deleteOne({ id })
  return result.deletedCount > 0
}

export async function upsertManyBanners(banners: Banner[]): Promise<void> {
  if (!banners.length) return
  await connectDB()

  for (const banner of banners) {
    await BannerModel.updateOne(
      { id: banner.id },
      { ...banner, _deleted: false },
      { upsert: true }
    )
  }
}
