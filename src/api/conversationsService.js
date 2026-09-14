import { apiFetch } from './client.js'

// GET /api/lab/conversations -> resumen de cada charla que le llegó al bot
// (para laboratorios con conexión Manual, que de otra forma no tienen dónde
// ver los mensajes — a diferencia de Coexistence, donde ya los ven en su
// propio WhatsApp Business).
export async function getConversations() {
  return apiFetch('/lab/conversations')
}

// GET /api/lab/conversations/{conversationId}/messages -> historial completo de una charla
export async function getConversationMessages(conversationId) {
  return apiFetch(`/lab/conversations/${encodeURIComponent(conversationId)}/messages`)
}
