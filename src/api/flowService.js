import { apiFetch, mockDelay } from './client.js'
import { mockFlowTree } from '../lib/mockData.js'

const USE_MOCKS = false // flip to false once the /api/lab/flow endpoints exist

let flowState = JSON.parse(JSON.stringify(mockFlowTree))

// GET /api/lab/flow -> { tree } con el árbol de conversación completo del
// laboratorio (se guarda como JSON en Postgres y arma el System Prompt
// dinámico de Gemini). Se desempaqueta acá: el resto de la app trabaja
// siempre con el nodo raíz directamente, nunca con el wrapper.
export async function getFlow() {
  if (USE_MOCKS) return mockDelay(JSON.parse(JSON.stringify(flowState)))
  const { tree } = await apiFetch('/lab/flow')
  return tree
}

// PUT /api/lab/flow { tree } -> reemplaza el árbol completo, devuelve { tree }
export async function saveFlow(tree) {
  if (USE_MOCKS) {
    flowState = JSON.parse(JSON.stringify(tree))
    return mockDelay(JSON.parse(JSON.stringify(flowState)), 600)
  }
  const result = await apiFetch('/lab/flow', { method: 'PUT', body: JSON.stringify({ tree }) })
  return result.tree
}

// POST /api/lab/flow/nodes/{nodeId}/image (multipart, campo "file")
export async function uploadNodeImage(file) {
  if (USE_MOCKS) {
    return mockDelay({ url: URL.createObjectURL(file), name: file.name }, 500)
  }
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch('/lab/flow/image', { method: 'POST', body: formData, headers: {} })
}
