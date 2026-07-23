import { useState, useEffect, useCallback } from 'react'
import { Trash2, RotateCcw, UserPlus, ShieldCheck, User } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/features/auth/useAuth'

interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
  itemCount: number
}

export function AdminScreen() {
  const currentUser = useAuth((s) => s.user)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    try {
      const data = await api.get<AdminUser[]>('/api/admin/users')
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault()
    setAddError(null)
    setAdding(true)
    try {
      await api.post('/api/admin/users', { email: newEmail, password: newPassword, role: newRole })
      setNewEmail('')
      setNewPassword('')
      setNewRole('user')
      setShowAddForm(false)
      await loadUsers()
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setAdding(false)
    }
  }

  async function handleRoleToggle(user: AdminUser) {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    try {
      await api.put(`/api/admin/users/${user.id}`, { role: newRole })
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update role')
    }
  }

  async function handlePurgeItems(user: AdminUser) {
    if (!confirm(`Purge all ${user.itemCount} items for ${user.email}? This cannot be undone.`)) return
    try {
      await api.delete(`/api/admin/users/${user.id}/items`)
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, itemCount: 0 } : u)))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to purge items')
    }
  }

  async function handleDeleteUser(user: AdminUser) {
    if (!confirm(`Delete ${user.email} and all their data? This cannot be undone.`)) return
    try {
      await api.delete(`/api/admin/users/${user.id}`)
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error) {
    return <p className="p-8 text-red-500">{error}</p>
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">User Management</h1>
          <p className="text-sm text-[var(--color-muted-fg)] mt-0.5">{users.length} user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <UserPlus size={15} />
          Add user
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddUser} className="mb-6 p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-[var(--color-foreground)]">New user</h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="email"
              placeholder="Email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <input
              type="password"
              placeholder="Password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[var(--color-foreground)] cursor-pointer">
              <input type="radio" name="role" value="user" checked={newRole === 'user'} onChange={() => setNewRole('user')} />
              User
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--color-foreground)] cursor-pointer">
              <input type="radio" name="role" value="admin" checked={newRole === 'admin'} onChange={() => setNewRole('admin')} />
              Admin
            </label>
          </div>
          {addError && <p className="text-sm text-red-500">{addError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {adding ? 'Creating…' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {users.map((user) => {
          const isSelf = user.id === currentUser?.userId
          return (
            <div
              key={user.id}
              className="flex items-center gap-4 px-5 py-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-foreground)] truncate">{user.email}</span>
                  {isSelf && <span className="text-xs text-[var(--color-muted-fg)]">(you)</span>}
                </div>
                <p className="text-xs text-[var(--color-muted-fg)] mt-0.5">
                  {user.itemCount} item{user.itemCount !== 1 ? 's' : ''} · joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {/* Role badge / toggle */}
                <button
                  onClick={() => { if (!isSelf) void handleRoleToggle(user) }}
                  disabled={isSelf}
                  title={isSelf ? 'Cannot change your own role' : `Switch to ${user.role === 'admin' ? 'user' : 'admin'}`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-background)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {user.role === 'admin' ? <ShieldCheck size={13} /> : <User size={13} />}
                  {user.role}
                </button>

                {/* Purge items */}
                <button
                  onClick={() => void handlePurgeItems(user)}
                  disabled={user.itemCount === 0}
                  title="Purge all items"
                  className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-muted-fg)] hover:text-amber-500 hover:border-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCcw size={14} />
                </button>

                {/* Delete user */}
                <button
                  onClick={() => void handleDeleteUser(user)}
                  disabled={isSelf}
                  title={isSelf ? 'Cannot delete your own account' : 'Delete user'}
                  className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-muted-fg)] hover:text-red-500 hover:border-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
