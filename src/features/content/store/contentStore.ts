import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { ConsumeItem } from '../types'
import { api } from '@/lib/api'

interface ContentState {
  items: ConsumeItem[]
  isLoading: boolean
  error: string | null
  loadItems: () => Promise<void>
  addItem: (item: Omit<ConsumeItem, 'id' | 'dateAdded'>) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateItem: (id: string, updates: Partial<Omit<ConsumeItem, 'id' | 'dateAdded'>>) => Promise<void>
}

export const useContentStore = create<ContentState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  loadItems: async () => {
    set({ isLoading: true, error: null })
    try {
      const items = await api.get<ConsumeItem[]>('/api/items')
      set({ items, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load items' })
    }
  },

  addItem: async (item) => {
    const newItem: ConsumeItem = {
      ...item,
      id: uuidv4(),
      dateAdded: new Date().toISOString(),
    }
    try {
      const saved = await api.post<ConsumeItem>('/api/items', newItem)
      set({ items: [saved, ...get().items] })
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add item')
    }
  },

  removeItem: async (id) => {
    set({ items: get().items.filter((i) => i.id !== id) })
    try {
      await api.delete(`/api/items/${id}`)
    } catch {
      // Re-load to restore correct state if delete failed
      await get().loadItems()
    }
  },

  updateItem: async (id, updates) => {
    set({ items: get().items.map((i) => (i.id === id ? { ...i, ...updates } : i)) })
    try {
      await api.put(`/api/items/${id}`, updates)
    } catch {
      await get().loadItems()
    }
  },
}))
