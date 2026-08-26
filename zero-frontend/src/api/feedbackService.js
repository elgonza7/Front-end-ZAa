import { apiFetch, mockDelay } from './client.js'
import { mockFeedback } from '../lib/mockData.js'

const USE_MOCKS = true // flip to false once the /api/*/feedback endpoints exist

let feedbackState = mockFeedback.map((item) => ({ ...item }))

// POST /api/lab/feedback { category, subject, message } -> queja/sugerencia del laboratorio
export async function submitFeedback({ labName, category, subject, message }) {
  if (USE_MOCKS) {
    const entry = {
      id: `fb_${Date.now()}`,
      labName,
      category,
      subject,
      message,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    }
    feedbackState = [entry, ...feedbackState]
    return mockDelay(entry, 500)
  }
  return apiFetch('/lab/feedback', {
    method: 'POST',
    body: JSON.stringify({ category, subject, message }),
  })
}

// GET /api/admin/feedback -> todos los reportes de todos los laboratorios
export async function getFeedback() {
  if (USE_MOCKS) return mockDelay(feedbackState.map((item) => ({ ...item })))
  return apiFetch('/admin/feedback')
}

// PATCH /api/admin/feedback/{id} { status: "RESOLVED" }
export async function resolveFeedback(id) {
  if (USE_MOCKS) {
    feedbackState = feedbackState.map((item) => (item.id === id ? { ...item, status: 'RESOLVED' } : item))
    return mockDelay(feedbackState.find((item) => item.id === id))
  }
  return apiFetch(`/admin/feedback/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'RESOLVED' }) })
}
