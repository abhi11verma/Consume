import { useState, useEffect } from 'react'
import { Home, ShieldCheck, LogOut, Settings2 } from 'lucide-react'
import { NavItem } from './NavItem'
import { CONTENT_TYPE_META, CONTENT_TYPE_ORDER } from '@/features/content/constants'
import { useContentStore } from '@/features/content/store/contentStore'
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
      <div className={`mb-8 ${collapsed ? 'flex items-center justify-center' : 'px-3 flex items-center gap-2.5'}`}>
        <img src="/icon.svg" alt="Consume" className="h-7 w-7 flex-shrink-0" />
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[var(--color-foreground)]">Consume</h1>
          </div>
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

      {/* Bottom: settings + user */}
      <div className="mt-auto flex flex-col gap-2">
        <NavItem
          to="/settings"
          label="Settings"
          icon={Settings2}
          accentColor="var(--color-accent)"
          collapsed={collapsed}
        />

        {user && !collapsed && (
          <div className="px-3 py-2 flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
            <div className="h-7 w-7 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-[var(--color-accent)]">
                {user.email?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <span className="text-xs text-[var(--color-foreground)] truncate flex-1" title={user.email}>
              {user.email}
            </span>
            <button
              onClick={() => void logout()}
              title="Sign out"
              className="p-1 rounded-md text-[var(--color-muted-fg)] hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
            >
              <LogOut size={13} />
            </button>
          </div>
        )}

        {user && collapsed && (
          <button
            onClick={() => void logout()}
            title="Sign out"
            className="flex items-center justify-center h-9 w-9 mx-auto rounded-full text-[var(--color-muted-fg)] hover:text-red-500 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </aside>
  )
}
