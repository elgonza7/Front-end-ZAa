import { ArrowRight, Headset, ImageIcon, MessageSquare } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'

// Vista de solo lectura de un nodo: lo que ve el laboratorio al hacer click
// en una caja del mapa, ANTES de entrar a editar. A propósito no tiene ni un
// input ni un textarea — es una lectura rápida y prolija del mensaje y sus
// ramas, sin el ruido visual de un formulario completo. "Editar" (en
// FlowNodePanel, arriba a la derecha) es lo que lleva a FlowNodeEditor.
export default function FlowNodePreview({ node, label, onOpenChild }) {
  return (
    <div className="space-y-5">
      {label && (
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-soft)]">
          <MessageSquare size={13} />
          {label}
        </div>
      )}

      <Card className="p-5">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-strong)]">
          {node.text || <span className="text-[var(--muted)]">(sin mensaje todavía)</span>}
        </p>

        {node.image && (
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
            <img src={node.image} alt="Imagen adjunta" className="max-h-64 w-full object-contain" />
          </div>
        )}
        {!node.image && (
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
            <ImageIcon size={12} /> Sin imagen adjunta
          </p>
        )}
      </Card>

      {node.options.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-[var(--muted)]">
            {node.options.length === 1 ? '1 rama' : `${node.options.length} ramas`}
          </p>
          <div className="space-y-2">
            {node.options.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={option.isHandoff}
                onClick={() => onOpenChild?.(option.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-left text-sm transition-colors ${
                  option.isHandoff ? 'cursor-default' : 'hover:border-[var(--accent)]'
                }`}
              >
                {option.isHandoff ? (
                  <Headset size={15} className="shrink-0 text-[var(--accent)]" />
                ) : (
                  <MessageSquare size={15} className="shrink-0 text-[var(--muted)]" />
                )}
                <span className="min-w-0 flex-1 truncate text-[var(--text-strong)]">{option.label}</span>
                {option.isHandoff ? (
                  <Badge variant="gold">Atención humana</Badge>
                ) : (
                  <ArrowRight size={14} className="shrink-0 text-[var(--muted)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
