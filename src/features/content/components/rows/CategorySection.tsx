import { Link } from 'react-router-dom'
import { TileRow } from './TileRow'
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

  if (items.length === 0) return null

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          to={meta.path}
          className="text-base font-semibold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
        >
          {meta.pluralLabel}
        </Link>
        <span className="text-sm text-[var(--color-muted-fg)]">
          {items.length}
        </span>
      </div>

      <TileRow items={displayed} tileVariant={meta.tileVariant} />
    </section>
  )
}
