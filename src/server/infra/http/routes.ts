import { Hono } from 'hono'
import {
  errorMiddleware,
  authMiddleware,
  corsMiddleware,
} from './middlewares'

// Import controllers
import {
  publicInvitationController,
  adminInvitationController,
} from '../../modules/invitation'
import {
  publicGuestController,
  adminGuestController,
} from '../../modules/guest'
import { publicWishController, adminWishController } from '../../modules/wish'
import { publicPhotoController, adminPhotoController } from '../../modules/photo'
import { authController } from '../../modules/auth'
import { publicSiteController, adminSiteController } from '../../modules/site'

export function createApp() {
  const app = new Hono()

  // Global middlewares
  app.use('*', corsMiddleware)
  app.use('*', errorMiddleware)

  // Health check
  app.get('/api/health', (c) => {
    return c.json({ success: true, message: 'Server is healthy' })
  })

  // ==================
  // PUBLIC ROUTES
  // ==================

  // Invitation (public view)
  app.route('/api/invitation', publicInvitationController)

  // Guest validation (for private links)
  app.route('/api/guest', publicGuestController)

  // Wishes (public can view and create)
  app.route('/api', publicWishController)

  // Photos (public can view)
  app.route('/api', publicPhotoController)

  // Site content (landing page data)
  app.route('/api/site', publicSiteController)

  // ==================
  // ADMIN ROUTES
  // ==================

  // Auth routes (login/logout don't need auth)
  app.route('/api/admin/auth', authController)

  // Protected admin routes
  const admin = new Hono()
  admin.use('*', authMiddleware)

  // Invitations management
  admin.route('/invitations', adminInvitationController)

  // Guest management (nested under invitations)
  admin.route('/invitations', adminGuestController)

  // Wishes management (nested under invitations)
  admin.route('/invitations', adminWishController)

  // Photos management (nested under invitations)
  admin.route('/invitations', adminPhotoController)

  // Site content management
  admin.route('/site', adminSiteController)

  // Themes endpoint (static list for now)
  admin.get('/themes', (c) => {
    const themes = [
      { id: 'elegant-rose', name: 'Elegant Rose', preview: '/themes/elegant-rose/preview.jpg' },
      { id: 'ocean-blue', name: 'Ocean Blue', preview: '/themes/ocean-blue/preview.jpg' },
      { id: 'golden-luxury', name: 'Golden Luxury', preview: '/themes/golden-luxury/preview.jpg' },
      { id: 'rustic-garden', name: 'Rustic Garden', preview: '/themes/rustic-garden/preview.jpg' },
      { id: 'modern-minimal', name: 'Modern Minimal', preview: '/themes/modern-minimal/preview.jpg' },
    ]
    return c.json({ success: true, data: themes })
  })

  // Single guest/wish/photo operations (not nested)
  admin.route('/', adminGuestController)
  admin.route('/', adminWishController)
  admin.route('/', adminPhotoController)

  // Mount admin routes
  app.route('/api/admin', admin)

  // 404 handler
  app.notFound((c) => {
    return c.json({ success: false, error: 'Not found' }, 404)
  })

  return app
}
