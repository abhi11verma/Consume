import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/features/layout/AppShell'
import { HomeScreen } from '@/features/content/screens/HomeScreen'
import { AllScreen } from '@/features/content/screens/AllScreen'
import { CategoryScreen } from '@/features/content/screens/CategoryScreen'
import { ShareTargetScreen } from '@/features/content/screens/ShareTargetScreen'
import { LoginScreen } from '@/features/auth/LoginScreen'
import { AuthGuard } from '@/features/auth/AuthGuard'
import { AdminGuard } from '@/features/auth/AdminGuard'
import { AdminScreen } from '@/features/admin/AdminScreen'
import { SettingsScreen } from '@/features/settings/SettingsScreen'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />

      <Route element={<AuthGuard />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/all" element={<AllScreen />} />
          <Route path="/c/:slug" element={<CategoryScreen />} />

          {/* Legacy redirects for old hard-coded routes */}
          <Route path="/videos" element={<Navigate to="/c/video" replace />} />
          <Route path="/books" element={<Navigate to="/c/book" replace />} />
          <Route path="/articles" element={<Navigate to="/c/article" replace />} />
          <Route path="/podcasts" element={<Navigate to="/c/podcast" replace />} />
          <Route path="/news" element={<Navigate to="/c/news" replace />} />

          <Route path="/share-target" element={<ShareTargetScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />

          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminScreen />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
