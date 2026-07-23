import { Hono } from 'hono'
import { writeFile, unlink } from 'fs/promises'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'
import { sql } from '../db/client.js'
import { requireAuth } from '../middleware/auth.js'

const router = new Hono()

function imagesDir() {
  return process.env.IMAGES_DIR ?? '/data/images'
}

function snakeToCamel(row: Record<string, unknown>) {
  return {
    id: row.id,
    type: row.type,
    url: row.url,
    title: row.title,
    thumbnail: row.thumbnail,
    description: row.description,
    domain: row.domain,
    author: row.author,
    dateAdded: row.date_added,
    tags: row.tags ?? [],
  }
}

router.use('/*', requireAuth)

router.get('/', async (c) => {
  const { userId } = c.get('auth')
  const rows = await sql`
    SELECT id, type, url, title, thumbnail, description, domain, author, date_added, tags
    FROM items WHERE user_id = ${userId} ORDER BY date_added DESC
  `
  return c.json(rows.map(snakeToCamel))
})

router.post('/', async (c) => {
  const { userId } = c.get('auth')
  const body = await c.req.json<{
    id: string
    type: string
    url: string
    title: string
    thumbnail?: string | null
    description?: string | null
    domain: string
    author?: string | null
    dateAdded: string
    tags?: string[]
  }>()

  if (!body.id || !body.url || !body.title || !body.type || !body.domain) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const [row] = await sql`
    INSERT INTO items (id, user_id, type, url, title, thumbnail, description, domain, author, date_added, tags)
    VALUES (
      ${body.id}, ${userId}, ${body.type}, ${body.url}, ${body.title},
      ${body.thumbnail ?? null}, ${body.description ?? null}, ${body.domain},
      ${body.author ?? null}, ${body.dateAdded}, ${body.tags ?? []}
    )
    ON CONFLICT (user_id, url) DO NOTHING
    RETURNING id, type, url, title, thumbnail, description, domain, author, date_added, tags
  `
  if (!row) return c.json({ error: 'Item with this URL already exists' }, 409)
  return c.json(snakeToCamel(row), 201)
})

router.put('/:id', async (c) => {
  const { userId } = c.get('auth')
  const { id } = c.req.param()
  const body = await c.req.json<Partial<{
    title: string
    thumbnail: string | null
    description: string | null
    author: string | null
    tags: string[]
  }>>()

  const [row] = await sql`
    UPDATE items SET
      title       = COALESCE(${body.title ?? null}, title),
      thumbnail   = CASE WHEN ${Object.hasOwn(body, 'thumbnail')} THEN ${body.thumbnail ?? null} ELSE thumbnail END,
      description = CASE WHEN ${Object.hasOwn(body, 'description')} THEN ${body.description ?? null} ELSE description END,
      author      = CASE WHEN ${Object.hasOwn(body, 'author')} THEN ${body.author ?? null} ELSE author END,
      tags        = COALESCE(${body.tags ?? null}::text[], tags)
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING id, type, url, title, thumbnail, description, domain, author, date_added, tags
  `
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(snakeToCamel(row))
})

router.delete('/:id', async (c) => {
  const { userId } = c.get('auth')
  const { id } = c.req.param()

  const [row] = await sql`
    DELETE FROM items WHERE id = ${id} AND user_id = ${userId}
    RETURNING thumbnail
  `
  if (!row) return c.json({ error: 'Not found' }, 404)

  // Delete local image file if stored on the volume
  const thumb = row.thumbnail as string | null
  if (thumb?.startsWith('/images/')) {
    const filename = thumb.replace(/^\/images\//, '')
    unlink(join(imagesDir(), filename)).catch(() => {/* ignore if already gone */})
  }

  return c.json({ ok: true })
})

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/avif': '.avif',
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024 // 8 MB

router.post('/:id/image', async (c) => {
  const { userId } = c.get('auth')
  const { id } = c.req.param()

  // Verify ownership
  const [item] = await sql`SELECT id, thumbnail FROM items WHERE id = ${id} AND user_id = ${userId}`
  if (!item) return c.json({ error: 'Not found' }, 404)

  const formData = await c.req.formData()
  const file = formData.get('image')
  if (!(file instanceof File)) return c.json({ error: 'image field is required' }, 400)

  const ext = ALLOWED_IMAGE_TYPES[file.type]
  if (!ext) return c.json({ error: 'Unsupported image type' }, 415)
  if (file.size > MAX_IMAGE_BYTES) return c.json({ error: 'Image too large (max 8 MB)' }, 413)

  const filename = `${randomUUID()}${ext}`
  const bytes = await file.arrayBuffer()
  await writeFile(join(imagesDir(), filename), Buffer.from(bytes))

  // Remove old local image if it existed
  const oldThumb = item.thumbnail as string | null
  if (oldThumb?.startsWith('/images/')) {
    const oldFile = oldThumb.replace(/^\/images\//, '')
    unlink(join(imagesDir(), oldFile)).catch(() => {})
  }

  const thumbnail = `/images/${filename}`
  await sql`UPDATE items SET thumbnail = ${thumbnail} WHERE id = ${id}`

  return c.json({ thumbnail })
})

export default router
