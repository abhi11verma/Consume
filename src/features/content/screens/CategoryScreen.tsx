import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../store/contentStore'
import { TileGrid } from '../components/grid/TileGrid'
import { CONTENT_TYPE_META } from '../constants'
import type { ContentType } from '../types'

interface CategoryScreenProps {
  type: ContentType
}

export function CategoryScreen({ type }: CategoryScreenProps) {
  const items = useContentStore(
    useShallow((s) => s.items.filter((i) => i.type === type)),
  )
  const meta = CONTENT_TYPE_META[type]
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="px-4 py-4 md:px-8 md:py-8"
    >
      {/* Page header */}
      <div className="flex items-center gap-3 mb-4 md:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="md:hidden flex items-center justify-center h-9 w-9 -ml-1 rounded-full hover:bg-[var(--color-surface)] transition-colors text-[var(--color-muted-fg)]"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
        <div
          className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${meta.accentColor}20` }}
        >
          <meta.icon size={20} style={{ color: meta.accentColor }} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-foreground)]">
            {meta.pluralLabel}
          </h1>
          <p className="text-xs md:text-sm text-[var(--color-muted)]">
            {items.length} {items.length === 1 ? 'item' : 'items'} captured
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyCategory label={meta.pluralLabel} />
      ) : (
        <TileGrid items={items} type={type} />
      )}
    </motion.div>
  )
}

function EmptyCategory({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-center">
      <div className="text-5xl select-none">🗂️</div>
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
          No {label.toLowerCase()} yet
        </h2>
        <p className="text-[var(--color-muted)] max-w-xs leading-relaxed">
          Click the <span className="font-semibold text-[var(--color-accent)]">+</span> button
          and paste a link to add your first one.
        </p>
      </div>
    </div>
  )
}
