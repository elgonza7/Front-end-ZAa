import { AlertTriangle, RefreshCw } from 'lucide-react'
import Card from './Card.jsx'
import Button from './Button.jsx'

// Estado de error de una pantalla que no pudo cargar sus datos — evita el
// "Cargando…" eterno cuando la API falla y deja reintentar sin recargar.
export default function ErrorState({ message, onRetry }) {
  return (
    <Card className="flex flex-col items-center gap-3 p-10 text-center" role="alert">
      <AlertTriangle size={32} className="text-red-400" />
      <p className="text-base font-semibold text-[var(--text-strong)]">No pudimos cargar esta pantalla</p>
      <p className="max-w-md text-sm text-[var(--muted)]">
        {message || 'Revisá tu conexión a internet e intentá de nuevo.'}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw size={15} /> Reintentar
        </Button>
      )}
    </Card>
  )
}
