import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import type { ConsumeItem } from '../../types'
import { useCategoryBySlug } from '../../store/categoryStore'
import { resolveIcon } from '../../categoryIcons'
import { cn } from '@/lib/utils'
import { TileDeleteButton } from './TileDeleteButton'

interface FeaturedTileProps {
  item: ConsumeItem
  className?: string
}

export function FeaturedTile({ item, className }: FeaturedTileProps) {
  const category = useCategoryBySlug(item.type)
  const Icon = resolveIcon(category.iconName)

  const handleClick = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  const timeAgo = formatDistanceToNow(new Date(item.dateAdded), { addSuffix: true })

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={handleClick}
      className={cn(
        'relative group rounded-2xl overflow-hidden cursor-pointer h-full min-h-[280px]',
        'shadow-sm hover:shadow-lg transition-shadow duration-200',
        className,
      )}
      role="article"
      aria-label={`Open ${item.title}`}
    >
      {/* Background thumbnail */}
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : null}

      {/* Fallback gradient bg */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${category.accentColor}60, ${category.accentColor}20)`,
        }}
      />

      {/* Bottom overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200 flex items-start justify-end p-4">
        <ExternalLink
          size={20}
          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg"
        />
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span
          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold mb-3"
          style={{ backgroundColor: category.accentColor, color: '#fff' }}
        >
          <Icon size={11} />
          {category.label}
        </span>
        <h3 className="text-lg font-bold text-white leading-snug line-clamp-3 mb-2">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-sm text-white/70 line-clamp-2 mb-3">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">{item.domain}</span>
          <span className="text-xs text-white/60">{timeAgo}</span>
        </div>
      </div>

      <TileDeleteButton itemId={item.id} />
    </motion.div>
  )
}
