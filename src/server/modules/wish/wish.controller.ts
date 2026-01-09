import { Hono } from 'hono'
import { WishService } from './wish.service'

const wishService = new WishService()

// Public routes
export const publicWishController = new Hono()

// GET /api/:uid/wishes - Get wishes with pagination
publicWishController.get('/:uid/wishes', async (c) => {
  const { uid } = c.req.param()
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  const result = await wishService.getByInvitationUid(uid, page, limit)
  return c.json({ success: true, ...result })
})

// POST /api/:uid/wishes - Create a new wish
publicWishController.post('/:uid/wishes', async (c) => {
  const { uid } = c.req.param()
  const body = await c.req.json()
  const wish = await wishService.create(uid, body)
  return c.json({ success: true, data: wish }, 201)
})

// GET /api/:uid/stats - Get attendance statistics
publicWishController.get('/:uid/stats', async (c) => {
  const { uid } = c.req.param()
  const stats = await wishService.getStats(uid)
  return c.json({ success: true, data: stats })
})

// Admin routes
export const adminWishController = new Hono()

// GET /api/admin/invitations/:uid/wishes - Get all wishes for admin
adminWishController.get('/:uid/wishes', async (c) => {
  const { uid } = c.req.param()
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '100')

  const result = await wishService.getByInvitationUid(uid, page, limit)
  return c.json({ success: true, ...result })
})

// DELETE /api/admin/wishes/:id - Delete a wish
adminWishController.delete('/wishes/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await wishService.delete(id)
  return c.json({ success: true, message: 'Wish deleted' })
})

// GET /api/admin/invitations/:uid/stats - Get stats for admin
adminWishController.get('/:uid/stats', async (c) => {
  const { uid } = c.req.param()
  const stats = await wishService.getStats(uid)
  return c.json({ success: true, data: stats })
})
