import type { ContentType } from '../types'

const NEWS_DOMAINS = new Set([
  'nytimes.com',
  'bbc.com',
  'bbc.co.uk',
  'reuters.com',
  'theguardian.com',
  'guardian.com',
  'washingtonpost.com',
  'cnn.com',
  'nbcnews.com',
  'apnews.com',
  'theatlantic.com',
  'economist.com',
  'ft.com',
  'bloomberg.com',
  'wsj.com',
  'forbes.com',
  'techcrunch.com',
  'theverge.com',
  'wired.com',
  'arstechnica.com',
  'hindustantimes.com',
  'thehindu.com',
  'ndtv.com',
  'timesofindia.com',
  'indianexpress.com',
])

export function detectContentType(url: string): ContentType {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return 'article'
  }

  const host = parsed.hostname.replace(/^www\./, '')
  const path = parsed.pathname

  // Video
  if (
    host === 'youtube.com' ||
    host === 'youtu.be' ||
    host === 'm.youtube.com' ||
    (host === 'youtube.com' && path.startsWith('/watch'))
  ) {
    return 'video'
  }

  // Book — amazon.* covers .com, .in, .co.uk, .de, .ca, .fr, .co.jp, etc.
  const isAmazonHost = host.startsWith('amazon.')
  if (
    (isAmazonHost && (path.includes('/dp/') || path.includes('/books/'))) ||
    host === 'goodreads.com' ||
    host === 'books.google.com' ||
    host === 'openlibrary.org'
  ) {
    return 'book'
  }

  // Podcast
  if (
    (host === 'open.spotify.com' && path.startsWith('/episode')) ||
    (host === 'open.spotify.com' && path.startsWith('/show')) ||
    host === 'podcasts.apple.com' ||
    host === 'anchor.fm' ||
    host === 'soundcloud.com' ||
    host === 'overcast.fm' ||
    host === 'pocketcasts.com' ||
    host === 'castbox.fm'
  ) {
    return 'podcast'
  }

  // News
  if (NEWS_DOMAINS.has(host)) {
    return 'news'
  }

  return 'article'
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
