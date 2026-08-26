import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Maximize2, Minimize2, ArrowLeft } from 'lucide-react'
import FlowNodeEditor from './FlowNodeEditor.jsx'

// Panel para editar UN nodo del árbol, elegido en el mapa (FlowMap). Por
// default es un panel lateral; "Pantalla completa" lo expande a todo el
// viewport con un botón "Volver" fijo arriba a la izquierda que solo cambia
// de modo (no cierra el panel — cerrar es la X). Portal a <body>, mismo
// motivo que Modal.jsx: el header del dashboard usa backdrop-blur, que
// rompería el centrado/posicionamiento de un position:fixed si quedara
// anidado adentro.
export default function FlowNodePanel({ node, label, allowHandoff, onChange, onOpenChild, onClose }) {
  const [fullscreen, setFullscreen] = useState(false)

  if (!node) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div
        className={`absolute flex flex-col border-[#30363d] bg-[#161b22] shadow-2xl ${
          fullscreen ? 'inset-0' : 'inset-y-0 right-0 w-full max-w-lg border-l'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#30363d] px-5 py-4">
          {fullscreen ? (
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="flex items-center gap-1.5 text-sm font-medium text-[#8b949e] hover:text-white"
            >
              <ArrowLeft size={16} />
              Volver
            </button>
          ) : (
            <h2 className="text-sm font-semibold text-white">Editar rama</h2>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFullscreen((prev) => !prev)}
              className="text-[#8b949e] hover:text-white"
              aria-label={fullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
              title={fullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
            >
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button type="button" onClick={onClose} className="text-[#8b949e] hover:text-white" aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className={fullscreen ? 'mx-auto max-w-2xl' : ''}>
            <FlowNodeEditor
              node={node}
              onChange={onChange}
              allowHandoff={allowHandoff}
              label={label}
              onOpenChild={onOpenChild}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
