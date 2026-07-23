import { CONTENT_TYPE_ORDER, CONTENT_TYPE_META } from '../../constants'
import type { ContentType } from '../../types'
import { cn } from '@/lib/utils'

interface CategoryOverrideProps {
  value: ContentType
  onChange: (type: ContentType) => void
}

export function CategoryOverride({ value, onChange }: CategoryOverrideProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
        Category
      </label>
      <div className="flex flex-wrap gap-2">
        {CONTENT_TYPE_ORDER.map((type) => {
          const meta = CONTENT_TYPE_META[type]
          const isSelected = value === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                'border transition-all duration-150 cursor-pointer',
                isSelected
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-muted)]',
              )}
              style={
                isSelected
                  ? { backgroundColor: meta.accentColor }
                  : undefined
              }
            >
              <meta.icon size={13} />
              {meta.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
