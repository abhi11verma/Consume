import { Hono } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { sql } from '../db/client.js'
import { requireAuth } from '../middleware/auth.js'

const router = new Hono()

function getSecret() {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET is required')
  return new TextEncoder().encode(s)
}

async function makeToken(userId: string, role: string) {
  return new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(getSecret())
}

router.post('/login', async (c) => {
  const body = await c.req.json<{ email: string; password: string }>()
  if (!body.email || !body.password) {
    return c.json({ error: 'Email and password are required' }, 400)
  }

  const [user] = await sql`
    SELECT id, email, password_hash, role FROM users WHERE email = ${body.email.toLowerCase().trim()}
  `
  if (!user) return c.json({ error: 'Invalid credentials' }, 401)

  const valid = await bcrypt.compare(body.password, user.password_hash)
  if (!valid) return c.json({ error: 'Invalid credentials' }, 401)

  const token = await makeToken(user.id, user.role)
  setCookie(c, 'session', token, {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
  })

  return c.json({ id: user.id, email: user.email, role: user.role })
})

router.post('/logout', (c) => {
  deleteCookie(c, 'session', { path: '/' })
  return c.json({ ok: true })
})

router.get('/me', requireAuth, (c) => {
  const auth = c.get('auth')
  return c.json(auth)
})

export default router
