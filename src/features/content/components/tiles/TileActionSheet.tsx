import { Pencil, Trash2, X } from 'lucide-react'

interface TileActionSheetProps {
  title: string
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export function TileActionSheet({ title, onEdit, onDelete, onClose }: TileActionSheetProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={onClose}
    >
      <div
        className="w-full bg-[var(--color-card)] rounded-t-2xl border-t border-[var(--color-border)] shadow-2xl pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--color-border)]" />
        </div>

        {/* Title */}
        <p className="px-5 py-3 text-sm font-medium text-[var(--color-foreground)] line-clamp-2 border-b border-[var(--color-border)]">
          {title}
        </p>

        {/* Actions */}
        <div className="p-3 flex flex-col gap-1">
          <button
            onClick={() => { onEdit(); onClose() }}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface)] active:bg-[var(--color-surface)] transition-colors cursor-pointer"
          >
            <Pencil size={18} className="text-[var(--color-muted-fg)]" />
            Edit
          </button>
          <button
            onClick={() => { onDelete(); onClose() }}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left text-sm font-medium text-red-500 hover:bg-red-500/10 active:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>

        {/* Cancel */}
        <div className="px-3 pb-3">
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl text-sm font-semibold text-[var(--color-muted-fg)] bg-[var(--color-surface)] hover:bg-[var(--color-border)] active:bg-[var(--color-border)] transition-colors cursor-pointer"
          >
            <X size={15} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
