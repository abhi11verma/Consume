import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { FetchedMetadata, ContentType } from '../../types'
import { useCategoryBySlug } from '../../store/categoryStore'
import { resolveIcon } from '../../categoryIcons'

interface MetadataPreviewProps {
  metadata: FetchedMetadata
  type: ContentType
  titleValue: string
  onTitleChange: (title: string) => void
  overrideThumbnail?: string | null
  onClearThumbnail?: () => void
}

export function MetadataPreview({
  metadata,
  type,
  titleValue,
  onTitleChange,
  overrideThumbnail,
  onClearThumbnail,
}: MetadataPreviewProps) {
  const category = useCategoryBySlug(type)
  const Icon = resolveIcon(category.iconName)
  const [imgError, setImgError] = useState(false)
  const displayThumb = overrideThumbnail !== undefined
    ? overrideThumbnail
    : (imgError ? null : (metadata.thumbnail ?? null))

  return (
    <div className="flex gap-4 p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
      {/* Thumbnail */}
      <div
        className="group relative flex-shrink-0 w-28 rounded-lg overflow-hidden"
        style={{ aspectRatio: type === 'book' ? '2/3' : '16/9' }}
      >
        {displayThumb ? (
          <img
            src={displayThumb}
            alt="thumbnail"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${category.accentColor}30, ${category.accentColor}10)` }}
          >
            <Icon size={24} style={{ color: category.accentColor, opacity: 0.6 }} />
          </div>
        )}
        {displayThumb && onClearThumbnail && (
          <button
            onClick={onClearThumbnail}
            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white
              flex items-center justify-center opacity-0 group-hover:opacity-100
              transition-opacity hover:bg-red-500 cursor-pointer"
          >
            <Trash2 size={9} />
          </button>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <label className="text-xs font-medium text-[var(--color-muted)]">Title</label>
        <input
          type="text"
          value={titleValue}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full text-sm font-medium text-[var(--color-foreground)] bg-transparent
            border border-[var(--color-border)] rounded-lg px-3 py-2
            focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          placeholder="Title"
        />
        {metadata.author && (
          <p className="text-xs text-[var(--color-muted)] truncate">by {metadata.author}</p>
        )}
        {metadata.description && (
          <p className="text-xs text-[var(--color-muted-fg)] line-clamp-2 leading-relaxed">
            {metadata.description}
          </p>
        )}
      </div>
    </div>
  )
}
