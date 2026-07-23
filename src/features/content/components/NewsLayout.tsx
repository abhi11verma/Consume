import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FeaturedTile } from './tiles/FeaturedTile'
import { LandscapeTile } from './tiles/LandscapeTile'
import type { ConsumeItem } from '../types'
import { CONTENT_TYPE_META } from '../constants'

interface NewsLayoutProps {
  items: ConsumeItem[]
}

export function NewsLayout({ items }: NewsLayoutProps) {
  const meta = CONTENT_TYPE_META['news']

  if (items.length === 0) return null

  const [featured, ...rest] = items
  const compact = rest.slice(0, 3)

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${meta.accentColor}20` }}
        >
          <meta.icon size={16} style={{ color: meta.accentColor }} />
        </div>
        <h2 className="text-base font-semibold text-[var(--color-foreground)]">
          {meta.pluralLabel}
        </h2>
        <span className="text-sm text-[var(--color-muted-fg)] ml-1">{items.length}</span>
        <Link
          to={meta.path}
          className="ml-auto flex items-center gap-1 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          See all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="flex gap-4" style={{ minHeight: 280 }}>
        {/* Compact tiles on left */}
        {compact.length > 0 && (
          <div className="flex flex-col gap-3 w-56 flex-shrink-0">
            {compact.map((item) => (
              <LandscapeTile
                key={item.id}
                item={item}
                className="flex-1"
              />
            ))}
          </div>
        )}

        {/* Featured tile on right — takes remaining space */}
        {featured && (
          <div className="flex-1 min-w-0">
            <FeaturedTile item={featured} className="h-full" />
          </div>
        )}
      </div>
    </section>
  )
}
