// El color semántico (rojo/ámbar/verde) vive en el fondo y el borde — el
// texto va siempre en --text-strong (blanco en oscuro, negro en claro) para
// que se lea bien en los dos temas, en vez de texto coloreado sobre un tinte
// del mismo color, que en claro queda lavado y poco legible.
const VARIANTS = {
  success: 'bg-emerald-500/15 text-[var(--text-strong)] border-emerald-500/40',
  danger: 'bg-red-500/15 text-[var(--text-strong)] border-red-500/40',
  warning: 'bg-amber-500/15 text-[var(--text-strong)] border-amber-500/40',
  gold: 'bg-[var(--accent)]/15 text-[var(--text-strong)] border-[var(--accent)]/40',
  neutral: 'bg-[var(--border)]/40 text-[var(--muted)] border-[var(--border)]',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
