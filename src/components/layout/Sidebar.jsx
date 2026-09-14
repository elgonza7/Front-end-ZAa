import { NavLink, Link } from 'react-router-dom'
import { X } from 'lucide-react'
import Logo from '../ui/Logo.jsx'

export default function Sidebar({ items, open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/">
            <Logo size={32} />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--text-strong)] lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {items.map(({ label, to, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--accent)]/20 to-transparent text-[var(--accent)] border border-[var(--accent)]/30'
                    : 'text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--text-strong)] border border-transparent'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              {!!badge && (
                <span className="relative flex h-5 min-w-5 shrink-0 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-[var(--text-strong)]">
                    {badge}
                  </span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[var(--border)] px-5 py-4">
          <Link to="/legal#terminos" className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--text-strong)]">
            Términos y condiciones
          </Link>
          <p className="mt-2 text-xs text-[var(--muted)]">© {new Date().getFullYear()} ZeroAutoapp</p>
        </div>
      </aside>
    </>
  )
}
