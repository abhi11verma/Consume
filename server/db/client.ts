import postgres from 'postgres'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import bcrypt from 'bcryptjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

export const sql = postgres(process.env.DATABASE_URL, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
})

export async function runMigrations() {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
  await sql.unsafe(schema)
}

const DEFAULT_CATEGORIES = [
  { slug: 'video',   label: 'Video',   pluralLabel: 'Videos',   iconName: 'Video',    accentColor: '#ef4444', tileVariant: 'landscape', order: 0 },
  { slug: 'book',    label: 'Book',    pluralLabel: 'Books',    iconName: 'BookOpen', accentColor: '#0d9488', tileVariant: 'portrait',  order: 1 },
  { slug: 'article', label: 'Article', pluralLabel: 'Articles', iconName: 'FileText', accentColor: '#3b82f6', tileVariant: 'landscape', order: 2 },
  { slug: 'podcast', label: 'Podcast', pluralLabel: 'Podcasts', iconName: 'Mic2',     accentColor: '#8b5cf6', tileVariant: 'landscape', order: 3 },
]

export async function seedDefaultCategories(userId: string) {
  for (const cat of DEFAULT_CATEGORIES) {
    await sql`
      INSERT INTO categories (slug, user_id, label, plural_label, icon_name, accent_color, tile_variant, built_in, "order")
      VALUES (${cat.slug}, ${userId}, ${cat.label}, ${cat.pluralLabel}, ${cat.iconName}, ${cat.accentColor}, ${cat.tileVariant}, true, ${cat.order})
      ON CONFLICT (slug, user_id) DO NOTHING
    `
  }
}

export async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return

  // Always upsert so that changing ADMIN_PASSWORD and restarting takes effect
  const hash = await bcrypt.hash(password, 12)
  await sql`
    INSERT INTO users (email, password_hash, role)
    VALUES (${email}, ${hash}, 'admin')
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'
  `
  console.log(`Admin user synced: ${email}`)
}
