import { useMemo, useState } from 'react'
import { Headset, MessageSquare } from 'lucide-react'

const COL_WIDTH = 236
const ROW_HEIGHT = 68
const BOX_WIDTH = 196
const BOX_HEIGHT = 52

// Aplana el árbol en cajas posicionadas por nivel (columna = profundidad) y
// hermanos (fila), con las líneas padre→hijo. Layout tipo dendrograma: las
// hojas se apilan de arriba a abajo y cada nodo padre queda centrado frente a
// sus hijos — sin librería de diagramas, todo con posiciones absolutas + SVG.
function computeLayout(tree) {
  const boxes = []
  const edges = []
  let nextRow = 0

  function visit(node, path, depth, label, isRoot) {
    const options = node?.options ?? []
    let y

    if (options.length === 0) {
      y = nextRow * ROW_HEIGHT
      nextRow += 1
    } else {
      // Edges propios de este nivel, en un array local: como visit() es
      // recursivo, no podemos ubicarlos por posición en el array `edges`
      // global (las llamadas anidadas ya empujaron ahí las suyas). Recién
      // sabemos y1 (la posición del padre) después de procesar los hijos.
      const directEdges = []
      const childYs = options.map((option) => {
        const childPath = [...path, option.id]
        const childDepth = depth + 1
        let childY

        if (option.isHandoff || !option.node) {
          childY = nextRow * ROW_HEIGHT
          nextRow += 1
          boxes.push({
            id: option.id,
            path: childPath,
            depth: childDepth,
            y: childY,
            label: option.label,
            kind: 'handoff',
          })
        } else {
          childY = visit(option.node, childPath, childDepth, option.label, false)
        }

        directEdges.push({ x1: depth, y1: null, x2: childDepth, y2: childY })
        return childY
      })
      y = (Math.min(...childYs) + Math.max(...childYs)) / 2
      directEdges.forEach((edge) => {
        edge.y1 = y
      })
      edges.push(...directEdges)
    }

    boxes.push({
      id: node.id,
      path,
      depth,
      y,
      label: isRoot ? 'Mensaje de bienvenida' : label,
      kind: isRoot ? 'root' : 'node',
      node,
    })
    return y
  }

  visit(tree, [], 0, undefined, true)
  const maxDepth = Math.max(...boxes.map((box) => box.depth))
  const height = nextRow * ROW_HEIGHT
  const width = (maxDepth + 1) * COL_WIDTH
  return { boxes, edges, width, height }
}

function previewText(box) {
  if (box.kind === 'handoff') return 'Deriva la conversación a atención humana — el bot deja de responder automáticamente.'
  const text = box.node?.text?.trim()
  return text ? text : 'Todavía no tiene mensaje escrito.'
}

export default function FlowMap({ tree, selectedPath, onSelect }) {
  const { boxes, edges, width, height } = useMemo(() => computeLayout(tree), [tree])
  const [hoveredId, setHoveredId] = useState(null)
  const hoveredBox = boxes.find((box) => box.id === hoveredId)

  return (
    <div className="relative overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6">
      <div className="relative" style={{ width: width + 40, height: height + BOX_HEIGHT + 20 }}>
        <svg className="absolute left-0 top-0" width={width + 40} height={height + BOX_HEIGHT + 20}>
          {edges.map((edge, index) => {
            const x1 = edge.x1 * COL_WIDTH + BOX_WIDTH
            const x2 = edge.x2 * COL_WIDTH
            const y1 = edge.y1 + BOX_HEIGHT / 2
            const y2 = edge.y2 + BOX_HEIGHT / 2
            const midX = (x1 + x2) / 2
            return (
              <path
                key={index}
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="var(--border)"
                strokeWidth={2}
              />
            )
          })}
        </svg>

        {boxes.map((box) => {
          const isSelected = selectedPath != null && selectedPath.join('/') === box.path.join('/')
          const isHandoff = box.kind === 'handoff'
          return (
            <button
              key={box.id}
              type="button"
              onClick={() => {
                if (!isHandoff) onSelect(box.path)
              }}
              onMouseEnter={() => setHoveredId(box.id)}
              onMouseLeave={() => setHoveredId((prev) => (prev === box.id ? null : prev))}
              onFocus={() => setHoveredId(box.id)}
              onBlur={() => setHoveredId((prev) => (prev === box.id ? null : prev))}
              className={`absolute flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs shadow-sm transition-colors ${
                isHandoff
                  ? 'cursor-default border-[var(--accent)]/30 bg-[var(--accent)]/5 text-[var(--accent-soft)]'
                  : isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-strong)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)]/60'
              }`}
              style={{ left: box.depth * COL_WIDTH, top: box.y, width: BOX_WIDTH, minHeight: BOX_HEIGHT }}
            >
              {isHandoff ? <Headset size={14} className="shrink-0" /> : <MessageSquare size={14} className="shrink-0 text-[var(--accent)]" />}
              <span className="line-clamp-2 leading-snug">{box.label}</span>
            </button>
          )
        })}

        {hoveredBox && (
          <div
            className="pointer-events-none absolute z-30 w-64 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs leading-relaxed text-[var(--text)] shadow-2xl"
            style={{ left: hoveredBox.depth * COL_WIDTH, top: hoveredBox.y + BOX_HEIGHT + 6 }}
          >
            {previewText(hoveredBox)}
          </div>
        )}
      </div>
    </div>
  )
}
