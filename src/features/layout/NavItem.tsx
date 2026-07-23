import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface NavItemProps {
  to: string
  label: string
  icon: LucideIcon
  accentColor: string
  count?: number
  collapsed?: boolean
  onClick?: () => void
}

export function NavItem({ to, label, icon: Icon, accentColor, count, collapsed, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center rounded-xl text-sm font-medium transition-all duration-150',
          'text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-card)]',
          isActive && 'text-[var(--color-foreground)] bg-[var(--color-card)] shadow-sm',
          collapsed ? 'justify-center py-2 px-2' : 'gap-3 px-3 py-2',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0"
            style={{
              backgroundColor: isActive ? `${accentColor}20` : 'transparent',
              color: isActive ? accentColor : 'inherit',
            }}
          >
            <Icon size={15} />
          </span>
          {!collapsed && <span>{label}</span>}
          {!collapsed && count !== undefined && count > 0 && (
            <span className="ml-auto text-xs text-[var(--color-muted-fg)] tabular-nums">
              {count}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
