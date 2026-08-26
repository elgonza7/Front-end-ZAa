import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2, Sparkles, Headset, MessageSquare } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import ImageDrop from '../ui/ImageDrop.jsx'
import { improveMessage } from '../../api/aiService.js'

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.round(Math.random() * 9999)}`
}

function emptyNode() {
  return { id: makeId('node'), text: '', image: null, options: [] }
}

export default function FlowNodeEditor({ node, onChange, depth = 0, allowHandoff = true, label }) {
  const [expandedIds, setExpandedIds] = useState(() => new Set(node.options.map((o) => o.id)))
  const [improving, setImproving] = useState(false)

  function toggleExpanded(optionId) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(optionId) ? next.delete(optionId) : next.add(optionId)
      return next
    })
  }

  function updateOption(optionId, patch) {
    onChange({
      ...node,
      options: node.options.map((opt) => (opt.id === optionId ? { ...opt, ...patch } : opt)),
    })
  }

  function updateChildNode(optionId, childNode) {
    updateOption(optionId, { node: childNode })
  }

  function addBranch(isHandoff = false) {
    const newOption = isHandoff
      ? { id: makeId('opt'), label: '🙋 Hablar con un humano', isHandoff: true, node: null }
      : { id: makeId('opt'), label: 'Nueva opción', node: emptyNode() }
    onChange({ ...node, options: [...node.options, newOption] })
    if (!isHandoff) setExpandedIds((prev) => new Set(prev).add(newOption.id))
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
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#e3c065]">
          <MessageSquare size={13} />
          {label}
        </div>
      )}

      <div className="flex items-start gap-2">
        <textarea
          value={node.text}
          onChange={(event) => onChange({ ...node, text: event.target.value })}
          rows={3}
          placeholder="Texto que enviará el bot en este paso…"
          className="w-full resize-none rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
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
        <div className="mt-4 space-y-3 border-l-2 border-[#30363d] pl-4">
          {node.options.map((option) => (
            <div key={option.id}>
              <div className="flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-2">
                {option.isHandoff ? (
                  <Headset size={16} className="shrink-0 text-[#F8B500]" />
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(option.id)}
                    className="shrink-0 text-[#8b949e] hover:text-white"
                    aria-label="Expandir rama"
                  >
                    {expandedIds.has(option.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}

                <input
                  type="text"
                  value={option.label}
                  onChange={(event) => updateOption(option.id, { label: event.target.value })}
                  placeholder="Texto del botón"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#8b949e]/60"
                />

                {option.isHandoff && <Badge variant="gold">Atención humana</Badge>}

                <button
                  type="button"
                  onClick={() => removeBranch(option.id)}
                  className="shrink-0 text-[#8b949e] hover:text-red-400"
                  aria-label="Eliminar rama"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {!option.isHandoff && expandedIds.has(option.id) && (
                <div className="mt-3">
                  <FlowNodeEditor
                    node={option.node}
                    onChange={(childNode) => updateChildNode(option.id, childNode)}
                    depth={depth + 1}
                    allowHandoff={allowHandoff}
                  />
                </div>
              )}
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
