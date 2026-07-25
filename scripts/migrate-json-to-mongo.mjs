import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'

async function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  try {
    const raw = await fs.readFile(envPath, 'utf8')
    const lines = raw.split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const value = trimmed.slice(eq + 1).trim()
      if (key && !process.env[key]) process.env[key] = value
    }
  } catch {
    // Ignore when .env.local does not exist
  }
}

await loadEnvLocal()

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
  throw new Error('MONGO_URI no esta definido')
}

const root = process.cwd()
const gamesPath = path.join(root, 'data', 'games.json')
const bannersPath = path.join(root, 'data', 'banners.json')

const gameSchema = new mongoose.Schema({}, { strict: false, collection: 'games' })
const bannerSchema = new mongoose.Schema({}, { strict: false, collection: 'banners' })

const GameModel = mongoose.models.GameMigration || mongoose.model('GameMigration', gameSchema)
const BannerModel = mongoose.models.BannerMigration || mongoose.model('BannerMigration', bannerSchema)

function normalizeGame(game) {
  const doc = { ...game }
  if (!doc.id) doc.id = crypto.randomUUID()
  if (!doc.createdAt) doc.createdAt = new Date().toISOString()
  if (!Array.isArray(doc.categories)) doc.categories = []
  if (typeof doc.description !== 'string') doc.description = ''
  if (typeof doc.aboutProduct !== 'string') doc.aboutProduct = ''
  if (typeof doc.redeemGuide !== 'string') doc.redeemGuide = ''
  if (typeof doc.badge !== 'string') doc.badge = ''
  return doc
}

function normalizeBanner(banner) {
  const doc = { ...banner }
  if (!doc.id) doc.id = String(Date.now())
  if (typeof doc.subtitle !== 'string') doc.subtitle = ''
  if (typeof doc.badge !== 'string') doc.badge = ''
  if (typeof doc.date !== 'string') doc.date = ''
  if (typeof doc.ctaText !== 'string') doc.ctaText = 'COMPRAR AHORA'
  if (typeof doc.active !== 'boolean') doc.active = true
  if (typeof doc.order !== 'number') doc.order = 99
  return doc
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8')
  const data = JSON.parse(raw)
  if (!Array.isArray(data)) throw new Error(`${filePath} no contiene un array`)
  return data
}

async function run() {
  await mongoose.connect(MONGO_URI)

  const [gamesJson, bannersJson] = await Promise.all([
    readJson(gamesPath),
    readJson(bannersPath),
  ])

  const games = gamesJson.map(normalizeGame)
  const banners = bannersJson.map(normalizeBanner)

  let upsertedGames = 0
  for (const game of games) {
    const res = await GameModel.updateOne({ id: game.id }, { $set: game }, { upsert: true })
    if (res.upsertedCount > 0 || res.modifiedCount > 0) upsertedGames += 1
  }

  let upsertedBanners = 0
  for (const banner of banners) {
    const res = await BannerModel.updateOne({ id: banner.id }, { $set: banner }, { upsert: true })
    if (res.upsertedCount > 0 || res.modifiedCount > 0) upsertedBanners += 1
  }

  const totalGames = await GameModel.countDocuments({})
  const totalBanners = await BannerModel.countDocuments({})

  console.log(`Migracion completada.`)
  console.log(`Games procesados: ${games.length}, cambios aplicados: ${upsertedGames}, total en Mongo: ${totalGames}`)
  console.log(`Banners procesados: ${banners.length}, cambios aplicados: ${upsertedBanners}, total en Mongo: ${totalBanners}`)

  await mongoose.disconnect()
}

run().catch(async (error) => {
  console.error('Error migrando JSON a Mongo:', error)
  try {
    await mongoose.disconnect()
  } catch {}
  process.exit(1)
})
