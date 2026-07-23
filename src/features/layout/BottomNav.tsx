import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Video, Plus, BookOpen, MoreHorizontal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAddContent } from '@/features/content/context/AddContentContext'
import { MobileMenuSheet } from './MobileMenuSheet'

export function BottomNav() {
  const { open } = useAddContent()
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--color-surface)] border-t border-[var(--color-border)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex h-16 items-stretch">
          <BottomNavItem to="/" icon={Home} label="Home" />
          <BottomNavItem to="/videos" icon={Video} label="Videos" />

          {/* Center add button */}
          <button
            onClick={() => open()}
            className="flex flex-1 flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-md">
              <Plus size={20} />
            </div>
          </button>

          <BottomNavItem to="/books" icon={BookOpen} label="Books" />

          {/* More → opens sheet */}
          <button
            onClick={() => setSheetOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-1 cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <MoreHorizontal size={20} />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </nav>

      <MobileMenuSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  )
}

function BottomNavItem({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors',
          isActive
            ? 'text-[var(--color-accent)]'
            : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]',
        )
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  )
}
