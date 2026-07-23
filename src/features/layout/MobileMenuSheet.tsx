import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck, LogOut, Settings2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/features/auth/useAuth'
import { useCategoryStore } from '@/features/content/store/categoryStore'
import { resolveIcon } from '@/features/content/categoryIcons'

interface MobileMenuSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenuSheet({ isOpen, onClose }: MobileMenuSheetProps) {
  const { user, logout } = useAuth()
  const categories = useCategoryStore((s) => s.categories)

  const handleLogout = async () => {
    onClose()
    await logout()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-[var(--color-surface)] border-t border-[var(--color-border)] px-4 pt-3"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
          >
            {/* Handle */}
            <div className="flex justify-center mb-4">
              <div className="h-1 w-10 rounded-full bg-[var(--color-border)]" />
            </div>

            {/* Nav items */}
            <div className="flex flex-col gap-1 mb-4">
              {categories.map((cat) => {
                const Icon = resolveIcon(cat.iconName)
                return (
                  <SheetNavItem
                    key={cat.slug}
                    to={`/c/${cat.slug}`}
                    icon={Icon}
                    label={cat.pluralLabel}
                    accentColor={cat.accentColor}
                    onClose={onClose}
                  />
                )
              })}
              <SheetNavItem to="/settings" icon={Settings2} label="Settings" accentColor="var(--color-accent)" onClose={onClose} />
              {user?.role === 'admin' && (
                <SheetNavItem to="/admin" icon={ShieldCheck} label="Admin" accentColor="var(--color-accent)" onClose={onClose} />
              )}
            </div>

            <div className="h-px bg-[var(--color-border)] mb-3" />

            {user && (
              <div className="flex items-center gap-3 px-1 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
                <div className="h-8 w-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[var(--color-accent)]">
                    {user.email?.[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-foreground)] truncate">{user.email}</p>
                  <p className="text-xs text-[var(--color-muted-fg)] capitalize">{user.role}</p>
                </div>
                <button
                  onClick={() => void handleLogout()}
                  className="p-1.5 rounded-md text-[var(--color-muted-fg)] hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                  title="Sign out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function SheetNavItem({
  to,
  icon: Icon,
  label,
  accentColor,
  onClose,
}: {
  to: string
  icon: LucideIcon
  label: string
  accentColor: string
  onClose: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-card)] transition-colors"
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
        style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
      >
        <Icon size={16} />
      </span>
      {label}
    </Link>
  )
}
