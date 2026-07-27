import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import { useContentStore } from '../store/contentStore'
import { useCategoryBySlug } from '../store/categoryStore'
import { resolveIcon } from '../categoryIcons'
import { ConfirmDialog } from '@/features/ui/ConfirmDialog'
import { EditItemModal } from '../components/tiles/EditItemModal'
import type { ConsumeItem } from '../types'

export function AllScreen() {
  const items = useContentStore((s) => s.items)
  const removeItem = useContentStore((s) => s.removeItem)
  const removeItems = useContentStore((s) => s.removeItems)

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirmBulk, setConfirmBulk] = useState(false)
  const [deletingItem, setDeletingItem] = useState<ConsumeItem | null>(null)
  const [editingItem, setEditingItem] = useState<ConsumeItem | null>(null)

  const allSelected = items.length > 0 && selected.size === items.length

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(items.map((i) => i.id)))

  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const handleBulkDelete = () => {
    void removeItems([...selected])
    setSelected(new Set())
    setConfirmBulk(false)
  }

  const handleSingleDelete = () => {
    if (!deletingItem) return
    void removeItem(deletingItem.id)
    setDeletingItem(null)
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-lg font-semibold text-[var(--color-foreground)]">
          All items
          <span className="ml-2 text-sm font-normal text-[var(--color-muted-fg)]">{items.length}</span>
        </h1>
        {selected.size > 0 && (
          <button
            onClick={() => setConfirmBulk(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
          >
            <Trash2 size={13} />
            Delete {selected.size} selected
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-fg)]">No items yet.</p>
      ) : (
        <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
          {/* Table header — desktop */}
          <div className="hidden md:grid grid-cols-[2rem_2.5rem_1fr_9rem_9rem_7rem_4.5rem] gap-3 px-4 py-2.5 bg-[var(--color-card)] border-b border-[var(--color-border)] text-xs font-medium text-[var(--color-muted-fg)] uppercase tracking-wide items-center">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="h-4 w-4 rounded accent-[var(--color-accent)] cursor-pointer"
            />
            <span />
            <span>Title</span>
            <span>Category</span>
            <span>Domain</span>
            <span>Added</span>
            <span />
          </div>

          {/* Mobile header */}
          <div className="flex md:hidden items-center gap-3 px-4 py-2.5 bg-[var(--color-card)] border-b border-[var(--color-border)]">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="h-4 w-4 rounded accent-[var(--color-accent)] cursor-pointer"
            />
            <span className="text-xs font-medium text-[var(--color-muted-fg)] uppercase tracking-wide">Select all</span>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {items.map((item) => (
              <AllRow
                key={item.id}
                item={item}
                isSelected={selected.has(item.id)}
                onToggle={() => toggleOne(item.id)}
                onEdit={() => setEditingItem(item)}
                onDelete={() => setDeletingItem(item)}
              />
            ))}
          </div>
        </div>
      )}

      {confirmBulk && (
        <ConfirmDialog
          title={`Delete ${selected.size} items`}
          message="This cannot be undone."
          confirmLabel={`Delete ${selected.size} items`}
          onConfirm={handleBulkDelete}
          onCancel={() => setConfirmBulk(false)}
        />
      )}

      {deletingItem && (
        <ConfirmDialog
          title="Delete item"
          message={`"${deletingItem.title}" will be permanently deleted.`}
          onConfirm={handleSingleDelete}
          onCancel={() => setDeletingItem(null)}
        />
      )}

      {editingItem && (
        <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  )
}

function AllRow({
  item,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}: {
  item: ConsumeItem
  isSelected: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const category = useCategoryBySlug(item.type)
  const Icon = resolveIcon(category.iconName)
  const ago = formatDistanceToNow(new Date(item.dateAdded), { addSuffix: true })

  return (
    <div
      className={`grid grid-cols-[2rem_2.5rem_1fr_4.5rem] md:grid-cols-[2rem_2.5rem_1fr_9rem_9rem_7rem_4.5rem] gap-3 px-4 py-3 items-center transition-colors ${
        isSelected ? 'bg-[var(--color-accent)]/5' : 'hover:bg-[var(--color-card)]'
      }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="h-4 w-4 rounded accent-[var(--color-accent)] cursor-pointer"
      />

      {/* Thumbnail */}
      <Thumb item={item} icon={Icon} accentColor={category.accentColor} />

      {/* Title + mobile meta */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-0 group"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-medium text-[var(--color-foreground)] truncate group-hover:text-[var(--color-accent)] transition-colors">
          {item.title}
        </p>
        <p className="md:hidden text-xs text-[var(--color-muted-fg)] mt-0.5 truncate">
          <CategoryBadge label={category.label} accentColor={category.accentColor} /> · {item.domain} · {ago}
        </p>
      </a>

      {/* Category — desktop */}
      <div className="hidden md:flex">
        <CategoryBadge label={category.label} accentColor={category.accentColor} />
      </div>

      {/* Domain — desktop */}
      <span className="hidden md:block text-xs text-[var(--color-muted-fg)] truncate">{item.domain}</span>

      {/* Added — desktop */}
      <span className="hidden md:block text-xs text-[var(--color-muted-fg)] whitespace-nowrap">{ago}</span>

      {/* Actions */}
      <div className="flex items-center justify-end gap-0.5">
        <button
          onClick={onEdit}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)] transition cursor-pointer"
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={onDelete}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-muted-fg)] hover:text-red-500 hover:bg-[var(--color-border)] transition cursor-pointer"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

function Thumb({ item, icon: Icon, accentColor }: { item: ConsumeItem; icon: React.FC<{ size: number }>; accentColor: string }) {
  if (item.thumbnail) {
    return <img src={item.thumbnail} alt="" className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
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
