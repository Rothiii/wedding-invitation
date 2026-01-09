import { Hono } from 'hono'
import { SiteService } from './site.service'

const siteService = new SiteService()

// Public routes - for landing page
export const publicSiteController = new Hono()

// GET /api/site/settings - Get all public settings
publicSiteController.get('/settings', async (c) => {
  const settings = await siteService.getAllSettings()
  return c.json({ success: true, data: settings })
})

// GET /api/site/settings/:key - Get specific setting
publicSiteController.get('/settings/:key', async (c) => {
  const { key } = c.req.param()
  const value = await siteService.getSetting(key)
  return c.json({ success: true, data: { key, value } })
})

// GET /api/site/testimonials - Get active testimonials
publicSiteController.get('/testimonials', async (c) => {
  const testimonials = await siteService.getTestimonials(true) // activeOnly
  return c.json({ success: true, data: testimonials })
})

// GET /api/site/packages - Get active packages
publicSiteController.get('/packages', async (c) => {
  const packages = await siteService.getPackages(true) // activeOnly
  return c.json({ success: true, data: packages })
})

// Admin routes
export const adminSiteController = new Hono()

// GET /api/admin/site/settings - Get all settings
adminSiteController.get('/settings', async (c) => {
  const settings = await siteService.getAllSettings()
  return c.json({ success: true, data: settings })
})

// PUT /api/admin/site/settings/:key - Update single setting
adminSiteController.put('/settings/:key', async (c) => {
  const { key } = c.req.param()
  const body = await c.req.json()
  const setting = await siteService.setSetting(key, body.value)
  return c.json({ success: true, data: setting })
})

// PUT /api/admin/site/settings - Update multiple settings
adminSiteController.put('/settings', async (c) => {
  const body = await c.req.json()
  const settings = await siteService.setMultipleSettings(body)
  return c.json({ success: true, data: settings })
})

// DELETE /api/admin/site/settings/:key - Delete setting
adminSiteController.delete('/settings/:key', async (c) => {
  const { key } = c.req.param()
  await siteService.deleteSetting(key)
  return c.json({ success: true, message: 'Setting deleted' })
})

// Testimonials CRUD
// GET /api/admin/site/testimonials - Get all testimonials
adminSiteController.get('/testimonials', async (c) => {
  const testimonials = await siteService.getTestimonials(false)
  return c.json({ success: true, data: testimonials })
})

// POST /api/admin/site/testimonials - Create testimonial
adminSiteController.post('/testimonials', async (c) => {
  const body = await c.req.json()
  const testimonial = await siteService.createTestimonial(body)
  return c.json({ success: true, data: testimonial }, 201)
})

// PUT /api/admin/site/testimonials/:id - Update testimonial
adminSiteController.put('/testimonials/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const body = await c.req.json()
  const testimonial = await siteService.updateTestimonial(id, body)
  return c.json({ success: true, data: testimonial })
})

// DELETE /api/admin/site/testimonials/:id - Delete testimonial
adminSiteController.delete('/testimonials/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await siteService.deleteTestimonial(id)
  return c.json({ success: true, message: 'Testimonial deleted' })
})

// Packages CRUD
// GET /api/admin/site/packages - Get all packages
adminSiteController.get('/packages', async (c) => {
  const packages = await siteService.getPackages(false)
  return c.json({ success: true, data: packages })
})

// POST /api/admin/site/packages - Create package
adminSiteController.post('/packages', async (c) => {
  const body = await c.req.json()
  const pkg = await siteService.createPackage(body)
  return c.json({ success: true, data: pkg }, 201)
})

// PUT /api/admin/site/packages/:id - Update package
adminSiteController.put('/packages/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const body = await c.req.json()
  const pkg = await siteService.updatePackage(id, body)
  return c.json({ success: true, data: pkg })
})

// DELETE /api/admin/site/packages/:id - Delete package
adminSiteController.delete('/packages/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await siteService.deletePackage(id)
  return c.json({ success: true, message: 'Package deleted' })
})
