import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { AddContentFAB } from '@/features/content/components/add/AddContentFAB'

export function AppShell() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <AddContentFAB />
    </div>
  )
}
