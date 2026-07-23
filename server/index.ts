import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { logger } from 'hono/logger'
import { createReadStream } from 'fs'
import { join } from 'path'
import { runMigrations, seedAdminUser } from './db/client.js'
import authRouter from './routes/auth.js'
import itemsRouter from './routes/items.js'
import metadataRouter from './routes/metadata.js'
import adminRouter from './routes/admin.js'

const app = new Hono()

app.use('*', logger())

// Serve uploaded images from the volume
app.get('/images/:filename', (c) => {
  const { filename } = c.req.param()
  // Prevent path traversal
  if (filename.includes('/') || filename.includes('..')) {
    return c.json({ error: 'Not found' }, 404)
  }
  const imagesDir = process.env.IMAGES_DIR ?? '/data/images'
  const filePath = join(imagesDir, filename)
  const stream = createReadStream(filePath)
  stream.on('error', () => {})
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
  }
  const mime = mimeMap[ext] ?? 'application/octet-stream'
  return new Response(stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
})

// API routes
app.route('/api/auth', authRouter)
app.route('/api/items', itemsRouter)
app.route('/api/metadata', metadataRouter)
app.route('/api/admin', adminRouter)

// Serve React SPA — static assets first, then fallback to index.html for client-side routing
app.use('/*', serveStatic({ root: './public' }))
app.get('/*', serveStatic({ path: './public/index.html' }))

async function main() {
  await runMigrations()
  await seedAdminUser()

  const port = Number(process.env.PORT ?? 3000)
  console.log(`Consume server running on port ${port}`)

  serve({ fetch: app.fetch, port })
}

main().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
