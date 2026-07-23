import { Hono } from 'hono'
import { join } from 'path'
import { unlink } from 'fs/promises'
import bcrypt from 'bcryptjs'
import { sql } from '../db/client.js'
import { requireAdmin } from '../middleware/auth.js'

const router = new Hono()

function imagesDir() {
  return process.env.IMAGES_DIR ?? '/data/images'
}

router.use('/*', requireAdmin)

// GET /api/admin/users
router.get('/users', async (c) => {
  const rows = await sql`
    SELECT u.id, u.email, u.role, u.created_at,
           COUNT(i.id)::int AS item_count
    FROM users u
    LEFT JOIN items i ON i.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at ASC
  `
  return c.json(
    rows.map((r) => ({
      id: r.id,
      email: r.email,
      role: r.role,
      createdAt: r.created_at,
      itemCount: r.item_count,
    })),
  )
})

// POST /api/admin/users
router.post('/users', async (c) => {
  const body = await c.req.json<{ email: string; password: string; role?: string }>()
  if (!body.email || !body.password) {
    return c.json({ error: 'email and password are required' }, 400)
  }
  const role = body.role === 'admin' ? 'admin' : 'user'
  const hash = await bcrypt.hash(body.password, 12)

  try {
    const [row] = await sql`
      INSERT INTO users (email, password_hash, role)
      VALUES (${body.email.toLowerCase().trim()}, ${hash}, ${role})
      RETURNING id, email, role, created_at
    `
    return c.json({ id: row.id, email: row.email, role: row.role, createdAt: row.created_at }, 201)
  } catch (err: unknown) {
    const e = err as { code?: string }
    if (e.code === '23505') return c.json({ error: 'Email already exists' }, 409)
    throw err
  }
})

// PUT /api/admin/users/:id
router.put('/users/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json<{ role?: string; password?: string }>()

  if (body.role && body.role !== 'admin' && body.role !== 'user') {
    return c.json({ error: 'role must be admin or user' }, 400)
  }

  let passwordHash: string | undefined
  if (body.password) {
    passwordHash = await bcrypt.hash(body.password, 12)
  }

  const updates: string[] = []
  if (body.role) updates.push(`role = '${body.role}'`)
  if (passwordHash) updates.push(`password_hash = '${passwordHash}'`)
  if (updates.length === 0) return c.json({ error: 'Nothing to update' }, 400)

  const [row] = await sql`
    UPDATE users SET
      role          = COALESCE(${body.role ?? null}, role),
      password_hash = COALESCE(${passwordHash ?? null}, password_hash)
    WHERE id = ${id}
    RETURNING id, email, role, created_at
  `
  if (!row) return c.json({ error: 'User not found' }, 404)
  return c.json({ id: row.id, email: row.email, role: row.role, createdAt: row.created_at })
})

// DELETE /api/admin/users/:id — deletes user + all items (cascade) + image files
router.delete('/users/:id', async (c) => {
  const { id } = c.req.param()
  const auth = c.get('auth')
  if (auth.userId === id) return c.json({ error: 'Cannot delete your own account' }, 400)

  // Collect image files before cascade delete
  const imageRows = await sql`
    SELECT thumbnail FROM items WHERE user_id = ${id} AND thumbnail LIKE '/images/%'
  `

  await sql`DELETE FROM users WHERE id = ${id}`

  // Best-effort file cleanup
  for (const row of imageRows) {
    const filename = (row.thumbnail as string).replace(/^\/images\//, '')
    unlink(join(imagesDir(), filename)).catch(() => {})
  }

  return c.json({ ok: true })
})

// DELETE /api/admin/users/:id/items — purge all items for a user (keep account)
router.delete('/users/:id/items', async (c) => {
  const { id } = c.req.param()

  const imageRows = await sql`
    SELECT thumbnail FROM items WHERE user_id = ${id} AND thumbnail LIKE '/images/%'
  `

  await sql`DELETE FROM items WHERE user_id = ${id}`

  for (const row of imageRows) {
    const filename = (row.thumbnail as string).replace(/^\/images\//, '')
    unlink(join(imagesDir(), filename)).catch(() => {})
  }

  return c.json({ ok: true })
})

export default router
