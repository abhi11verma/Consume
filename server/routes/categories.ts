import { Hono } from 'hono'
import { sql } from '../db/client.js'
import { requireAuth } from '../middleware/auth.js'

const router = new Hono()

router.use('/*', requireAuth)

function rowToCamel(row: Record<string, unknown>) {
  return {
    slug:        row.slug,
    label:       row.label,
    pluralLabel: row.plural_label,
    iconName:    row.icon_name,
    accentColor: row.accent_color,
    tileVariant: row.tile_variant,
    builtIn:     row.built_in,
    order:       row.order,
  }
}

router.get('/', async (c) => {
  const { userId } = c.get('auth')
  const rows = await sql`
    SELECT slug, label, plural_label, icon_name, accent_color, tile_variant, built_in, "order"
    FROM categories
    WHERE user_id = ${userId}
    ORDER BY "order" ASC
  `
  return c.json(rows.map(rowToCamel))
})

router.post('/', async (c) => {
  const { userId } = c.get('auth')
  const body = await c.req.json<{
    slug: string
    label: string
    pluralLabel: string
    iconName: string
    accentColor: string
    tileVariant: string
    order: number
  }>()

  if (!body.slug || !body.label || !body.pluralLabel || !body.iconName || !body.accentColor) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const [row] = await sql`
    INSERT INTO categories (slug, user_id, label, plural_label, icon_name, accent_color, tile_variant, built_in, "order")
    VALUES (
      ${body.slug}, ${userId}, ${body.label}, ${body.pluralLabel},
      ${body.iconName}, ${body.accentColor}, ${body.tileVariant ?? 'landscape'},
      false, ${body.order ?? 99}
    )
    ON CONFLICT (slug, user_id) DO NOTHING
    RETURNING slug, label, plural_label, icon_name, accent_color, tile_variant, built_in, "order"
  `
  if (!row) return c.json({ error: 'Category with this slug already exists' }, 409)
  return c.json(rowToCamel(row), 201)
})

router.delete('/:slug', async (c) => {
  const { userId } = c.get('auth')
  const { slug } = c.req.param()

  const [row] = await sql`
    DELETE FROM categories
    WHERE slug = ${slug} AND user_id = ${userId} AND built_in = false
    RETURNING slug
  `
  if (!row) return c.json({ error: 'Not found or cannot delete built-in category' }, 404)
  return c.json({ ok: true })
})

export default router
