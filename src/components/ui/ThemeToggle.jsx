import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { getTheme, setTheme } from '../../lib/theme.js'

export default function ThemeToggle() {
  const [theme, setThemeState] = useState(getTheme())

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
