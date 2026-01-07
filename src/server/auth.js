import { createHash } from 'crypto'

// Hardcoded admin credentials (hashed with salt)
// Password: admin123 (change this in production!)
const SALT = 'sakeenah-wedding-admin-2024'
const ADMIN_USERNAME = 'admin'
// SHA-256 hash of: SALT + 'admin123'
const ADMIN_PASSWORD_HASH = hashPassword('admin123')

export function hashPassword(password) {
  return createHash('sha256')
    .update(SALT + password)
    .digest('hex')
}

export function verifyCredentials(username, password) {
  const passwordHash = hashPassword(password)
  return username === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH
}

// Simple session management using tokens
const sessions = new Map()
const SESSION_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

export function createSession(username) {
  const token = createHash('sha256')
    .update(username + Date.now() + Math.random().toString())
    .digest('hex')

  sessions.set(token, {
    username,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_EXPIRY
  })

  return token
}

export function validateSession(token) {
  if (!token) return false

  const session = sessions.get(token)
  if (!session) return false

  if (Date.now() > session.expiresAt) {
    sessions.delete(token)
    return false
  }

  return true
}

export function destroySession(token) {
  sessions.delete(token)
}

// Middleware for protected routes
export function authMiddleware(c, next) {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!validateSession(token)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  return next()
}
