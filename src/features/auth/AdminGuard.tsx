import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

export function AdminGuard() {
  const user = useAuth((s) => s.user)

  if (!user || user.role !== 'admin') return <Navigate to="/" replace />

  return <Outlet />
}
