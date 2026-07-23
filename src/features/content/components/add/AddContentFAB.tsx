import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { AddContentModal } from './AddContentModal'

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  return (
    t instanceof HTMLInputElement ||
    t instanceof HTMLTextAreaElement ||
    t instanceof HTMLSelectElement ||
    t.isContentEditable
  )
}

export function AddContentFAB() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'c' || e.key === 'C') {
        if (!isTyping(e) && !isOpen) {
          e.preventDefault()
          setIsOpen(true)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen])

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        title="Add content"
        aria-label="Add new content"
        className="fixed bottom-8 right-8 z-30 flex h-14 w-14 items-center justify-center
          rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)]
          shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
      >
        <Plus size={24} />
      </motion.button>

      <AddContentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
