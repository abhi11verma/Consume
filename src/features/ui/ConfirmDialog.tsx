import { AnimatePresence, motion } from 'framer-motion'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-sm rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl p-6 flex flex-col gap-4"
          role="dialog"
          aria-modal="true"
        >
          <div>
            <h2 className="text-base font-semibold text-[var(--color-foreground)]">{title}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{message}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition cursor-pointer ${
                isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-[var(--color-accent)] hover:opacity-90'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
