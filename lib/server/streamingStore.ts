import { StreamingProduct } from '@/lib/types'
import { connectDB } from './mongodb'
import { StreamingModel } from './models'

export async function getAllStreaming(): Promise<StreamingProduct[]> {
  await connectDB()
  const docs = await StreamingModel.find({ _deleted: { $ne: true } }).lean()
  return docs.map(doc => {
    const { _id, __v, _deleted, ...rest } = doc as any
    return rest as StreamingProduct
  })
}

export async function createStreaming(input: Omit<StreamingProduct, 'id' | 'createdAt'>): Promise<StreamingProduct> {
  await connectDB()

  const newItem: StreamingProduct = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  await StreamingModel.create({ ...newItem, _deleted: false })
  return newItem
}

export async function updateStreamingById(id: string, updates: Partial<StreamingProduct>): Promise<StreamingProduct | null> {
  await connectDB()

  const existing = await StreamingModel.findOne({ id }).lean()
  if (!existing) return null

  const { _id, __v, _deleted, ...rest } = existing as any
  const merged: StreamingProduct = {
    ...rest,
    ...updates,
  } as StreamingProduct

  await StreamingModel.updateOne({ id }, { ...merged, _deleted: false })
  return merged
}

export async function deleteStreamingById(id: string): Promise<boolean> {
  await connectDB()
  const result = await StreamingModel.updateOne({ id }, { _deleted: true })
  return result.modifiedCount > 0
}
