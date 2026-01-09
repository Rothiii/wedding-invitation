import { Hono } from 'hono'
import { GuestService } from './guest.service'

const guestService = new GuestService()

// Public routes - for guest link validation
export const publicGuestController = new Hono()

// GET /api/guest/validate/:code - Validate guest code and record link opened
publicGuestController.get('/validate/:code', async (c) => {
  const { code } = c.req.param()
  const guest = await guestService.recordLinkOpened(code)
  return c.json({ success: true, data: guest })
})

// Admin routes
export const adminGuestController = new Hono()

// GET /api/admin/invitations/:uid/guests - List all guests for an invitation
adminGuestController.get('/:uid/guests', async (c) => {
  const { uid } = c.req.param()
  const guests = await guestService.getByInvitationUid(uid)
  return c.json({ success: true, data: guests })
})

// GET /api/admin/invitations/:uid/guests/with-links - Get guests with invitation links
adminGuestController.get('/:uid/guests/with-links', async (c) => {
  const { uid } = c.req.param()
  const baseUrl = process.env.BASE_URL || 'https://sakeenah.id'
  const guests = await guestService.getGuestsWithLinks(uid, baseUrl)
  return c.json({ success: true, data: guests })
})

// GET /api/admin/invitations/:uid/guests/stats - Get guest statistics
adminGuestController.get('/:uid/guests/stats', async (c) => {
  const { uid } = c.req.param()
  const stats = await guestService.getStats(uid)
  return c.json({ success: true, data: stats })
})

// POST /api/admin/invitations/:uid/guests - Create single guest
adminGuestController.post('/:uid/guests', async (c) => {
  const { uid } = c.req.param()
  const body = await c.req.json()
  const guest = await guestService.create(uid, body)
  return c.json({ success: true, data: guest }, 201)
})

// POST /api/admin/invitations/:uid/guests/bulk - Bulk create guests
adminGuestController.post('/:uid/guests/bulk', async (c) => {
  const { uid } = c.req.param()
  const body = await c.req.json()
  const guests = await guestService.bulkCreate(uid, body)
  return c.json({ success: true, data: guests }, 201)
})

// GET /api/admin/guests/:id - Get single guest by ID
adminGuestController.get('/guests/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const guest = await guestService.getById(id)
  return c.json({ success: true, data: guest })
})

// PUT /api/admin/guests/:id - Update guest
adminGuestController.put('/guests/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const body = await c.req.json()
  const guest = await guestService.update(id, body)
  return c.json({ success: true, data: guest })
})

// DELETE /api/admin/guests/:id - Delete guest
adminGuestController.delete('/guests/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await guestService.delete(id)
  return c.json({ success: true, message: 'Guest deleted' })
})
