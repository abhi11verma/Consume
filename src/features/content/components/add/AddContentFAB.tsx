import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

interface AddContentFABProps {
  onClick: () => void
}

export function AddContentFAB({ onClick }: AddContentFABProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      title="Add content (C)"
      aria-label="Add new content"
      className="hidden md:flex fixed bottom-8 right-8 z-30 h-14 w-14 items-center justify-center
        rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)]
        shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
    >
      <Plus size={24} />
    </motion.button>
  )
}
