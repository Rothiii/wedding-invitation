import type { Context, Next } from 'hono'
import { authService } from '../../../modules/auth/auth.service'

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!authService.validateSession(token)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  return next()
}
