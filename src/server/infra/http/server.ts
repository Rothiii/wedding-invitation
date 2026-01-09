import { serve } from '@hono/node-server'
import { createApp } from './routes'

const app = createApp()
const port = parseInt(process.env.PORT || '3001')

console.log(`Server starting on port ${port}...`)

serve({
  fetch: app.fetch,
  port,
})

console.log(`Server is running on http://localhost:${port}`)

export default app
