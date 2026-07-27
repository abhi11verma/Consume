import { formatDistanceToNow } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import { useContentStore } from '../store/contentStore'
import { useCategoryBySlug, useCategoryStore } from '../store/categoryStore'
import { resolveIcon } from '../categoryIcons'
import type { ConsumeItem } from '../types'

export function AllScreen() {
  const items = useContentStore((s) => s.items)

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
        All items
        <span className="ml-2 text-sm font-normal text-[var(--color-muted-fg)]">{items.length}</span>
      </h1>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-fg)]">No items yet.</p>
      ) : (
        <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
          {/* Header — hidden on mobile */}
          <div className="hidden md:grid grid-cols-[2.5rem_1fr_9rem_9rem_7rem] gap-4 px-4 py-2.5 bg-[var(--color-card)] border-b border-[var(--color-border)] text-xs font-medium text-[var(--color-muted-fg)] uppercase tracking-wide">
            <span />
            <span>Title</span>
            <span>Category</span>
            <span>Domain</span>
            <span>Added</span>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {items.map((item) => (
              <AllRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AllRow({ item }: { item: ConsumeItem }) {
  const category = useCategoryBySlug(item.type)
  const Icon = resolveIcon(category.iconName)
  const ago = formatDistanceToNow(new Date(item.dateAdded), { addSuffix: true })

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[2.5rem_1fr_9rem_9rem_7rem] gap-4 px-4 py-3 items-center hover:bg-[var(--color-card)] transition-colors group"
    >
      {/* Thumbnail */}
      <Thumb item={item} icon={Icon} accentColor={category.accentColor} />

      {/* Title + mobile meta */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--color-foreground)] truncate group-hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5">
          {item.title}
          <ExternalLink size={11} className="flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
        </p>
        {/* Mobile: domain + date under title */}
        <p className="md:hidden text-xs text-[var(--color-muted-fg)] mt-0.5 truncate">
          {item.domain} · {ago}
        </p>
      </div>

      {/* Category badge — desktop */}
      <div className="hidden md:flex">
        <CategoryBadge label={category.label} accentColor={category.accentColor} />
      </div>

      {/* Domain — desktop */}
      <span className="hidden md:block text-xs text-[var(--color-muted-fg)] truncate">{item.domain}</span>

      {/* Added — desktop */}
      <span className="hidden md:block text-xs text-[var(--color-muted-fg)] whitespace-nowrap">{ago}</span>
    </a>
  )
}

function Thumb({ item, icon: Icon, accentColor }: { item: ConsumeItem; icon: React.FC<{ size: number }>; accentColor: string }) {
  if (item.thumbnail) {
    return (
      <img
        src={item.thumbnail}
        alt=""
        className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
      />
    )
  }
  return (
    <span
      className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
    >
      <Icon size={16} />
    </span>
  )
}

function CategoryBadge({ label, accentColor }: { label: string; accentColor: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
    >
      {label}
    </span>
  )
}
