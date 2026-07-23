import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Pencil } from 'lucide-react'
import type { ConsumeItem } from '../../types'
import { useCategoryBySlug } from '../../store/categoryStore'
import { resolveIcon } from '../../categoryIcons'
import { cn } from '@/lib/utils'
import { TileDeleteButton } from './TileDeleteButton'
import { TileActionSheet } from './TileActionSheet'
import { GeneratedThumbnail } from './GeneratedThumbnail'
import { EditItemModal } from './EditItemModal'
import { useDisplayThumbnail } from '../../hooks/useDisplayThumbnail'
import { useContentStore } from '../../store/contentStore'
import { useLongPress } from '@/hooks/useLongPress'

interface LandscapeTileProps {
  item: ConsumeItem
  className?: string
}

export function LandscapeTile({ item, className }: LandscapeTileProps) {
  const category = useCategoryBySlug(item.type)
  const Icon = resolveIcon(category.iconName)
  const [imgError, setImgError] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const displayThumbnail = useDisplayThumbnail(item)
  const removeItem = useContentStore((s) => s.removeItem)

  useEffect(() => { setImgError(false) }, [displayThumbnail])

  const showGenerated = !displayThumbnail || imgError

  const handleClick = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditOpen(true)
  }

  const longPress = useLongPress({ onLongPress: () => setSheetOpen(true) })

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        onClick={handleClick}
        {...longPress}
        className={cn(
          'relative group rounded-2xl overflow-hidden cursor-pointer',
          'bg-[var(--color-card)] border border-[var(--color-border)]',
          'shadow-sm hover:shadow-md transition-shadow duration-200',
          className,
        )}
        role="article"
        aria-label={`Open ${item.title}`}
      >
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
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
              variant="landscape"
            />
          )}

          {/* Title overlay — only for real images, only on hover */}
          {!showGenerated && (
            <>
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                {item.author && (
                  <p className="text-xs text-white/65 mt-0.5 truncate">{item.author}</p>
                )}
              </div>
            </>
          )}

          {/* Center hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
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
      {sheetOpen && (
        <TileActionSheet
          title={item.title}
          onEdit={() => setEditOpen(true)}
          onDelete={() => removeItem(item.id)}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  )
}
