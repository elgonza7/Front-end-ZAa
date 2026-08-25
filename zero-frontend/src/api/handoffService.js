import { apiFetch, mockDelay } from './client.js'
import { mockHandoffQueue } from '../lib/mockData.js'

const USE_MOCKS = true // flip to false once the /api/lab/handoff endpoints exist

let queueState = [...mockHandoffQueue]

// GET /api/lab/handoff -> conversaciones donde el paciente pidió "hablar con
// un humano" y el bot dejó de responder automáticamente hasta que un
// empleado del laboratorio tome la conversación.
export async function getHandoffQueue() {
  if (USE_MOCKS) return mockDelay([...queueState])
  return apiFetch('/lab/handoff')
}

// POST /api/lab/handoff/{conversationId}/claim -> un empleado toma la conversación
export async function claimConversation(conversationId) {
  if (USE_MOCKS) {
    queueState = queueState.filter((conv) => conv.id !== conversationId)
    return mockDelay({ id: conversationId, claimed: true })
  }
  return apiFetch(`/lab/handoff/${conversationId}/claim`, { method: 'POST' })
}
