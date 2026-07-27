import { create } from 'zustand'
import { api } from '@/lib/api'

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

interface CategoryStore {
  categories: CategoryDef[]
  isLoading: boolean
  loadCategories: () => Promise<void>
  addCategory: (def: Omit<CategoryDef, 'builtIn' | 'order'>) => Promise<void>
  updateCategory: (slug: string, updates: Partial<Omit<CategoryDef, 'slug' | 'builtIn' | 'order'>>) => Promise<void>
  removeCategory: (slug: string) => Promise<void>
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,

  loadCategories: async () => {
    set({ isLoading: true })
    try {
      const categories = await api.get<CategoryDef[]>('/api/categories')
      set({ categories, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  addCategory: async (def) => {
    const { categories } = get()
    if (categories.some((c) => c.slug === def.slug)) return
    const optimistic: CategoryDef = { ...def, builtIn: false, order: categories.length }
    set({ categories: [...categories, optimistic] })
    try {
      const saved = await api.post<CategoryDef>('/api/categories', { ...optimistic })
      set({ categories: [...get().categories.filter((c) => c.slug !== def.slug), saved] })
    } catch {
      set({ categories: get().categories.filter((c) => c.slug !== def.slug) })
    }
  },

  updateCategory: async (slug, updates) => {
    set({ categories: get().categories.map((c) => (c.slug === slug ? { ...c, ...updates } : c)) })
    try {
      await api.put(`/api/categories/${slug}`, updates)
    } catch {
      await get().loadCategories()
    }
  },

  removeCategory: async (slug) => {
    const { categories } = get()
    const removed = categories.find((c) => c.slug === slug)
    if (!removed || removed.builtIn) return
    set({ categories: categories.filter((c) => c.slug !== slug) })
    try {
      await api.delete(`/api/categories/${slug}`)
    } catch {
      set({ categories: [...get().categories, removed].sort((a, b) => a.order - b.order) })
    }
  },
}))

export function useCategoryBySlug(slug: string): CategoryDef {
  return useCategoryStore((s) => s.categories.find((c) => c.slug === slug) ?? FALLBACK_CATEGORY)
}
