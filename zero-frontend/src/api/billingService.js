import { apiFetch, mockDelay } from './client.js'
import { mockLabBilling, mockPlatformBilling } from '../lib/mockData.js'

const USE_MOCKS = true // flip to false once the /api/lab/billing endpoints exist

let billingState = { ...mockLabBilling }

// GET /api/lab/billing -> plan, precio, descuento, vencimiento e historial de pagos
export async function getLabBilling() {
  if (USE_MOCKS) return mockDelay({ ...billingState })
  return apiFetch('/lab/billing')
}

// GET /api/platform/billing-destination -> cuentas de ZeroAutoapp donde pagan los laboratorios
// (dato de plataforma, no específico del laboratorio — podría vivir en un
// endpoint público o venir embebido en /api/lab/billing).
export async function getPlatformBillingDestination() {
  if (USE_MOCKS) return mockDelay({ ...mockPlatformBilling })
  return apiFetch('/platform/billing-destination')
}

// POST /api/lab/billing/checkout -> checkout de MercadoPago (Preapproval)
export async function startCheckout() {
  if (USE_MOCKS) return mockDelay({ checkoutUrl: 'https://mercadopago.com/checkout/mock' }, 500)
  return apiFetch('/lab/billing/checkout', { method: 'POST' })
}

// PATCH /api/lab/billing/payment-method { method }
export async function updatePaymentMethod(method) {
  if (USE_MOCKS) {
    billingState = { ...billingState, paymentMethod: method }
    return mockDelay({ ...billingState })
  }
  return apiFetch('/lab/billing/payment-method', { method: 'PATCH', body: JSON.stringify({ method }) })
}
