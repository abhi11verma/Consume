import { useState, useCallback } from 'react'

type ViewMode = 'grid' | 'list'

export function useViewMode(storageKey: string, defaultMode: ViewMode = 'grid') {
  const [mode, setMode] = useState<ViewMode>(() => {
    try {
      return (localStorage.getItem(`viewMode:${storageKey}`) as ViewMode) ?? defaultMode
    } catch {
      return defaultMode
    }
  })

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'grid' ? 'list' : 'grid'
      try {
        localStorage.setItem(`viewMode:${storageKey}`, next)
      } catch {}
      return next
    })
  }, [storageKey])

  return [mode, toggle] as const
}
