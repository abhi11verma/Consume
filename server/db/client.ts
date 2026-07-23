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

export async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return

  const [existing] = await sql`SELECT id FROM users WHERE role = 'admin' LIMIT 1`
  if (existing) return

  const hash = await bcrypt.hash(password, 12)
  await sql`
    INSERT INTO users (email, password_hash, role)
    VALUES (${email}, ${hash}, 'admin')
    ON CONFLICT (email) DO NOTHING
  `
  console.log(`Admin user seeded: ${email}`)
}
