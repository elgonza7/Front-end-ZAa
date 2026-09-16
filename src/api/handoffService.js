import { apiFetch, mockDelay } from './client.js'
import { mockHandoffQueue } from '../lib/mockData.js'

const USE_MOCKS = false // flip to false once the /api/lab/handoff endpoints exist

let queueState = [...mockHandoffQueue]

// GET /api/lab/handoff -> dos tipos de ticket mezclados, distinguibles por
// "reason": "HumanRequested" (el paciente pidió hablar con un humano, el bot
// dejó de responderle hasta que un empleado tome la conversación) y
// "ResultsRequest" (el paciente pidió su resultado y ya dio nombre + DNI —
// el bot sigue respondiendo normal, esto solo avisa a quién hay que
// enviarle el resultado).
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
