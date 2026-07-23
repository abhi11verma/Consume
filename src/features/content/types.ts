export type ContentType = 'video' | 'book' | 'article' | 'podcast' | 'news'

export interface ConsumeItem {
  id: string
  type: ContentType
  url: string
  title: string
  thumbnail: string | null
  description: string | null
  domain: string
  author: string | null
  dateAdded: string
  tags: string[]
}

export interface FetchedMetadata {
  title: string
  thumbnail: string | null
  description: string | null
  author: string | null
  detectedType: ContentType
}

export type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: FetchedMetadata }
  | { status: 'error'; message: string }
