import { apiFetch, mockDelay } from './client.js'
import {
  mockGlobalMetrics,
  mockAdminTenants,
  mockPlatformTokenHistory,
  mockPlatformResponseCount,
  mockRevenueHistory,
  mockPlanDistribution,
} from '../lib/mockData.js'

const USE_MOCKS = false // flip to false once the /api/admin/* endpoints exist

// Mutable copy so create/suspend/reactivate persist across navigations in the mock session.
let tenantsState = mockAdminTenants.map((tenant) => ({ ...tenant }))

// GET /api/admin/labs -> every tenant, admin-only (role claim checked server-side)
export async function getLabs() {
  if (USE_MOCKS) return mockDelay(tenantsState.map((tenant) => ({ ...tenant })))
  return apiFetch('/admin/labs')
}

// GET /api/admin/labs/{id} -> detalle de un inquilino (incluye historial de tokens
// para calcular tendencia y salud de la cuenta)
export async function getLabDetail(labId) {
  if (USE_MOCKS) {
    const tenant = tenantsState.find((lab) => lab.id === labId)
    return mockDelay(tenant ? { ...tenant } : null)
  }
  return apiFetch(`/admin/labs/${labId}`)
}

// GET /api/admin/metrics -> platform-wide token usage, active tenants, revenue
export async function getGlobalMetrics() {
  if (USE_MOCKS) {
    return mockDelay({
      totalLabs: tenantsState.length,
      activeLabs: tenantsState.filter((lab) => lab.botActive).length,
      totalTokensConsumed: tenantsState.reduce((sum, lab) => sum + lab.tokensConsumed, 0),
      monthlyRevenueUSD: mockGlobalMetrics.monthlyRevenueUSD,
    })
  }
  return apiFetch('/admin/metrics')
}

// GET /api/admin/metrics/history -> series usadas en el panel de Métricas
export async function getMetricsHistory() {
  if (USE_MOCKS) {
    return mockDelay({
      tokenHistory: mockPlatformTokenHistory,
      responseCount: mockPlatformResponseCount,
      revenueHistory: mockRevenueHistory,
      planDistribution: mockPlanDistribution,
    })
  }
  return apiFetch('/admin/metrics/history')
}

// PATCH /api/admin/labs/{id}/suspend -> forces IsBotActive = false regardless
// of the 15-day grace period Worker Service (manual override for admins)
export async function suspendLab(labId) {
  if (USE_MOCKS) {
    tenantsState = tenantsState.map((lab) => (lab.id === labId ? { ...lab, botActive: false } : lab))
    return mockDelay({ id: labId, botActive: false })
  }
  return apiFetch(`/admin/labs/${labId}/suspend`, { method: 'PATCH' })
}

// PATCH /api/admin/labs/{id}/reactivate
export async function reactivateLab(labId) {
  if (USE_MOCKS) {
    tenantsState = tenantsState.map((lab) => (lab.id === labId ? { ...lab, botActive: true } : lab))
    return mockDelay({ id: labId, botActive: true })
  }
  return apiFetch(`/admin/labs/${labId}/reactivate`, { method: 'PATCH' })
}

// POST /api/admin/labs { name, email, phone, plan } -> alta de un nuevo inquilino
export async function createLab(payload) {
  if (USE_MOCKS) {
    const newLab = {
      id: `lab_${Date.now()}`,
      botActive: true,
      lastPayment: new Date().toISOString().slice(0, 10),
      status: 'PENDING',
      tokensConsumed: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      ...payload,
    }
    tenantsState = [newLab, ...tenantsState]
    return mockDelay(newLab, 500)
  }
  return apiFetch('/admin/labs', { method: 'POST', body: JSON.stringify(payload) })
}

// PATCH /api/admin/labs/{id} { name, email, phone, plan } -> edición de datos del inquilino
export async function updateLab(labId, payload) {
  if (USE_MOCKS) {
    tenantsState = tenantsState.map((lab) => (lab.id === labId ? { ...lab, ...payload } : lab))
    return mockDelay(tenantsState.find((lab) => lab.id === labId), 400)
  }
  return apiFetch(`/admin/labs/${labId}`, { method: 'PATCH', body: JSON.stringify(payload) })
}

// POST /api/admin/labs/{id}/free-month -> marca el período actual (cuota +
// habilitación) como pagado sin pasar por Mercado Pago/transferencia, y
// empuja 30 días el próximo vencimiento. Para testers o cortesías puntuales.
export async function grantFreeMonth(labId) {
  if (USE_MOCKS) {
    tenantsState = tenantsState.map((lab) => (lab.id === labId ? { ...lab, status: 'PAID' } : lab))
    return mockDelay(tenantsState.find((lab) => lab.id === labId), 400)
  }
  return apiFetch(`/admin/labs/${labId}/free-month`, { method: 'POST' })
}
