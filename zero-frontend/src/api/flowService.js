import { apiFetch, mockDelay } from './client.js'
import { mockFlowTree } from '../lib/mockData.js'

const USE_MOCKS = true // flip to false once the /api/lab/flow endpoints exist

let flowState = JSON.parse(JSON.stringify(mockFlowTree))

// GET /api/lab/flow -> árbol de conversación completo del laboratorio
// (se guarda como JSON en Postgres — ver "estructuras dinámicas" en el doc
// de arquitectura — y se usa para armar el System Prompt dinámico de OpenAI).
export async function getFlow() {
  if (USE_MOCKS) return mockDelay(JSON.parse(JSON.stringify(flowState)))
  return apiFetch('/lab/flow')
}

// PUT /api/lab/flow { tree } -> reemplaza el árbol completo
export async function saveFlow(tree) {
  if (USE_MOCKS) {
    flowState = JSON.parse(JSON.stringify(tree))
    return mockDelay(JSON.parse(JSON.stringify(flowState)), 600)
  }
  return apiFetch('/lab/flow', { method: 'PUT', body: JSON.stringify({ tree }) })
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
