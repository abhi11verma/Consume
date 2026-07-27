import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { useCategoryStore } from '../../store/categoryStore'
import { resolveIcon, CATEGORY_ICON_OPTIONS } from '../../categoryIcons'
import { cn } from '@/lib/utils'

const COLOR_PRESETS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#0d9488',
  '#f59e0b',
  '#6b7280',
]


interface CategoryOverrideProps {
  value: string
  onChange: (type: string) => void
}

export function CategoryOverride({ value, onChange }: CategoryOverrideProps) {
  const { categories, addCategory } = useCategoryStore()
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('Star')
  const [newColor, setNewColor] = useState(COLOR_PRESETS[0])
  const [newVariant, setNewVariant] = useState<'landscape' | 'portrait'>('landscape')

  const handleCreate = () => {
    const name = newName.trim()
    if (!name) return
    const slug = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)).slice(0, 8)
    const label = name.charAt(0).toUpperCase() + name.slice(1)
    addCategory({
      slug,
      label,
      pluralLabel: label.endsWith('s') ? label : `${label}s`,
      iconName: newIcon,
      accentColor: newColor,
      tileVariant: newVariant,
    })
    onChange(slug)
    setShowForm(false)
    setNewName('')
    setNewIcon('Star')
    setNewColor(COLOR_PRESETS[0])
    setNewVariant('landscape')
  }

  const handleCancel = () => {
    setShowForm(false)
    setNewName('')
    setNewIcon('Star')
    setNewColor(COLOR_PRESETS[0])
    setNewVariant('landscape')
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
        Category
      </label>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = resolveIcon(cat.iconName)
          const isSelected = value === cat.slug
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onChange(cat.slug)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                'border transition-all duration-150 cursor-pointer',
                isSelected
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-muted)]',
              )}
              style={isSelected ? { backgroundColor: cat.accentColor } : undefined}
            >
              <Icon size={13} />
              {cat.label}
            </button>
          )
        })}

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
              'border border-dashed border-[var(--color-border)]',
              'text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)] hover:border-[var(--color-muted)]',
              'transition-all duration-150 cursor-pointer',
            )}
          >
            <Plus size={13} />
            New
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 flex flex-col gap-3">
          {/* Name */}
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
              if (e.key === 'Escape') handleCancel()
            }}
            placeholder="Category name…"
            maxLength={40}
            className={cn(
              'w-full px-3 py-2 text-sm rounded-lg',
              'bg-[var(--color-card)] border border-[var(--color-border)]',
              'text-[var(--color-foreground)] placeholder:text-[var(--color-muted-fg)]',
              'focus:outline-none focus:border-[var(--color-accent)] transition-colors',
            )}
          />

          {/* Icon picker */}
          <div>
            <p className="text-[10px] font-medium text-[var(--color-muted-fg)] uppercase tracking-wide mb-1.5">Icon</p>
            <div className="flex flex-wrap gap-1">
              {CATEGORY_ICON_OPTIONS.map((name) => {
                const Icon = resolveIcon(name)
                const isActive = newIcon === name
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setNewIcon(name)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer',
                      isActive
                        ? 'text-white'
                        : 'text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]',
                    )}
                    style={isActive ? { backgroundColor: newColor } : undefined}
                    title={name}
                  >
                    <Icon size={15} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <p className="text-[10px] font-medium text-[var(--color-muted-fg)] uppercase tracking-wide mb-1.5">Color</p>
            <div className="flex gap-1.5 flex-wrap">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewColor(color)}
                  className="h-6 w-6 rounded-full transition-transform cursor-pointer flex items-center justify-center"
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {newColor === color && <Check size={12} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tile shape */}
          <div>
            <p className="text-[10px] font-medium text-[var(--color-muted-fg)] uppercase tracking-wide mb-1.5">Tile shape</p>
            <div className="flex gap-2">
              {(['landscape', 'portrait'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setNewVariant(v)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer capitalize',
                    newVariant === v
                      ? 'border-transparent text-white'
                      : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]',
                  )}
                  style={newVariant === v ? { backgroundColor: newColor } : undefined}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={!newName.trim()}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-opacity',
              )}
              style={{ backgroundColor: newColor }}
            >
              <Check size={13} />
              Create
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
            >
              <X size={13} />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
