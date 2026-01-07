import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import {
  verifyCredentials,
  createSession,
  validateSession,
  destroySession
} from './auth.js'

// Create main app and API sub-app
const app = new Hono()
const api = new Hono()
const adminApi = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Database connection helper
// In Cloudflare Workers, use Hyperdrive binding (c.env.DB)
// In Node.js/Bun, use process.env.DATABASE_URL
let poolInstance = null

async function getDbClient(c) {
  // Check if running in Cloudflare Workers with Hyperdrive
  if (c.env?.DB) {
    return c.env.DB
  }

  // Check DATABASE_URL from Hono context env or process.env (for Node.js/Bun)
  const databaseUrl = c.env?.DATABASE_URL || globalThis.process?.env?.DATABASE_URL

  if (databaseUrl) {
    // Reuse existing pool if available
    if (poolInstance) {
      return poolInstance
    }

    try {
      const pg = await import('pg')
      const { Pool } = pg.default || pg

      poolInstance = new Pool({
        connectionString: databaseUrl,
      })

      return poolInstance
    } catch (error) {
      console.error('Failed to create database connection:', error)
      throw new Error('Database connection not available. Please configure Hyperdrive binding or DATABASE_URL.')
    }
  }

  // Throw error if no database connection is available
  throw new Error('No database connection available. Please set DATABASE_URL in .env or configure Hyperdrive binding.')
}

// API routes are defined below
// Note: Non-API routes will be handled by Cloudflare Workers Assets (serves from /dist)

// ============ Invitation API ============

