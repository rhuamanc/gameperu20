export const ADMIN_PUBLIC_PATH = '/adminstyven24'
export const ADMIN_PASSWORD_PREFIX = 'styven24'
export const ADMIN_COOKIE_NAME = 'gp20_admin_auth'

function getSeed() {
  return process.env.ADMIN_TOKEN_SEED || process.env.MONGO_URI || 'gameperu20-admin-seed'
}

function getTokenTimezone() {
  return process.env.ADMIN_TOKEN_TIMEZONE || 'America/Lima'
}

function getTokenDay(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: getTokenTimezone(),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(now)
  const year = parts.find(p => p.type === 'year')?.value
  const month = parts.find(p => p.type === 'month')?.value
  const day = parts.find(p => p.type === 'day')?.value

  if (!year || !month || !day) {
    return now.toISOString().slice(0, 10)
  }

  return `${year}-${month}-${day}`
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false

  let mismatch = 0
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i)
  }

  return mismatch === 0
}

function hashString(input: string) {
  let hashA = 0x811c9dc5
  let hashB = 0x01000193

  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i)
    hashA ^= code
    hashA = Math.imul(hashA, 0x01000193)
    hashB ^= code + i
    hashB = Math.imul(hashB, 0x27d4eb2d)
  }

  const partA = (hashA >>> 0).toString(16).padStart(8, '0')
  const partB = (hashB >>> 0).toString(16).padStart(8, '0')
  return `${partA}${partB}${partA}${partB}`
}

export function getCurrentAdminToken(now = new Date()) {
  const day = getTokenDay(now)
  return hashString(`${getSeed()}:${day}`).slice(0, 10)
}

export function getCurrentAdminPassword(now = new Date()) {
  return `${ADMIN_PASSWORD_PREFIX}${getCurrentAdminToken(now)}`
}

export function getAdminSessionValue(now = new Date()) {
  return hashString(`${getSeed()}:${getCurrentAdminPassword(now)}`)
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
