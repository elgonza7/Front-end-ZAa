import { apiFetch, mockDelay } from './client.js'
import { mockWhatsappConnection } from '../lib/mockData.js'

const USE_MOCKS = false // flip to false once the /api/lab/whatsapp/* endpoints exist

let connectionState = { ...mockWhatsappConnection }

// GET /api/lab/whatsapp -> estado de la conexión con WhatsApp Cloud API (Meta)
export async function getConnection() {
  if (USE_MOCKS) return mockDelay({ ...connectionState })
  return apiFetch('/lab/whatsapp')
}

// PUT /api/lab/whatsapp { phoneNumberId, wabaId, accessToken, webhookVerifyToken }
// El backend guarda el access token cifrado y registra el webhook en Meta.
export async function saveConnection(payload) {
  if (USE_MOCKS) {
    connectionState = {
      ...connectionState,
      ...payload,
      connected: true,
      lastSyncedAt: new Date().toISOString(),
    }
    return mockDelay({ ...connectionState }, 900)
  }
  return apiFetch('/lab/whatsapp', { method: 'PUT', body: JSON.stringify(payload) })
}

// POST /api/lab/whatsapp/test -> envía un mensaje de prueba con la Cloud API
export async function testConnection() {
  if (USE_MOCKS) return mockDelay({ ok: true, message: 'Mensaje de prueba enviado correctamente.' }, 1000)
  return apiFetch('/lab/whatsapp/test', { method: 'POST' })
}

// DELETE /api/lab/whatsapp -> desvincula el número
export async function disconnect() {
  if (USE_MOCKS) {
    connectionState = { ...connectionState, connected: false }
    return mockDelay({ ...connectionState })
  }
  return apiFetch('/lab/whatsapp', { method: 'DELETE' })
}

// GET /api/lab/whatsapp/business-profile -> perfil cargado del lado de Meta
// (About, descripción, dirección, email, sitios web, categoría) — de solo
// lectura, para mostrarlo como referencia sin pisar nada de Configuración.
export async function getBusinessProfile() {
  if (USE_MOCKS) {
    return mockDelay({ about: null, description: null, address: null, email: null, websites: [], vertical: null })
  }
  return apiFetch('/lab/whatsapp/business-profile')
}
