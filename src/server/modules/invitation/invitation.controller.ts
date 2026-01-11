import { Hono } from 'hono'
import { InvitationService } from './invitation.service'

const invitationService = new InvitationService()

// Public routes
export const publicInvitationController = new Hono()

// GET /api/invitation/:uid - Get public invitation data
publicInvitationController.get('/:uid', async (c) => {
  const { uid } = c.req.param()
  const invitation = await invitationService.getPublicByUid(uid)
  return c.json({ success: true, data: invitation })
})

// Admin routes
export const adminInvitationController = new Hono()

// GET /api/admin/invitations - List all invitations
adminInvitationController.get('/', async (c) => {
  const invitations = await invitationService.getAll()
  return c.json({ success: true, data: invitations })
})

// GET /api/admin/invitations/:uid - Get single invitation
adminInvitationController.get('/:uid', async (c) => {
  const { uid } = c.req.param()
  const invitation = await invitationService.getByUid(uid)
  return c.json({ success: true, data: invitation })
})

// POST /api/admin/invitations - Create new invitation
adminInvitationController.post('/', async (c) => {
  const body = await c.req.json()
  const invitation = await invitationService.create(body)
  return c.json({ success: true, data: invitation }, 201)
})

// PUT /api/admin/invitations/:uid - Update invitation
adminInvitationController.put('/:uid', async (c) => {
  const { uid } = c.req.param()
  const body = await c.req.json()
  const invitation = await invitationService.update(uid, body)
  return c.json({ success: true, data: invitation })
})

// DELETE /api/admin/invitations/:uid - Delete invitation
adminInvitationController.delete('/:uid', async (c) => {
  const { uid } = c.req.param()
  await invitationService.delete(uid)
  return c.json({ success: true, message: 'Invitation deleted' })
})
