import { apiFetch, mockDelay } from './client.js'
import { mockChangelog, mockSystemStatus } from '../lib/mockData.js'

const USE_MOCKS = false // flip to false once /api/public/* endpoints exist

// GET /api/public/changelog -> historial de versiones (footer > Actualizaciones)
export async function getChangelog() {
  if (USE_MOCKS) return mockDelay(mockChangelog)
  return apiFetch('/public/changelog')
}

// GET /api/public/status -> estado de los componentes de la plataforma
export async function getSystemStatus() {
  if (USE_MOCKS) return mockDelay(mockSystemStatus)
  return apiFetch('/public/status')
}