// Get invitation by UID with all related data
api.get('/invitation/:uid', async (c) => {
  const { uid } = c.req.param()
  try {
    const pool = await getDbClient(c)

    // Get invitation details
    const invitationResult = await pool.query(
      'SELECT * FROM invitations WHERE uid = $1',
      [uid]
    )
    if (invitationResult.rows.length === 0) {
      return c.json({ success: false, error: 'Invitation not found' }, 404)
    }

    const invitation = invitationResult.rows[0]

    // Get agenda items
    const agendaResult = await pool.query(
      'SELECT id, title, date, start_time, end_time, location, address FROM agenda WHERE invitation_uid = $1 ORDER BY order_index, date',
      [uid]
    )

    // Get bank accounts
    const banksResult = await pool.query(
      'SELECT id, bank, account_number, account_name FROM banks WHERE invitation_uid = $1 ORDER BY order_index',
      [uid]
    )

    // Format the response to match frontend config structure
    const data = {
      title: invitation.title,
      description: invitation.description,
      groomName: invitation.groom_name,
      brideName: invitation.bride_name,
      parentGroom: invitation.parent_groom,
      parentBride: invitation.parent_bride,
      date: invitation.wedding_date,
      time: invitation.time,
      location: invitation.location,
      address: invitation.address,
      maps_url: invitation.maps_url,
      maps_embed: invitation.maps_embed,
      ogImage: invitation.og_image,
      favicon: invitation.favicon,
      audio: invitation.audio,
      agenda: agendaResult.rows.map(a => ({
        title: a.title,
        date: a.date,
        startTime: a.start_time,
        endTime: a.end_time,
        location: a.location,
        address: a.address
      })),
      banks: banksResult.rows.map(b => ({
        bank: b.bank,
        accountNumber: b.account_number,
        accountName: b.account_name
      }))
    }

    return c.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching invitation:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// ============ Wishes API ============

// Get all wishes for an invitation
api.get('/:uid/wishes', async (c) => {
  const { uid } = c.req.param()
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = parseInt(c.req.query('offset') || '0')

  try {
    const pool = await getDbClient(c)

    // Verify invitation exists
    const invitation = await pool.query(
      'SELECT uid FROM invitations WHERE uid = $1',
      [uid]
    )
    if (invitation.rows.length === 0) {
      return c.json({ success: false, error: 'Invitation not found' }, 404)
    }

    // Get wishes
    const result = await pool.query(
      `SELECT id, name, message, attendance,
              created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' as created_at
       FROM wishes
       WHERE invitation_uid = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [uid, limit, offset]
    )

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM wishes WHERE invitation_uid = $1',
      [uid]
    )

    return c.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit,
        offset
      }
    })
  } catch (error) {
    console.error('Error fetching wishes:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// Create a new wish
api.post('/:uid/wishes', async (c) => {
  const { uid } = c.req.param()

  try {
    const pool = await getDbClient(c)
    const body = await c.req.json()
    const { name, message, attendance } = body

    // Validation
    if (!name?.trim() || !message?.trim()) {
      return c.json({ success: false, error: 'Name and message are required' }, 400)
    }

    const validAttendance = ['ATTENDING', 'NOT_ATTENDING', 'MAYBE']
    const attendanceValue = validAttendance.includes(attendance) ? attendance : 'MAYBE'

    // Verify invitation exists
    const invitation = await pool.query(
      'SELECT uid FROM invitations WHERE uid = $1',
      [uid]
    )
    if (invitation.rows.length === 0) {
      return c.json({ success: false, error: 'Invitation not found' }, 404)
    }

    // Insert wish
    const result = await pool.query(
      `INSERT INTO wishes (invitation_uid, name, message, attendance, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')
       RETURNING id, name, message, attendance,
                 created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' as created_at`,
      [uid, name.trim(), message.trim(), attendanceValue]
    )

    return c.json({ success: true, data: result.rows[0] }, 201)
  } catch (error) {
    console.error('Error creating wish:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// Delete a wish (optional - for admin)
api.delete('/:uid/wishes/:id', async (c) => {
  const { uid, id } = c.req.param()

  try {
    const pool = await getDbClient(c)
    const result = await pool.query(
      'DELETE FROM wishes WHERE id = $1 AND invitation_uid = $2 RETURNING id',
      [id, uid]
    )

    if (result.rows.length === 0) {
      return c.json({ success: false, error: 'Wish not found' }, 404)
    }

    return c.json({ success: true, message: 'Wish deleted' })
  } catch (error) {
    console.error('Error deleting wish:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// Get attendance stats
api.get('/:uid/stats', async (c) => {
  const { uid } = c.req.param()

  try {
    const pool = await getDbClient(c)
    const result = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE attendance = 'ATTENDING') as attending,
        COUNT(*) FILTER (WHERE attendance = 'NOT_ATTENDING') as not_attending,
        COUNT(*) FILTER (WHERE attendance = 'MAYBE') as maybe,
        COUNT(*) as total
       FROM wishes
       WHERE invitation_uid = $1`,
      [uid]
    )

    return c.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// ============ Admin API ============

// Auth middleware for admin routes
adminApi.use('*', async (c, next) => {
  // Skip auth for login endpoint
  if (c.req.path === '/api/admin/login') {
    return next()
  }

  const authHeader = c.req.header('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!validateSession(token)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  return next()
})

// Admin login
adminApi.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json()

    if (!verifyCredentials(username, password)) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401)
    }

    const token = createSession(username)
    return c.json({ success: true, token })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ success: false, error: 'Login failed' }, 500)
  }
})

// Admin logout
adminApi.post('/logout', async (c) => {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (token) {
    destroySession(token)
  }

  return c.json({ success: true, message: 'Logged out' })
})

// Verify token
adminApi.get('/verify', async (c) => {
  return c.json({ success: true, message: 'Token valid' })
})

// Get all invitations (admin)
adminApi.get('/invitations', async (c) => {
  try {
    const pool = await getDbClient(c)
    const result = await pool.query(
      `SELECT id, uid, title, groom_name, bride_name, wedding_date, created_at
       FROM invitations
       ORDER BY created_at DESC`
    )

    return c.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error fetching invitations:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// Get single invitation with full details (admin)
adminApi.get('/invitations/:uid', async (c) => {
  const { uid } = c.req.param()

  try {
    const pool = await getDbClient(c)

    // Get invitation
    const invitationResult = await pool.query(
      'SELECT * FROM invitations WHERE uid = $1',
      [uid]
    )

    if (invitationResult.rows.length === 0) {
      return c.json({ success: false, error: 'Invitation not found' }, 404)
    }

    const invitation = invitationResult.rows[0]

    // Get agenda
    const agendaResult = await pool.query(
      'SELECT * FROM agenda WHERE invitation_uid = $1 ORDER BY order_index',
      [uid]
    )

    // Get banks
    const banksResult = await pool.query(
      'SELECT * FROM banks WHERE invitation_uid = $1 ORDER BY order_index',
      [uid]
    )

    return c.json({
      success: true,
      data: {
        ...invitation,
        agenda: agendaResult.rows,
        banks: banksResult.rows
      }
    })
  } catch (error) {
    console.error('Error fetching invitation:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// Create invitation (admin)
adminApi.post('/invitations', async (c) => {
  try {
    const pool = await getDbClient(c)
    const body = await c.req.json()

    const {
      uid,
      title,
      description,
      groom_name,
      bride_name,
      parent_groom,
      parent_bride,
      wedding_date,
      time,
      location,
      address,
      maps_url,
      maps_embed,
      og_image,
      favicon,
      audio,
      theme,
      agenda = [],
      banks = []
    } = body

    // Validate required fields
    if (!uid || !groom_name || !bride_name || !wedding_date) {
      return c.json({
        success: false,
        error: 'UID, groom name, bride name, and wedding date are required'
      }, 400)
    }

    // Check if UID already exists
    const existing = await pool.query(
      'SELECT uid FROM invitations WHERE uid = $1',
      [uid]
    )

    if (existing.rows.length > 0) {
      return c.json({ success: false, error: 'UID already exists' }, 400)
    }

    // Insert invitation
    const result = await pool.query(
      `INSERT INTO invitations (
        uid, title, description, groom_name, bride_name,
        parent_groom, parent_bride, wedding_date, time,
        location, address, maps_url, maps_embed,
        og_image, favicon, audio, theme
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        uid, title, description, groom_name, bride_name,
        parent_groom, parent_bride, wedding_date, time,
        location, address, maps_url, maps_embed,
        og_image, favicon, JSON.stringify(audio), theme
      ]
    )

    // Insert agenda items
    for (let i = 0; i < agenda.length; i++) {
      const a = agenda[i]
      await pool.query(
        `INSERT INTO agenda (invitation_uid, title, date, start_time, end_time, location, address, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [uid, a.title, a.date, a.start_time, a.end_time, a.location, a.address, i]
      )
    }

    // Insert bank accounts
    for (let i = 0; i < banks.length; i++) {
      const b = banks[i]
      await pool.query(
        `INSERT INTO banks (invitation_uid, bank, account_number, account_name, order_index)
         VALUES ($1, $2, $3, $4, $5)`,
        [uid, b.bank, b.account_number, b.account_name, i]
      )
    }

    return c.json({ success: true, data: result.rows[0] }, 201)
  } catch (error) {
    console.error('Error creating invitation:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// Update invitation (admin)
adminApi.put('/invitations/:uid', async (c) => {
  const { uid } = c.req.param()

  try {
    const pool = await getDbClient(c)
    const body = await c.req.json()

    const {
      title,
      description,
      groom_name,
      bride_name,
      parent_groom,
      parent_bride,
      wedding_date,
      time,
      location,
      address,
      maps_url,
      maps_embed,
      og_image,
      favicon,
      audio,
      theme,
      agenda = [],
      banks = []
    } = body

    // Update invitation
    const result = await pool.query(
      `UPDATE invitations SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        groom_name = COALESCE($3, groom_name),
        bride_name = COALESCE($4, bride_name),
        parent_groom = COALESCE($5, parent_groom),
        parent_bride = COALESCE($6, parent_bride),
        wedding_date = COALESCE($7, wedding_date),
        time = COALESCE($8, time),
        location = COALESCE($9, location),
        address = COALESCE($10, address),
        maps_url = COALESCE($11, maps_url),
        maps_embed = COALESCE($12, maps_embed),
        og_image = COALESCE($13, og_image),
        favicon = COALESCE($14, favicon),
        audio = COALESCE($15, audio),
        theme = COALESCE($16, theme),
        updated_at = CURRENT_TIMESTAMP
      WHERE uid = $17
      RETURNING *`,
      [
        title, description, groom_name, bride_name,
        parent_groom, parent_bride, wedding_date, time,
        location, address, maps_url, maps_embed,
        og_image, favicon, audio ? JSON.stringify(audio) : null, theme,
        uid
      ]
    )

    if (result.rows.length === 0) {
      return c.json({ success: false, error: 'Invitation not found' }, 404)
    }

    // Update agenda - delete existing and re-insert
    if (agenda.length > 0) {
      await pool.query('DELETE FROM agenda WHERE invitation_uid = $1', [uid])
      for (let i = 0; i < agenda.length; i++) {
        const a = agenda[i]
        await pool.query(
          `INSERT INTO agenda (invitation_uid, title, date, start_time, end_time, location, address, order_index)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [uid, a.title, a.date, a.start_time, a.end_time, a.location, a.address, i]
        )
      }
    }

    // Update banks - delete existing and re-insert
    if (banks.length > 0) {
      await pool.query('DELETE FROM banks WHERE invitation_uid = $1', [uid])
      for (let i = 0; i < banks.length; i++) {
        const b = banks[i]
        await pool.query(
          `INSERT INTO banks (invitation_uid, bank, account_number, account_name, order_index)
           VALUES ($1, $2, $3, $4, $5)`,
          [uid, b.bank, b.account_number, b.account_name, i]
        )
      }
    }

    return c.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error updating invitation:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// Delete invitation (admin)
adminApi.delete('/invitations/:uid', async (c) => {
  const { uid } = c.req.param()

  try {
    const pool = await getDbClient(c)

    // Delete related data first
    await pool.query('DELETE FROM wishes WHERE invitation_uid = $1', [uid])
    await pool.query('DELETE FROM agenda WHERE invitation_uid = $1', [uid])
    await pool.query('DELETE FROM banks WHERE invitation_uid = $1', [uid])

    // Delete invitation
    const result = await pool.query(
      'DELETE FROM invitations WHERE uid = $1 RETURNING uid',
      [uid]
    )

    if (result.rows.length === 0) {
      return c.json({ success: false, error: 'Invitation not found' }, 404)
    }

    return c.json({ success: true, message: 'Invitation deleted' })
  } catch (error) {
    console.error('Error deleting invitation:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// Get available themes
adminApi.get('/themes', async (c) => {
  // For now, return hardcoded themes - later can be made dynamic
  const themes = [
    { id: 'default', name: 'Default Rose', preview: '/themes/default/preview.jpg' },
    { id: 'elegant', name: 'Elegant Gold', preview: '/themes/elegant/preview.jpg' },
    { id: 'rustic', name: 'Rustic Green', preview: '/themes/rustic/preview.jpg' },
    { id: 'modern', name: 'Modern Minimal', preview: '/themes/modern/preview.jpg' }
  ]

  return c.json({ success: true, data: themes })
})

// Mount API routes under /api prefix
app.route('/api', api)
app.route('/api/admin', adminApi)

// Export for Cloudflare Workers
export default app
