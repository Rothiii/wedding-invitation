import { Hono } from 'hono'
import { authService } from './auth.service'

export const authController = new Hono()

// POST /api/admin/auth/login
authController.post('/login', async (c) => {
  const body = await c.req.json()
  const result = authService.login(body)
  return c.json({ success: true, data: result })
})

// POST /api/admin/auth/logout
authController.post('/logout', async (c) => {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (token) {
    authService.logout(token)
  }

  return c.json({ success: true, message: 'Logged out successfully' })
})

// GET /api/admin/auth/verify
authController.get('/verify', async (c) => {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  const isValid = authService.validateSession(token)

  if (!isValid) {
    return c.json({ success: false, error: 'Invalid or expired token' }, 401)
  }

  const session = authService.getSession(token!)
  return c.json({
    success: true,
    data: {
      username: session?.username,
      expiresAt: session?.expiresAt,
    },
  })
})
