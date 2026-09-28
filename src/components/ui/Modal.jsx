import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// Rendered via portal into <body> so `position: fixed` always measures against
// the real viewport — a `backdrop-blur`/`filter` ancestor (e.g. the sticky
// dashboard header) would otherwise turn it into the fixed element's
// containing block and break centering.
const MAX_WIDTH = {
  md: 'max-w-lg',
  lg: 'max-w-3xl',
}

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div
        className={`relative flex max-h-[85vh] w-full ${MAX_WIDTH[size] ?? MAX_WIDTH.md} flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl`}
      >
        <div className="flex shrink-0 items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--text-strong)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--text-strong)]"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
