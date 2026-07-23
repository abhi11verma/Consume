import { create } from 'zustand'
import { api } from '@/lib/api'

export interface AuthUser {
  userId: string
  email: string
  role: 'admin' | 'user'
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  init: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  init: async () => {
    try {
      const data = await api.get<{ userId: string; email: string; role: 'admin' | 'user' }>('/api/auth/me')
      set({ user: data, isLoading: false })
    } catch {
      set({ user: null, isLoading: false })
    }
  },

  login: async (email, password) => {
    const data = await api.post<{ id: string; email: string; role: 'admin' | 'user' }>('/api/auth/login', {
      email,
      password,
    })
    set({ user: { userId: data.id, email: data.email, role: data.role } })
  },

  logout: async () => {
    await api.post('/api/auth/logout')
    set({ user: null })
    window.location.href = '/login'
  },
}))
