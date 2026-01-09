import { createHash } from 'crypto'
import { UnauthorizedError, ValidationError } from '../../shared/errors'
import type { LoginDto, LoginResponseDto, SessionDto } from './auth.dto'

// Configuration
const SALT = process.env.AUTH_SALT || 'sakeenah-wedding-admin-2024'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const SESSION_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

// In-memory session storage
const sessions = new Map<string, SessionDto>()

export class AuthService {
  private hashPassword(password: string): string {
    return createHash('sha256')
      .update(SALT + password)
      .digest('hex')
  }

  private generateToken(username: string): string {
    return createHash('sha256')
      .update(username + Date.now() + Math.random().toString())
      .digest('hex')
  }

  login(data: LoginDto): LoginResponseDto {
    if (!data.username || !data.password) {
      throw new ValidationError('Username and password are required')
    }

    const passwordHash = this.hashPassword(data.password)
    const expectedHash = this.hashPassword(ADMIN_PASSWORD)

    if (data.username !== ADMIN_USERNAME || passwordHash !== expectedHash) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const token = this.generateToken(data.username)
    const expiresAt = Date.now() + SESSION_EXPIRY

    sessions.set(token, {
      username: data.username,
      createdAt: Date.now(),
      expiresAt,
    })

    return { token, expiresAt }
  }

  logout(token: string): void {
    sessions.delete(token)
  }

  validateSession(token: string | undefined): boolean {
    if (!token) return false

    const session = sessions.get(token)
    if (!session) return false

    if (Date.now() > session.expiresAt) {
      sessions.delete(token)
      return false
    }

    return true
  }

  getSession(token: string): SessionDto | null {
    if (!token) return null

    const session = sessions.get(token)
    if (!session) return null

    if (Date.now() > session.expiresAt) {
      sessions.delete(token)
      return null
    }

    return session
  }

  // Cleanup expired sessions (can be called periodically)
  cleanupExpiredSessions(): number {
    const now = Date.now()
    let cleaned = 0

    for (const [token, session] of sessions.entries()) {
      if (now > session.expiresAt) {
        sessions.delete(token)
        cleaned++
      }
    }

    return cleaned
  }
}

// Singleton instance
export const authService = new AuthService()
