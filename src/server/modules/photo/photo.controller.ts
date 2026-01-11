import { Hono } from 'hono'
import { PhotoService } from './photo.service'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const photoService = new PhotoService()

// Upload directory path
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'photos')

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

// Generate unique filename
function generateFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = originalName.split('.').pop() || 'jpg'
  return `${timestamp}-${random}.${ext}`
}

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

// POST /api/admin/invitations/:uid/photos/upload - Upload a photo file
adminPhotoController.post('/:uid/photos/upload', async (c) => {
  const { uid } = c.req.param()

  try {
    await ensureUploadDir()

    const formData = await c.req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, 400)
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return c.json({ success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }, 400)
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return c.json({ success: false, error: 'File too large. Maximum size is 5MB.' }, 400)
    }

    // Generate unique filename and save
    const filename = generateFilename(file.name)
    const filepath = join(UPLOAD_DIR, filename)

    const arrayBuffer = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(arrayBuffer))

    // Return the URL path
    const url = `/uploads/photos/${filename}`

    return c.json({
      success: true,
      data: {
        url,
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ success: false, error: 'Failed to upload file' }, 500)
  }
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
