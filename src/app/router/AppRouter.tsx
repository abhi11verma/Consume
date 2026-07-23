import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/features/layout/AppShell'
import { HomeScreen } from '@/features/content/screens/HomeScreen'
import { CategoryScreen } from '@/features/content/screens/CategoryScreen'
import { ShareTargetScreen } from '@/features/content/screens/ShareTargetScreen'
import { LoginScreen } from '@/features/auth/LoginScreen'
import { AuthGuard } from '@/features/auth/AuthGuard'
import { AdminGuard } from '@/features/auth/AdminGuard'
import { AdminScreen } from '@/features/admin/AdminScreen'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />

      <Route element={<AuthGuard />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/videos" element={<CategoryScreen type="video" />} />
          <Route path="/books" element={<CategoryScreen type="book" />} />
          <Route path="/articles" element={<CategoryScreen type="article" />} />
          <Route path="/podcasts" element={<CategoryScreen type="podcast" />} />
          <Route path="/news" element={<CategoryScreen type="news" />} />
          <Route path="/share-target" element={<ShareTargetScreen />} />

          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminScreen />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
