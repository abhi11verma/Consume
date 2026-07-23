import { Link } from 'react-router-dom'
import { LayoutGrid, LayoutList } from 'lucide-react'
import { TileRow } from './TileRow'
import { ListRow } from '../tiles/ListRow'
import { useViewMode } from '../../hooks/useViewMode'
import type { ConsumeItem, ContentType } from '../../types'
import { CONTENT_TYPE_META } from '../../constants'

interface CategorySectionProps {
  type: ContentType
  items: ConsumeItem[]
  limit?: number
}

export function CategorySection({ type, items, limit = 8 }: CategorySectionProps) {
  const meta = CONTENT_TYPE_META[type]
  const displayed = items.slice(0, limit)
  const [viewMode, toggleViewMode] = useViewMode(`home:${type}`)

  if (items.length === 0) return null

  return (
    <section className="mb-6 md:mb-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Link
          to={meta.path}
          className="text-base font-semibold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
        >
          {meta.pluralLabel}
        </Link>
        <span className="text-sm text-[var(--color-muted-fg)]">{items.length}</span>
        <button
          onClick={toggleViewMode}
          className="ml-auto p-1.5 rounded-lg text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
          aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
        >
          {viewMode === 'grid' ? <LayoutList size={15} /> : <LayoutGrid size={15} />}
        </button>
      </div>

      {viewMode === 'grid' ? (
        <TileRow items={displayed} tileVariant={meta.tileVariant} />
      ) : (
        <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden">
          {displayed.map((item) => (
            <ListRow key={item.id} item={item} density="comfortable" />
          ))}
        </div>
      )}
    </section>
  )
}
