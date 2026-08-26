import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, LogOut, UserCircle2 } from 'lucide-react'
import Sidebar from './Sidebar.jsx'
import { logout } from '../../api/authService.js'

export default function DashboardLayout({ navItems, title, subtitle, userLabel, headerActions, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-[#0d1117]">
      <Sidebar items={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#30363d] bg-[#0d1117]/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-[#8b949e] hover:text-white lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-white">{title}</h1>
              {subtitle && <p className="truncate text-xs text-[#8b949e]">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {headerActions}
            <div className="hidden items-center gap-2 rounded-xl border border-[#30363d] bg-[#161b22] px-3 py-1.5 sm:flex">
              <UserCircle2 size={18} className="text-[#F8B500]" />
              <span className="text-sm text-white">{userLabel}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-[#30363d] px-3 py-1.5 text-sm text-[#8b949e] transition-colors hover:border-red-500/40 hover:text-red-400"
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
