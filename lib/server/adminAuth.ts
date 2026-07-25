import { createHash, timingSafeEqual } from 'crypto'

export const ADMIN_PUBLIC_PATH = '/adminstyven24'
export const ADMIN_PASSWORD_PREFIX = 'styven24'
export const ADMIN_COOKIE_NAME = 'gp20_admin_auth'

function getSeed() {
  return process.env.ADMIN_TOKEN_SEED || process.env.MONGO_URI || 'gameperu20-admin-seed'
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function getCurrentAdminToken(now = new Date()) {
  const day = now.toISOString().slice(0, 10)
  return createHash('sha256').update(`${getSeed()}:${day}`).digest('hex').slice(0, 10)
}

export function getCurrentAdminPassword(now = new Date()) {
  return `${ADMIN_PASSWORD_PREFIX}${getCurrentAdminToken(now)}`
}

export function getAdminSessionValue(now = new Date()) {
  return createHash('sha256').update(`${getSeed()}:${getCurrentAdminPassword(now)}`).digest('hex')
}

export function isValidAdminPassword(password: string, now = new Date()) {
  return safeEqual(password, getCurrentAdminPassword(now))
}

export function isValidAdminSession(sessionValue?: string | null, now = new Date()) {
  if (!sessionValue) return false
  return safeEqual(sessionValue, getAdminSessionValue(now))
}

export function getAdminCookieConfig() {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  }
}
