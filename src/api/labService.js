import { apiFetch, mockDelay } from './client.js'
import {
  mockLabProfile,
  mockKnowledgeDocs,
  mockTokenUsageHistory,
  mockFaqRanking,
} from '../lib/mockData.js'

const USE_MOCKS = false // flip to false once the /api/lab/* endpoints exist

// Mutable copy so edits made across Settings/WhatsApp/Flow pages persist for
// the lifetime of the mock session instead of resetting on every fetch.
let profileState = { ...mockLabProfile }

// GET /api/lab/me -> current laboratory profile (JWT-scoped by LaboratorioId)
export async function getLabProfile() {
  if (USE_MOCKS) return mockDelay({ ...profileState })
  return apiFetch('/lab/me')
}

// PATCH /api/lab/bot { active: boolean } -> toggles IsBotActive
export async function toggleBot(active) {
  if (USE_MOCKS) {
    profileState = { ...profileState, botActive: active }
    return mockDelay({ ...profileState })
  }
  return apiFetch('/lab/bot', {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  })
}

// PUT /api/lab/welcome-message { message: string }
export async function updateWelcomeMessage(message) {
  if (USE_MOCKS) {
    profileState = { ...profileState, welcomeMessage: message }
    return mockDelay({ ...profileState })
  }
  return apiFetch('/lab/welcome-message', {
    method: 'PUT',
    body: JSON.stringify({ message }),
  })
}

// PUT /api/lab/settings { businessName, ownerName, handlesAppointments,
// handlesHumanHandoff, resultsDeliveryMethod, resultsPortalUrl, address, contactPhone }
// Configuración general + branding + reglas que moldean el árbol de conversación.
export async function updateLabSettings(partialSettings) {
  if (USE_MOCKS) {
    profileState = { ...profileState, ...partialSettings }
    return mockDelay({ ...profileState }, 500)
  }
  return apiFetch('/lab/settings', { method: 'PUT', body: JSON.stringify(partialSettings) })
}

// POST /api/lab/branding/logo (multipart, campo "file") -> sube a Spaces/S3/Blob Storage
export async function uploadLogo(file) {
  if (USE_MOCKS) {
    const url = URL.createObjectURL(file)
    profileState = { ...profileState, logoUrl: url }
    return mockDelay({ logoUrl: url }, 500)
  }
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch('/lab/branding/logo', { method: 'POST', body: formData, headers: {} })
}

// POST /api/lab/branding/banner (multipart, campo "file")
export async function uploadBanner(file) {
  if (USE_MOCKS) {
    const url = URL.createObjectURL(file)
    profileState = { ...profileState, bannerUrl: url }
    return mockDelay({ bannerUrl: url }, 500)
  }
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch('/lab/branding/banner', { method: 'POST', body: formData, headers: {} })
}

// GET /api/lab/knowledge -> list of ingested PDFs/URLs
export async function getKnowledgeDocs() {
  if (USE_MOCKS) return mockDelay(mockKnowledgeDocs)
  return apiFetch('/lab/knowledge')
}

// POST /api/lab/knowledge (multipart/form-data, field "file") -> uploads a PDF
// to S3-compatible storage (DigitalOcean Spaces / Azure Blob) and extracts
// its text server-side for the OpenAI context.
export async function uploadKnowledgeDoc(file) {
  if (USE_MOCKS) {
    return mockDelay({
      id: Date.now(),
      name: file.name,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      uploadedAt: new Date().toISOString().slice(0, 10),
    })
  }

  const formData = new FormData()
  formData.append('file', file)
  return apiFetch('/lab/knowledge', { method: 'POST', body: formData, headers: {} })
}

// GET /api/lab/metrics/token-usage?days=7
export async function getTokenUsageHistory() {
  if (USE_MOCKS) return mockDelay(mockTokenUsageHistory)
  return apiFetch('/lab/metrics/token-usage?days=7')
}

// GET /api/lab/metrics/faq -> top intents grouped from the message log table
export async function getFaqRanking() {
  if (USE_MOCKS) return mockDelay(mockFaqRanking)
  return apiFetch('/lab/metrics/faq')
}

// GET /api/lab/metrics/patients-per-day -> pacientes ÚNICOS atendidos por día
export async function getPatientsPerDay() {
  if (USE_MOCKS) return mockDelay([
    { day: 'Lun', patients: 8 }, { day: 'Mar', patients: 12 }, { day: 'Mie', patients: 6 },
    { day: 'Jue', patients: 15 }, { day: 'Vie', patients: 20 }, { day: 'Sab', patients: 4 }, { day: 'Dom', patients: 1 },
  ])
  return apiFetch('/lab/metrics/patients-per-day?days=7')
}

// GET /api/lab/metrics/messages-by-hour -> distribución horaria (hora Argentina) de los últimos 30 días
export async function getMessagesByHour() {
  if (USE_MOCKS) return mockDelay(Array.from({ length: 24 }, (_, hour) => ({
    hour, count: hour >= 8 && hour <= 20 ? Math.round(20 + 30 * Math.sin(((hour - 8) / 12) * Math.PI)) : 1,
  })))
  return apiFetch('/lab/metrics/messages-by-hour')
}

// GET /api/lab/metrics/token-usage-range?from&to -> tokens agrupados por día
// (rango corto) o por mes (rango largo, más de ~2 meses)
export async function getTokenUsageRange(from, to) {
  if (USE_MOCKS) return mockDelay(mockTokenUsageHistory)
  return apiFetch(`/lab/metrics/token-usage-range?from=${from}&to=${to}`)
}

// GET /api/lab/metrics/patients-per-day-range?from&to -> mismo criterio que token-usage-range
export async function getPatientsPerDayRange(from, to) {
  if (USE_MOCKS) return mockDelay([])
  return apiFetch(`/lab/metrics/patients-per-day-range?from=${from}&to=${to}`)
}

// POST /api/lab/subscription/checkout -> returns the MercadoPago checkout URL
export async function startSubscriptionCheckout() {
  if (USE_MOCKS) return mockDelay({ checkoutUrl: 'https://mercadopago.com/checkout/mock' })
  return apiFetch('/lab/subscription/checkout', { method: 'POST' })
}

// POST /api/lab/subscription/cancel -> stops the MercadoPago preapproval
export async function cancelSubscription() {
  if (USE_MOCKS) return mockDelay({ status: 'CANCELLED' })
  return apiFetch('/lab/subscription/cancel', { method: 'POST' })
}
