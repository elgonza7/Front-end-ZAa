// Carga de una pantalla: tres puntos dorados que rebotan + bloques
// "fantasma" que insinúan el contenido, en vez de un "Cargando…" suelto.
export default function PageLoader({ label = 'Cargando…', blocks = 3 }) {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <div className="flex items-center justify-center gap-3 py-6">
        <span className="loader-dot" />
        <span className="loader-dot" style={{ animationDelay: '0.15s' }} />
        <span className="loader-dot" style={{ animationDelay: '0.3s' }} />
        <span className="ml-1 text-sm text-[var(--muted)]">{label}</span>
      </div>
      {Array.from({ length: blocks }, (_, index) => (
        <div key={index} className="skeleton h-24 rounded-2xl" style={{ animationDelay: `${index * 0.12}s` }} />
      ))}
    </div>
  )
}
