import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Maximize2, Minimize2, ArrowLeft, Pencil } from 'lucide-react'
import Button from '../ui/Button.jsx'
import FlowNodeEditor from './FlowNodeEditor.jsx'
import FlowNodePreview from './FlowNodePreview.jsx'

// Panel para ver/editar UN nodo del árbol, elegido en el mapa (FlowMap).
// Arranca siempre en modo lectura (FlowNodePreview) — entrar a un nodo no
// significa que ya se puede escribir encima, hay que tocar "Editar" a
// propósito primero (arriba a la derecha). Por default es un panel lateral;
// "Pantalla completa" lo expande a todo el viewport con un botón "Volver"
// fijo arriba a la izquierda que solo cambia de modo (no cierra el panel —
// cerrar es la X). Portal a <body>, mismo motivo que Modal.jsx: el header
// del dashboard usa backdrop-blur, que rompería el centrado/posicionamiento
// de un position:fixed si quedara anidado adentro.
export default function FlowNodePanel({ node, label, allowHandoff, onChange, onOpenChild, onClose, currentLabel, onRenameSelf, onDeleteSelf }) {
  const [fullscreen, setFullscreen] = useState(false)
  const [editing, setEditing] = useState(false)

  // Si cambiás de rama sin cerrar el panel (ej. tocando una rama hija desde
  // el preview), siempre se vuelve a arrancar en modo lectura — editar una
  // rama no debería dejar la siguiente que abrís ya en modo edición.
  const [lastNodeId, setLastNodeId] = useState(node?.id)
  if (node && node.id !== lastNodeId) {
    setLastNodeId(node.id)
    setEditing(false)
  }

  if (!node) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div
        className={`absolute flex flex-col border-[var(--border)] bg-[var(--surface)] shadow-2xl ${
          fullscreen ? 'inset-0' : 'inset-y-0 right-0 w-full max-w-lg border-l'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-5 py-4">
          {fullscreen ? (
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--text-strong)]"
            >
              <ArrowLeft size={16} />
              Volver
            </button>
          ) : (
            <h2 className="text-sm font-semibold text-[var(--text-strong)]">{editing ? 'Editar rama' : 'Vista previa'}</h2>
          )}

          <div className="flex items-center gap-3">
            {!editing && (
              <Button type="button" onClick={() => setEditing(true)} className="px-3.5 py-1.5 text-xs">
                <Pencil size={14} />
                Editar
              </Button>
            )}
            <button
              type="button"
              onClick={() => setFullscreen((prev) => !prev)}
              className="text-[var(--muted)] hover:text-[var(--text-strong)]"
              aria-label={fullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
              title={fullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
            >
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button type="button" onClick={onClose} className="text-[var(--muted)] hover:text-[var(--text-strong)]" aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className={fullscreen ? 'mx-auto max-w-2xl' : ''}>
            {editing ? (
              <FlowNodeEditor
                node={node}
                onChange={onChange}
                allowHandoff={allowHandoff}
                label={label}
                onOpenChild={onOpenChild}
                currentLabel={currentLabel}
                onRenameSelf={onRenameSelf}
                onDeleteSelf={onDeleteSelf}
              />
            ) : (
              <FlowNodePreview node={node} label={label} onOpenChild={onOpenChild} />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
