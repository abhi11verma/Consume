import { BrowserRouter } from 'react-router-dom'
import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import { useContentStore } from '@/features/content/store/contentStore'
import { useTheme } from '@/features/theme/useTheme'

function AuthInit({ children }: { children: ReactNode }) {
  const init = useAuth((s) => s.init)
  const user = useAuth((s) => s.user)
  const loadItems = useContentStore((s) => s.loadItems)

  useEffect(() => {
    void init()
  }, [init])

  useEffect(() => {
    if (user) void loadItems()
  }, [user, loadItems])

  return <>{children}</>
}

interface AppProvidersProps {
  children: ReactNode
}

function ThemeInit() {
  useTheme()
  return null
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <ThemeInit />
      <AuthInit>{children}</AuthInit>
    </BrowserRouter>
  )
}
