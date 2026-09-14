import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// Rendered via portal into <body> so `position: fixed` always measures against
// the real viewport — a `backdrop-blur`/`filter` ancestor (e.g. the sticky
// dashboard header) would otherwise turn it into the fixed element's
// containing block and break centering.
export default function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
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
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
