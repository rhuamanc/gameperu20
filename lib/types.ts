export interface Game {
  id: string
  title: string
  slug: string
  platform: 'Steam' | 'Epic' | 'Origin' | 'Uplay' | 'Battle.net'
  originalPrice: number
  salePrice: number
  coverImage: string
  horizontalImage?: string
  gameplayUrl?: string
  categories: string[]
  isHot: boolean
  hasDenuvo: boolean
  isFeatured: boolean
  isNew: boolean
  accountType: 'offline' | 'online'
  description: string
  releaseDate?: string
  badge?: string // 'ESTRENO', 'PREVENTA', etc.
  createdAt: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  badge: string
  date: string
  originalPrice: number
  salePrice: number
  discount: number
  ctaText: string
  active: boolean
  order: number
}

export type Category =
  | 'Acción'
  | 'Aventura'
  | 'Carreras'
  | 'Conducción'
  | 'Construcción'
  | 'Deportes'
  | 'Estrategia'
  | 'Hack and Slash'
  | 'Indie'
  | 'Lucha'
  | 'Metroidvania'
  | 'Mundo Abierto'
  | 'Plataformas'
  | 'Roguelike'
  | 'RPG'
  | 'Shooter'
  | 'Simulación'
  | 'Souls'
  | 'Supervivencia'
  | 'Survival Horror'
  | 'Terror'

export const ALL_CATEGORIES: Category[] = [
  'Acción', 'Aventura', 'Carreras', 'Conducción', 'Construcción',
  'Deportes', 'Estrategia', 'Hack and Slash', 'Indie', 'Lucha',
  'Metroidvania', 'Mundo Abierto', 'Plataformas', 'Roguelike', 'RPG',
  'Shooter', 'Simulación', 'Souls', 'Supervivencia', 'Survival Horror', 'Terror'
]
