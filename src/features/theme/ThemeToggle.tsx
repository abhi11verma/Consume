import { Sun, Moon } from 'lucide-react'
import { useTheme } from './useTheme'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full',
        'bg-[var(--color-card)] border border-[var(--color-border)]',
        'text-[var(--color-muted)] hover:text-[var(--color-foreground)]',
        'transition-colors duration-200 cursor-pointer',
      )}
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
