import { readFile } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params
    
    // Validar que el archivo sea permitido (evitar path traversal)
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Solo servir archivos de imagen
    if (!['yape.jpeg', 'yape.jpg', 'yape.png'].includes(filename)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    const imagePath = join(process.cwd(), 'private/images', filename)
    const buffer = await readFile(imagePath)
    
    // Detectar tipo MIME
    const mimeTypes: Record<string, string> = {
      'jpeg': 'image/jpeg',
      'jpg': 'image/jpeg',
      'png': 'image/png'
    }
    const ext = filename.split('.').pop() || 'jpeg'
    const contentType = mimeTypes[ext] || 'image/jpeg'
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff'
      }
    })
  } catch (error) {
    console.error('Error serving private image:', error)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
