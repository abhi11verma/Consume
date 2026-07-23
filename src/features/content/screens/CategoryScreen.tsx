import { motion } from 'framer-motion'
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="px-8 py-8"
    >
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${meta.accentColor}20` }}
        >
          <meta.icon size={22} style={{ color: meta.accentColor }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            {meta.pluralLabel}
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
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
