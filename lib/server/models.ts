import mongoose from 'mongoose'
import { Game, Banner, StreamingProduct } from '@/lib/types'

// Extended types for MongoDB documents
interface GameDocument extends Game {
  _deleted?: boolean
}

interface BannerDocument extends Banner {
  _deleted?: boolean
}

interface StreamingDocument extends StreamingProduct {
  _deleted?: boolean
}

// Game Schema
const gameSchema = new mongoose.Schema<GameDocument>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    platform: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    coverImage: { type: String, required: true },
    horizontalImage: { type: String },
    gameplayUrl: { type: String },
    categories: { type: [String], default: [] },
    isHot: { type: Boolean, default: false },
    hasDenuvo: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    accountType: { type: String, default: 'offline' },
    description: { type: String, default: '' },
    aboutProduct: { type: String, default: '' },
    redeemGuide: { type: String, default: '' },
    releaseDate: { type: String },
    badge: { type: String, default: '' },
    createdAt: { type: String, required: true },
    _deleted: { type: Boolean, default: false },
  } as any,
  { timestamps: false }
)

// Banner Schema
const bannerSchema = new mongoose.Schema<BannerDocument>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: { type: String, required: true },
    badge: { type: String, required: true },
    date: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    ctaText: { type: String, required: true },
    active: { type: Boolean, default: true },
    order: { type: Number, required: true },
    _deleted: { type: Boolean, default: false },
  } as any,
  { timestamps: false }
)

const streamingSchema = new mongoose.Schema<StreamingDocument>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    provider: { type: String, required: true },
    plan: { type: String, required: true },
    duration: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    badge: { type: String, default: '' },
    createdAt: { type: String, required: true },
    _deleted: { type: Boolean, default: false },
  } as any,
  { timestamps: false }
)

// Create or get models
export const GameModel = mongoose.models.Game || mongoose.model<GameDocument>('Game', gameSchema)
export const BannerModel = mongoose.models.Banner || mongoose.model<BannerDocument>('Banner', bannerSchema)
export const StreamingModel = mongoose.models.Streaming || mongoose.model<StreamingDocument>('Streaming', streamingSchema)
