import { useState, useEffect } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { ConsumeItem } from '../../types'
import { CONTENT_TYPE_META } from '../../constants'
import { GeneratedThumbnail } from './GeneratedThumbnail'
import { EditItemModal } from './EditItemModal'
import { useDisplayThumbnail } from '../../hooks/useDisplayThumbnail'
import { useContentStore } from '../../store/contentStore'
import { cn } from '@/lib/utils'

interface ListRowProps {
  item: ConsumeItem
  density?: 'comfortable' | 'compact'
}

export function ListRow({ item, density = 'compact' }: ListRowProps) {
  const meta = CONTENT_TYPE_META[item.type]
  const [imgError, setImgError] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const displayThumbnail = useDisplayThumbnail(item)
  const removeItem = useContentStore((s) => s.removeItem)

  useEffect(() => {
    setImgError(false)
  }, [displayThumbnail])

  const showGenerated = !displayThumbnail || imgError

  const handleClick = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditOpen(true)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeItem(item.id)
  }

  const isComfortable = density === 'comfortable'

  return (
    <>
      <div
        onClick={handleClick}
        role="article"
        aria-label={`Open ${item.title}`}
        className={cn(
          'group flex items-center gap-3 cursor-pointer transition-colors duration-150',
          'bg-[var(--color-card)] border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface)]',
          isComfortable ? 'px-3 py-3' : 'px-3 py-2.5',
        )}
      >
        {/* Thumbnail */}
        <div
          className={cn(
            'relative flex-shrink-0 rounded-lg overflow-hidden',
            isComfortable ? 'w-[76px] h-[50px]' : 'w-[60px] h-[40px]',
          )}
        >
          {showGenerated ? (
            <GeneratedThumbnail
              title={item.title}
              domain={item.domain}
              accentColor={meta.accentColor}
              Icon={meta.icon}
              variant="landscape"
            />
          ) : (
            <img
              src={displayThumbnail!}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'font-medium text-[var(--color-foreground)] leading-snug',
              isComfortable ? 'text-sm line-clamp-2' : 'text-[13px] line-clamp-1',
            )}
          >
            {item.title}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5 overflow-hidden">
            <span className="text-xs text-[var(--color-muted-fg)] truncate shrink-0">
              {item.domain}
            </span>
            {item.author && (
              <>
                <span className="text-xs text-[var(--color-muted-fg)]/40 shrink-0">·</span>
                <span className="text-xs text-[var(--color-muted-fg)] truncate">
                  {item.author}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Inline hover actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
          <button
            onClick={handleEditClick}
            aria-label="Edit"
            className="p-1.5 rounded-lg text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-card)] transition-colors cursor-pointer"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={handleDelete}
            aria-label="Remove"
            className="p-1.5 rounded-lg text-[var(--color-muted-fg)] hover:text-red-500 hover:bg-[var(--color-card)] transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {editOpen && <EditItemModal item={item} onClose={() => setEditOpen(false)} />}
    </>
  )
}
