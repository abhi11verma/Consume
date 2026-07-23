import { Home, ShieldCheck, LogOut } from 'lucide-react'
import { NavItem } from './NavItem'
import { ThemeToggle } from '@/features/theme/ThemeToggle'
import { CONTENT_TYPE_META, CONTENT_TYPE_ORDER } from '@/features/content/constants'
import { useContentStore } from '@/features/content/store/contentStore'
import { DataActions } from '@/features/content/components/DataActions'
import { useAuth } from '@/features/auth/useAuth'

export function Sidebar() {
  const items = useContentStore((s) => s.items)
  const { user, logout } = useAuth()

  const countByType = (type: string) => items.filter((i) => i.type === type).length

  return (
    <aside className="flex flex-col h-full w-60 flex-shrink-0 px-4 py-6 border-r border-[var(--color-border)]">
      {/* Logo */}
      <div className="mb-8 px-3">
        <h1 className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">
          Consume
        </h1>
        <p className="text-xs text-[var(--color-muted-fg)] mt-0.5">Your digital library</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        <NavItem
          to="/"
          label="Home"
          icon={Home}
          accentColor="var(--color-accent)"
          count={items.length}
        />
        {CONTENT_TYPE_ORDER.map((type) => {
          const meta = CONTENT_TYPE_META[type]
          return (
            <NavItem
              key={type}
              to={meta.path}
              label={meta.pluralLabel}
              icon={meta.icon}
              accentColor={meta.accentColor}
              count={countByType(type)}
            />
          )
        })}
        {user?.role === 'admin' && (
          <NavItem
            to="/admin"
            label="Admin"
            icon={ShieldCheck}
            accentColor="var(--color-accent)"
          />
        )}
      </nav>

      {/* Data export/import + theme toggle + user info pinned to bottom */}
      <div className="mt-auto flex flex-col gap-3">
        <DataActions />
        <div className="px-1">
          <ThemeToggle />
        </div>
        {user && (
          <div className="px-1 flex items-center justify-between">
            <span className="text-xs text-[var(--color-muted-fg)] truncate max-w-[150px]" title={user.email}>
              {user.email}
            </span>
            <button
              onClick={() => void logout()}
              title="Sign out"
              className="p-1.5 rounded-md text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)] transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
