import { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { AddContentFAB } from '@/features/content/components/add/AddContentFAB'
import { AddContentModal } from '@/features/content/components/add/AddContentModal'
import { AddContentContext } from '@/features/content/context/AddContentContext'

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  return (
    t instanceof HTMLInputElement ||
    t instanceof HTMLTextAreaElement ||
    t instanceof HTMLSelectElement ||
    t.isContentEditable
  )
}

export function AppShell() {
  const [isOpen, setIsOpen] = useState(false)
  const [initialUrl, setInitialUrl] = useState('')

  const open = useCallback((url = '') => {
    setInitialUrl(url)
    setIsOpen(true)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'c' || e.key === 'C') && !isTyping(e) && !isOpen) {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, open])

  return (
    <AddContentContext.Provider value={{ open }}>
      <div className="flex h-full w-full overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <Outlet />
        </main>

        <AddContentFAB onClick={() => open()} />
        <BottomNav />
      </div>

      <AddContentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialUrl={initialUrl}
      />
    </AddContentContext.Provider>
  )
}
