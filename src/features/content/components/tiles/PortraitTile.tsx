import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Pencil } from 'lucide-react'
import type { ConsumeItem } from '../../types'
import { useCategoryBySlug } from '../../store/categoryStore'
import { resolveIcon } from '../../categoryIcons'
import { cn } from '@/lib/utils'
import { TileDeleteButton } from './TileDeleteButton'
import { GeneratedThumbnail } from './GeneratedThumbnail'
import { EditItemModal } from './EditItemModal'
import { useDisplayThumbnail } from '../../hooks/useDisplayThumbnail'

interface PortraitTileProps {
  item: ConsumeItem
  className?: string
}

export function PortraitTile({ item, className }: PortraitTileProps) {
  const category = useCategoryBySlug(item.type)
  const Icon = resolveIcon(category.iconName)
  const [imgError, setImgError] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const displayThumbnail = useDisplayThumbnail(item)

  useEffect(() => { setImgError(false) }, [displayThumbnail])

  const showGenerated = !displayThumbnail || imgError

  const handleClick = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditOpen(true)
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        onClick={handleClick}
        className={cn(
          'relative group flex flex-col rounded-2xl overflow-hidden cursor-pointer',
          'bg-[var(--color-card)] border border-[var(--color-border)]',
          'shadow-sm hover:shadow-md transition-shadow duration-200',
          className,
        )}
        role="article"
        aria-label={`Open ${item.title}`}
      >
        {/* Thumbnail — portrait 2:3 */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '2/3' }}>
          {!showGenerated && (
            <img
              src={displayThumbnail!}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}

          {showGenerated && (
            <GeneratedThumbnail
              title={item.title}
              domain={item.domain}
              accentColor={category.accentColor}
              Icon={Icon}
              variant="portrait"
            />
          )}

          {/* Bottom text overlay — only when a real image is showing */}
          {!showGenerated && (
            <>
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="text-sm font-semibold text-white line-clamp-3 leading-snug">
                  {item.title}
                </h3>
                {item.author && (
                  <p className="text-xs text-white/70 mt-1 truncate">{item.author}</p>
                )}
                <div className="flex items-center mt-2">
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-white/20 text-white">
                    {item.domain}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200 flex items-center justify-center">
            <ExternalLink
              size={20}
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg"
            />
          </div>
        </div>

        {/* Edit button — top left */}
        <button
          onClick={handleEditClick}
          aria-label="Edit item"
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 text-white
            flex items-center justify-center opacity-0 group-hover:opacity-100
            transition-opacity duration-150 hover:bg-white/20 cursor-pointer z-10"
        >
          <Pencil size={12} />
        </button>

        <TileDeleteButton itemId={item.id} />
      </motion.div>

      {editOpen && <EditItemModal item={item} onClose={() => setEditOpen(false)} />}
    </>
  )
}
