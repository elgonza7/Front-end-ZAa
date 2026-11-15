import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { ToastContext } from '../../lib/toastContext.js'

const DURATION_MS = 4000

// Avisos breves ("Guardado ✓", "No se pudo guardar") para dar feedback
// uniforme a cualquier acción sin que cada pantalla invente el suyo.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(
    (message, variant = 'success') => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, message, variant }])
      timers.current.set(id, setTimeout(() => dismiss(id), DURATION_MS))
    },
    [dismiss],
  )

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => clearTimeout(timer))
  }, [])

  const api = useMemo(
    () => ({
      success: (message) => show(message, 'success'),
      error: (message) => show(message, 'error'),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map(({ id, message, variant }) => (
          <div
            key={id}
            role={variant === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-strong)] shadow-xl ${
              variant === 'error' ? 'border-red-500/50' : 'border-emerald-500/40'
            }`}
          >
            {variant === 'error' ? (
              <AlertTriangle size={17} className="mt-0.5 shrink-0 text-red-400" />
            ) : (
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-400" />
            )}
            <span className="flex-1">{message}</span>
            <button
              type="button"
              onClick={() => dismiss(id)}
              className="text-[var(--muted)] hover:text-[var(--text-strong)]"
              aria-label="Cerrar aviso"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
