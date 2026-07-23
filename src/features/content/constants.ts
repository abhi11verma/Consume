import {
  Video,
  BookOpen,
  FileText,
  Mic2,
  Newspaper,
} from 'lucide-react'
import type { ContentType } from './types'
import type { LucideIcon } from 'lucide-react'

export interface ContentTypeMeta {
  label: string
  pluralLabel: string
  icon: LucideIcon
  accentColor: string
  cssVar: string
  tileVariant: 'landscape' | 'portrait'
  path: string
}

export const CONTENT_TYPE_META: Record<ContentType, ContentTypeMeta> = {
  video: {
    label: 'Video',
    pluralLabel: 'Videos',
    icon: Video,
    accentColor: '#ef4444',
    cssVar: 'var(--color-cat-video)',
    tileVariant: 'landscape',
    path: '/videos',
  },
  book: {
    label: 'Book',
    pluralLabel: 'Books',
    icon: BookOpen,
    accentColor: '#0d9488',
    cssVar: 'var(--color-cat-book)',
    tileVariant: 'portrait',
    path: '/books',
  },
  article: {
    label: 'Article',
    pluralLabel: 'Articles',
    icon: FileText,
    accentColor: '#3b82f6',
    cssVar: 'var(--color-cat-article)',
    tileVariant: 'landscape',
    path: '/articles',
  },
  podcast: {
    label: 'Podcast',
    pluralLabel: 'Podcasts',
    icon: Mic2,
    accentColor: '#8b5cf6',
    cssVar: 'var(--color-cat-podcast)',
    tileVariant: 'landscape',
    path: '/podcasts',
  },
  news: {
    label: 'News',
    pluralLabel: 'News',
    icon: Newspaper,
    accentColor: '#f59e0b',
    cssVar: 'var(--color-cat-news)',
    tileVariant: 'landscape',
    path: '/news',
  },
}

export const CONTENT_TYPE_ORDER: ContentType[] = [
  'video',
  'book',
  'article',
  'podcast',
  'news',
]
