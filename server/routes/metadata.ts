import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'

const router = new Hono()

interface YouTubeOEmbed {
  title: string
  thumbnail_url: string
  author_name: string
}

interface SubstackPost {
  title?: string
  subtitle?: string
  cover_image?: string | null
  description?: string
  byline?: string
}

interface FetchedMetadata {
  title: string
  thumbnail: string | null
  description: string | null
  author: string | null
  detectedType: string
}

function detectContentType(url: string): string {
  const lower = url.toLowerCase()
  if (/youtube\.com|youtu\.be/.test(lower)) return 'video'
  if (/amazon\.(com|co\.|in)/.test(lower) && /\/dp\/|\/gp\/product\//.test(lower)) return 'book'
  if (/\.substack\.com/.test(lower)) return 'article'
  if (/podcast|\.fm\/|\.audio\/|spotify\.com\/episode|overcast\.fm/.test(lower)) return 'podcast'
  if (/reddit\.com|hn\.algolia|news\.ycombinator/.test(lower)) return 'article'
  return 'article'
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

async function fetchYouTubeMetadata(url: string): Promise<FetchedMetadata | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const data = (await res.json()) as YouTubeOEmbed
    return {
      title: data.title,
      thumbnail: data.thumbnail_url,
      description: null,
      author: data.author_name ?? null,
      detectedType: 'video',
    }
  } catch {
    return null
  }
}

async function fetchSubstackMetadata(url: string): Promise<FetchedMetadata | null> {
  try {
    const parsed = new URL(url)
    const slugMatch = parsed.pathname.match(/^\/p\/([^/?#]+)/)
    if (!slugMatch) return null
    const apiUrl = `${parsed.origin}/api/v1/posts/${slugMatch[1]}`
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const post = (await res.json()) as SubstackPost
    if (!post.title) return null
    return {
      title: post.title,
      thumbnail: post.cover_image ?? null,
      description: post.subtitle ?? post.description ?? null,
      author: post.byline ?? null,
      detectedType: 'article',
    }
  } catch {
    return null
  }
}

function parseOGFromHTML(html: string): Partial<FetchedMetadata> | null {
  const getMeta = (pattern: RegExp) => {
    const match = html.match(pattern)
    return match?.[1] ?? null
  }

  const title =
    getMeta(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ??
    getMeta(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i) ??
    getMeta(/name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i) ??
    getMeta(/content=["']([^"']+)["'][^>]*name=["']twitter:title["']/i) ??
    getMeta(/<title[^>]*>([^<]+)<\/title>/i) ??
    null

  const thumbnail =
    getMeta(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ??
    getMeta(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ??
    getMeta(/name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ??
    getMeta(/content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i) ??
    null

  const description =
    getMeta(/property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ??
    getMeta(/content=["']([^"']+)["'][^>]*property=["']og:description["']/i) ??
    getMeta(/name=["']description["'][^>]*content=["']([^"']+)["']/i) ??
    getMeta(/content=["']([^"']+)["'][^>]*name=["']description["']/i) ??
    null

  const author =
    getMeta(/name=["']author["'][^>]*content=["']([^"']+)["']/i) ??
    getMeta(/content=["']([^"']+)["'][^>]*name=["']author["']/i) ??
    null

  if (!title && !thumbnail) return null

  const decode = (s: string | null) =>
    s?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'") ?? null

  return {
    title: decode(title) ?? undefined,
    thumbnail: decode(thumbnail),
    description: decode(description),
    author: decode(author),
  }
}

async function fetchOGMetadata(url: string): Promise<Partial<FetchedMetadata> | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ConsumeBot/1.0; +https://github.com/consume)',
        Accept: 'text/html,application/xhtml+xml',
      },
    })
    if (!res.ok) return null
    const html = await res.text()
    return parseOGFromHTML(html)
  } catch {
    return null
  }
}

function extractAmazonAsin(url: string): string | null {
  const match = url.match(/\/(?:dp|gp\/product|exec\/obidos\/ASIN)\/([A-Z0-9]{10})/i)
  return match?.[1]?.toUpperCase() ?? null
}

function extractTitleFromAmazonUrl(url: string): string | null {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean)
    const dpIndex = parts.indexOf('dp')
    if (dpIndex > 0) {
      return parts[dpIndex - 1]
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
    return null
  } catch {
    return null
  }
}

interface OpenLibraryBook {
  title?: string
  authors?: { name: string }[]
  notes?: string | { value: string }
  cover?: { small?: string; medium?: string; large?: string }
}

async function fetchBookMetadata(url: string): Promise<FetchedMetadata | null> {
  const asin = extractAmazonAsin(url)
  if (!asin) return null

  try {
    const endpoint = `https://openlibrary.org/api/books?bibkeys=ISBN:${asin}&jscmd=data&format=json`
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(8000) })
    if (res.ok) {
      const data = (await res.json()) as Record<string, OpenLibraryBook>
      const book = data[`ISBN:${asin}`]
      if (book?.title) {
        const notes = book.notes
        return {
          title: book.title,
          thumbnail: book.cover?.large ?? book.cover?.medium ?? book.cover?.small ?? null,
          description: typeof notes === 'string' ? notes : (notes?.value ?? null),
          author: book.authors?.map((a) => a.name).join(', ') ?? null,
          detectedType: 'book',
        }
      }
    }
  } catch { /* fall through */ }

  if (/^\d{10}$/.test(asin)) {
    return {
      title: extractTitleFromAmazonUrl(url) ?? asin,
      thumbnail: `https://covers.openlibrary.org/b/isbn/${asin}-L.jpg`,
      description: null,
      author: null,
      detectedType: 'book',
    }
  }

  return null
}

router.get('/', requireAuth, async (c) => {
  const url = c.req.query('url')
  if (!url) return c.json({ error: 'url query parameter is required' }, 400)

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return c.json({ error: 'Invalid URL' }, 400)
  }

  // Block SSRF: reject private/internal/metadata IPs
  const blocked = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|::1|fc00:|fd)/i
  if (blocked.test(parsed.hostname)) {
    return c.json({ error: 'URL not allowed' }, 400)
  }

  const detectedType = detectContentType(url)
  const domain = extractDomain(url)

  if (detectedType === 'video') {
    const yt = await fetchYouTubeMetadata(url)
    if (yt) return c.json(yt)
  }

  if (detectedType === 'book' && /amazon\./i.test(domain)) {
    const book = await fetchBookMetadata(url)
    if (book) return c.json(book)
  }

  if (/\.substack\.com$/.test(domain)) {
    const sub = await fetchSubstackMetadata(url)
    if (sub) return c.json(sub)
  }

  const og = await fetchOGMetadata(url)
  if (og) {
    return c.json({
      title: og.title ?? domain,
      thumbnail: og.thumbnail ?? null,
      description: og.description ?? null,
      author: og.author ?? null,
      detectedType,
    })
  }

  return c.json({
    title: domain,
    thumbnail: null,
    description: null,
    author: null,
    detectedType,
  })
})

export default router
