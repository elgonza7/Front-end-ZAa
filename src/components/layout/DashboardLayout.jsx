import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, LogOut, UserCircle2 } from 'lucide-react'
import Sidebar from './Sidebar.jsx'
import ThemeToggle from '../ui/ThemeToggle.jsx'
import { logout } from '../../api/authService.js'

export default function DashboardLayout({ navItems, title, subtitle, userLabel, headerActions, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar items={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg)]/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-[var(--muted)] hover:text-[var(--text-strong)] lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-[var(--text-strong)]">{title}</h1>
              {subtitle && <p className="truncate text-xs text-[var(--muted)]">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {headerActions}
            <ThemeToggle />
            <div className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 sm:flex">
              <UserCircle2 size={18} className="text-[var(--accent)]" />
              <span className="text-sm text-[var(--text-strong)]">{userLabel}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:border-red-500/40 hover:text-red-400"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-5 py-6">{children}</main>
      </div>
    </div>
  )
}
