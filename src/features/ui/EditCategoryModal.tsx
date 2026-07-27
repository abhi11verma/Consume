import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { useCategoryStore } from '@/features/content/store/categoryStore'
import type { CategoryDef } from '@/features/content/store/categoryStore'
import { resolveIcon, CATEGORY_ICON_OPTIONS } from '@/features/content/categoryIcons'
import { cn } from '@/lib/utils'

const COLOR_PRESETS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#0d9488',
  '#f59e0b', '#6b7280',
]

interface EditCategoryModalProps {
  category: CategoryDef
  onClose: () => void
}

export function EditCategoryModal({ category, onClose }: EditCategoryModalProps) {
  const updateCategory = useCategoryStore((s) => s.updateCategory)

  const [label, setLabel] = useState(category.label)
  const [pluralLabel, setPluralLabel] = useState(category.pluralLabel)
  const [pluralTouched, setPluralTouched] = useState(false)
  const [iconName, setIconName] = useState(category.iconName)
  const [accentColor, setAccentColor] = useState(category.accentColor)
  const [tileVariant, setTileVariant] = useState<'landscape' | 'portrait'>(category.tileVariant)

  const handleLabelChange = (val: string) => {
    setLabel(val)
    if (!pluralTouched) {
      setPluralLabel(val.endsWith('s') ? val : `${val}s`)
    }
  }

  const handleSave = async () => {
    if (!label.trim()) return
    await updateCategory(category.slug, {
      label: label.trim(),
      pluralLabel: pluralLabel.trim() || `${label.trim()}s`,
      iconName,
      accentColor,
      tileVariant,
    })
    onClose()
  }

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 bg-black/50"
      onClick={handleBackdrop}
    >
      <div className="bg-[var(--color-card)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl border border-[var(--color-border)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-foreground)]">Edit category</h2>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background)] transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Fields */}
        <div className="px-5 py-4 flex flex-col gap-4 overflow-y-auto">
          {/* Label */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">Name</span>
            <input
              autoFocus
              className="w-full rounded-xl px-3 py-2 text-sm bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Category name"
              maxLength={40}
            />
          </div>

          {/* Plural label */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">Plural name</span>
            <input
              className="w-full rounded-xl px-3 py-2 text-sm bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
              value={pluralLabel}
              onChange={(e) => { setPluralLabel(e.target.value); setPluralTouched(true) }}
              placeholder="Category plural name"
              maxLength={40}
            />
          </div>

          {/* Icon picker */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">Icon</span>
            <div className="flex flex-wrap gap-1">
              {CATEGORY_ICON_OPTIONS.map((name) => {
                const Icon = resolveIcon(name)
                const isActive = iconName === name
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setIconName(name)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer',
                      isActive ? 'text-white' : 'text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]',
                    )}
                    style={isActive ? { backgroundColor: accentColor } : undefined}
                    title={name}
                  >
                    <Icon size={15} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color picker */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">Color</span>
            <div className="flex gap-1.5 flex-wrap">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAccentColor(color)}
                  className="h-6 w-6 rounded-full transition-transform cursor-pointer flex items-center justify-center"
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {accentColor === color && <Check size={12} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tile shape */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">Tile shape</span>
            <div className="flex gap-2">
              {(['landscape', 'portrait'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTileVariant(v)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer capitalize',
                    tileVariant === v
                      ? 'border-transparent text-white'
                      : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]',
                  )}
                  style={tileVariant === v ? { backgroundColor: accentColor } : undefined}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 py-4 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-medium border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleSave()}
            disabled={!label.trim()}
            className="flex-1 py-2 rounded-xl text-sm font-medium bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
