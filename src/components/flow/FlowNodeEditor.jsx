import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Plus, Trash2, Sparkles, Headset, MessageSquare } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import ImageDrop from '../ui/ImageDrop.jsx'
import InfoTooltip from '../ui/InfoTooltip.jsx'
import { improveMessage } from '../../api/aiService.js'

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.round(Math.random() * 9999)}`
}

function emptyNode() {
  return { id: makeId('node'), text: '', image: null, options: [] }
}

// Edita UN nodo del árbol (su mensaje, imagen y la lista de sus ramas
// inmediatas). Ya no se renderiza recursivamente para cada rama hija — para
// editar una rama hija se navega a ella desde el mapa (FlowMap) o con el
// botón "Abrir" de cada fila, y ese nodo pasa a ser el que este mismo
// componente edita (ver FlowNodePanel).
export default function FlowNodeEditor({ node, onChange, allowHandoff = true, label, onOpenChild }) {
  const [improving, setImproving] = useState(false)
  const textareaRef = useRef(null)

  // Auto-crece con el contenido para ver el mensaje completo sin scroll
  // interno — el textarea nunca se achica de menos de ~110px (rows=4).
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [node.text])

  function updateOption(optionId, patch) {
    onChange({
      ...node,
      options: node.options.map((opt) => (opt.id === optionId ? { ...opt, ...patch } : opt)),
    })
  }

  function addBranch(isHandoff = false) {
    const newOption = isHandoff
      ? { id: makeId('opt'), label: '🙋 Hablar con un humano', isHandoff: true, node: null }
      : { id: makeId('opt'), label: 'Nueva opción', node: emptyNode() }
    onChange({ ...node, options: [...node.options, newOption] })
    if (!isHandoff) onOpenChild?.(newOption.id)
  }

  function removeBranch(optionId) {
    onChange({ ...node, options: node.options.filter((opt) => opt.id !== optionId) })
  }

  async function handleImprove() {
    if (!node.text.trim()) return
    setImproving(true)
    try {
      const { text } = await improveMessage(node.text)
      onChange({ ...node, text })
    } finally {
      setImproving(false)
    }
  }

  return (
    <Card className="p-4">
      {label && (
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--accent-soft)]">
          <MessageSquare size={13} />
          {label}
        </div>
      )}

      <div className="flex items-start gap-2">
        <textarea
          ref={textareaRef}
          value={node.text}
          onChange={(event) => onChange({ ...node, text: event.target.value })}
          rows={4}
          placeholder="Texto que enviará el bot en este paso…"
          className="w-full resize-y overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
          style={{ minHeight: 110 }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="px-3 py-1.5 text-xs"
          onClick={handleImprove}
          disabled={improving || !node.text.trim()}
        >
          <Sparkles size={13} />
          {improving ? 'Mejorando…' : 'Mejorar con IA'}
        </Button>
        <InfoTooltip text='Corrige ortografía y prolija el tono de este mensaje con IA (Gemini), sin cambiar su significado. No reemplaza tu revisión — siempre podés editar el resultado.' />
      </div>

      <div className="mt-3">
        <ImageDrop
          value={node.image}
          label="Imagen adjunta (opcional)"
          height={110}
          onSelect={(file) => onChange({ ...node, image: URL.createObjectURL(file) })}
          onRemove={() => onChange({ ...node, image: null })}
        />
      </div>

      {node.options.length > 0 && (
        <div className="mt-4 space-y-2 border-l-2 border-[var(--border)] pl-4">
          {node.options.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            >
              {option.isHandoff ? (
                <Headset size={16} className="shrink-0 text-[var(--accent)]" />
              ) : (
                <MessageSquare size={16} className="shrink-0 text-[var(--muted)]" />
              )}

              <input
                type="text"
                value={option.label}
                onChange={(event) => updateOption(option.id, { label: event.target.value })}
                placeholder="Texto del botón"
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-strong)] outline-none placeholder:text-[var(--muted)]/60"
              />

              {option.isHandoff && <Badge variant="gold">Atención humana</Badge>}

              {!option.isHandoff && (
                <button
                  type="button"
                  onClick={() => onOpenChild?.(option.id)}
                  className="shrink-0 text-[var(--muted)] hover:text-[var(--accent)]"
                  aria-label="Abrir esta rama"
                  title="Editar esta rama"
                >
                  <ArrowUpRight size={16} />
                </button>
              )}

              <button
                type="button"
                onClick={() => removeBranch(option.id)}
                className="shrink-0 text-[var(--muted)] hover:text-red-400"
                aria-label="Eliminar rama"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="px-3 py-1.5 text-xs" onClick={() => addBranch(false)}>
          <Plus size={13} />
          Agregar rama
        </Button>
        {allowHandoff && !node.options.some((opt) => opt.isHandoff) && (
          <Button type="button" variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => addBranch(true)}>
            <Headset size={13} />
            Agregar "Hablar con un humano"
          </Button>
        )}
      </div>
    </Card>
  )
}
