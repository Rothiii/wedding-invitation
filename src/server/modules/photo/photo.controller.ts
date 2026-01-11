import { Hono } from 'hono'
import { PhotoService } from './photo.service'

const photoService = new PhotoService()

// Public routes
export const publicPhotoController = new Hono()

// GET /api/:uid/photos - Get all photos for an invitation
publicPhotoController.get('/:uid/photos', async (c) => {
  const { uid } = c.req.param()
  const photos = await photoService.getByInvitationUid(uid)
  return c.json({ success: true, data: photos })
})

// Admin routes
export const adminPhotoController = new Hono()

// GET /api/admin/invitations/:uid/photos - Get photos for admin
adminPhotoController.get('/:uid/photos', async (c) => {
  const { uid } = c.req.param()
  const photos = await photoService.getByInvitationUid(uid)
  return c.json({ success: true, data: photos })
})

// POST /api/admin/invitations/:uid/photos - Add a photo
adminPhotoController.post('/:uid/photos', async (c) => {
  const { uid } = c.req.param()
  const body = await c.req.json()
  const photo = await photoService.create(uid, body)
  return c.json({ success: true, data: photo }, 201)
})

// POST /api/admin/invitations/:uid/photos/batch - Replace all photos
adminPhotoController.post('/:uid/photos/batch', async (c) => {
  const { uid } = c.req.param()
  const body = await c.req.json()
  const photos = await photoService.replaceAll(uid, body.photos || [])
  return c.json({ success: true, data: photos })
})

// PUT /api/admin/photos/:id - Update a photo
adminPhotoController.put('/photos/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const body = await c.req.json()
  const photo = await photoService.update(id, body)
  return c.json({ success: true, data: photo })
})

// DELETE /api/admin/photos/:id - Delete a photo
adminPhotoController.delete('/photos/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await photoService.delete(id)
  return c.json({ success: true, message: 'Photo deleted' })
})
