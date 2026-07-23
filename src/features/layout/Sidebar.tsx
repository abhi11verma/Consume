import { useState, useEffect } from 'react'
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

  // Collapsed (icon-only) on md, full on lg+
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = (e: MediaQueryListEvent) => setCollapsed(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const countByType = (type: string) => items.filter((i) => i.type === type).length

  return (
    <aside
      className={`hidden md:flex flex-col h-full flex-shrink-0 border-r border-[var(--color-border)] transition-[width] duration-200 overflow-hidden ${
        collapsed ? 'w-14 px-2 py-6' : 'w-60 px-4 py-6'
      }`}
    >
      {/* Logo */}
      <div className={`mb-8 ${collapsed ? 'flex items-center justify-center' : 'px-3'}`}>
        {collapsed ? (
          <span className="text-lg font-black text-[var(--color-accent)]">C</span>
        ) : (
          <>
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">
              Consume
            </h1>
            <p className="text-xs text-[var(--color-muted-fg)] mt-0.5">Your digital library</p>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        <NavItem
          to="/"
          label="Home"
          icon={Home}
          accentColor="var(--color-accent)"
          count={items.length}
          collapsed={collapsed}
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
              collapsed={collapsed}
            />
          )
        })}
        {user?.role === 'admin' && (
          <NavItem
            to="/admin"
            label="Admin"
            icon={ShieldCheck}
            accentColor="var(--color-accent)"
            collapsed={collapsed}
          />
        )}
      </nav>

      {/* Bottom: data actions + theme + user */}
      <div className="mt-auto flex flex-col gap-3">
        {!collapsed && <DataActions />}
        <div className={collapsed ? 'flex justify-center' : 'px-1'}>
          <ThemeToggle />
        </div>
        {user && !collapsed && (
          <div className="px-1 flex items-center justify-between">
            <span className="text-xs text-[var(--color-muted-fg)] truncate max-w-[150px]" title={user.email}>
              {user.email}
            </span>
            <button
              onClick={() => void logout()}
              title="Sign out"
              className="p-1.5 rounded-md text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)] transition-colors cursor-pointer"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
