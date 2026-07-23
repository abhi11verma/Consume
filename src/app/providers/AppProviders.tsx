import { BrowserRouter } from 'react-router-dom'
import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import { useContentStore } from '@/features/content/store/contentStore'

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

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <AuthInit>{children}</AuthInit>
    </BrowserRouter>
  )
}
