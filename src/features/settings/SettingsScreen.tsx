import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DataActions } from '@/features/content/components/DataActions'
import { ThemeToggle } from '@/features/theme/ThemeToggle'
import { useAuth } from '@/features/auth/useAuth'

export function SettingsScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="px-4 py-4 md:px-8 md:py-8 max-w-lg"
    >
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="md:hidden flex items-center justify-center h-9 w-9 -ml-1 rounded-full hover:bg-[var(--color-surface)] transition-colors text-[var(--color-muted-fg)]"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--color-foreground)]">Settings</h1>
      </div>

      {user && (
        <SettingsSection label="Account">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="h-9 w-9 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[var(--color-accent)]">
                {user.email?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-foreground)] truncate">{user.email}</p>
              <p className="text-xs text-[var(--color-muted-fg)] capitalize">{user.role}</p>
            </div>
          </div>
        </SettingsSection>
      )}

      <SettingsSection label="Appearance">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-[var(--color-foreground)]">Theme</span>
          <ThemeToggle />
        </div>
      </SettingsSection>

      <SettingsSection label="Data">
        <DataActions />
      </SettingsSection>
    </motion.div>
  )
}

function SettingsSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2 px-1">
        {label}
      </h2>
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        {children}
      </div>
    </section>
  )
}
