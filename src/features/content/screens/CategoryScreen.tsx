import { motion } from 'framer-motion'
import { ChevronLeft, LayoutGrid, LayoutList } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../store/contentStore'
import { useCategoryBySlug, FALLBACK_CATEGORY } from '../store/categoryStore'
import { resolveIcon } from '../categoryIcons'
import { TileGrid } from '../components/grid/TileGrid'
import { ListRow } from '../components/tiles/ListRow'
import { useViewMode } from '../hooks/useViewMode'

export function CategoryScreen() {
  const { slug = '' } = useParams<{ slug: string }>()
  const items = useContentStore(
    useShallow((s) => s.items.filter((i) => i.type === slug)),
  )
  const category = useCategoryBySlug(slug)
  const navigate = useNavigate()
  const [viewMode, toggleViewMode] = useViewMode(`category:${slug}`)

  const Icon = resolveIcon(category.iconName)

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
          className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl flex-shrink-0"
          style={{ backgroundColor: `${category.accentColor}20` }}
        >
          <Icon size={20} style={{ color: category.accentColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-foreground)]">
            {category.pluralLabel}
          </h1>
          <p className="text-xs md:text-sm text-[var(--color-muted)]">
            {items.length} {items.length === 1 ? 'item' : 'items'} captured
          </p>
        </div>

        {/* View toggle */}
        {items.length > 0 && (
          <button
            onClick={toggleViewMode}
            className="flex items-center justify-center h-8 w-8 rounded-xl bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)] transition-colors cursor-pointer flex-shrink-0"
            aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
          >
            {viewMode === 'grid' ? <LayoutList size={16} /> : <LayoutGrid size={16} />}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyCategory label={category === FALLBACK_CATEGORY ? slug : category.pluralLabel} />
      ) : viewMode === 'grid' ? (
        <TileGrid items={items} tileVariant={category.tileVariant} />
      ) : (
        <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden">
          {items.map((item) => (
            <ListRow key={item.id} item={item} density="compact" />
          ))}
        </div>
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
