import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CategoryDef {
  slug: string
  label: string
  pluralLabel: string
  iconName: string
  accentColor: string
  tileVariant: 'landscape' | 'portrait'
  builtIn: boolean
  order: number
}

export const FALLBACK_CATEGORY: CategoryDef = {
  slug: 'unknown',
  label: 'Item',
  pluralLabel: 'Items',
  iconName: 'FileText',
  accentColor: '#6b7280',
  tileVariant: 'landscape',
  builtIn: true,
  order: 999,
}

const DEFAULT_CATEGORIES: CategoryDef[] = [
  {
    slug: 'video',
    label: 'Video',
    pluralLabel: 'Videos',
    iconName: 'Video',
    accentColor: '#ef4444',
    tileVariant: 'landscape',
    builtIn: true,
    order: 0,
  },
  {
    slug: 'book',
    label: 'Book',
    pluralLabel: 'Books',
    iconName: 'BookOpen',
    accentColor: '#0d9488',
    tileVariant: 'portrait',
    builtIn: true,
    order: 1,
  },
  {
    slug: 'article',
    label: 'Article',
    pluralLabel: 'Articles',
    iconName: 'FileText',
    accentColor: '#3b82f6',
    tileVariant: 'landscape',
    builtIn: true,
    order: 2,
  },
  {
    slug: 'podcast',
    label: 'Podcast',
    pluralLabel: 'Podcasts',
    iconName: 'Mic2',
    accentColor: '#8b5cf6',
    tileVariant: 'landscape',
    builtIn: true,
    order: 3,
  },
]

interface CategoryStore {
  categories: CategoryDef[]
  addCategory: (def: Omit<CategoryDef, 'builtIn' | 'order'>) => void
  removeCategory: (slug: string) => void
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,
      addCategory: (def) => {
        const { categories } = get()
        if (categories.some((c) => c.slug === def.slug)) return
        set({
          categories: [
            ...categories,
            { ...def, builtIn: false, order: categories.length },
          ],
        })
      },
      removeCategory: (slug) => {
        set((s) => ({
          categories: s.categories.filter((c) => c.builtIn || c.slug !== slug),
        }))
      },
    }),
    {
      name: 'consume:categories',
      version: 1,
      migrate: (_persistedState, version) => {
        if (version === 0) {
          return { categories: DEFAULT_CATEGORIES }
        }
        return _persistedState as CategoryStore
      },
    },
  ),
)

export function useCategoryBySlug(slug: string): CategoryDef {
  return useCategoryStore((s) => s.categories.find((c) => c.slug === slug) ?? FALLBACK_CATEGORY)
}
