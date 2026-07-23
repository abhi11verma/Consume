import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { jwtVerify } from 'jose'

export interface AuthPayload {
  userId: string
  role: 'admin' | 'user'
}

declare module 'hono' {
  interface ContextVariableMap {
    auth: AuthPayload
  }
}

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is required')
  return new TextEncoder().encode(secret)
}

async function verifyToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, getSecret())
  return payload as unknown as AuthPayload
}

export async function requireAuth(c: Context, next: Next) {
  const token = getCookie(c, 'session')
  if (!token) return c.json({ error: 'Unauthorized' }, 401)

  try {
    c.set('auth', await verifyToken(token))
    await next()
  } catch {
    return c.json({ error: 'Unauthorized' }, 401)
  }
}

export async function requireAdmin(c: Context, next: Next) {
  const token = getCookie(c, 'session')
  if (!token) return c.json({ error: 'Unauthorized' }, 401)

  try {
    const auth = await verifyToken(token)
    if (auth.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
    c.set('auth', auth)
    await next()
  } catch {
    return c.json({ error: 'Unauthorized' }, 401)
  }
}
