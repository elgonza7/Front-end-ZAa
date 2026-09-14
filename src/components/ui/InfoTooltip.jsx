import { useState } from 'react'
import { Info } from 'lucide-react'

// Ícono "i" chico que muestra una explicación corta al pasar el mouse (o al
// tocarlo, para pantallas táctiles). Para instrucciones más largas usar
// HelpButton en vez de este componente.
export default function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false)

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((prev) => !prev)}
        className="text-[var(--muted)] hover:text-[var(--accent)]"
        aria-label="Más información"
      >
        <Info size={14} />
      </button>
      {open && (
        <span className="absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5 text-xs leading-relaxed text-[var(--text)] shadow-xl">
          {text}
        </span>
      )}
    </span>
  )
}
