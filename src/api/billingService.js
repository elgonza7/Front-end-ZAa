import { apiFetch, mockDelay } from './client.js'
import { mockLabBilling, mockPlatformBilling } from '../lib/mockData.js'

const USE_MOCKS = false // flip to false once the /api/lab/billing endpoints exist

let billingState = { ...mockLabBilling }

// GET /api/lab/billing -> plan, precio, descuento, vencimiento e historial de pagos
export async function getLabBilling() {
  if (USE_MOCKS) return mockDelay({ ...billingState })
  return apiFetch('/lab/billing')
}

// GET /api/platform/billing-destination -> cuentas de ZeroAutoapp donde pagan los laboratorios
// (dato de plataforma, no específico del laboratorio — podría vivir en un
// endpoint público o venir embebido en /api/lab/billing).
// El backend devuelve los campos planos (aliasArs, cvuArs, aliasUsd, cbuUsd);
// acá los agrupamos en { ars, usd } que es lo que consume LabBilling.jsx.
export async function getPlatformBillingDestination() {
  if (USE_MOCKS) return mockDelay({ ...mockPlatformBilling })
  const data = await apiFetch('/platform/billing-destination')
  return {
    ars: { alias: data.aliasArs, cvu: data.cvuArs },
    usd: { alias: data.aliasUsd, cbu: data.cbuUsd },
    segundoLabDiscountPct: data.segundoLabDiscountPct,
    tercerLabOMasDiscountPct: data.tercerLabOMasDiscountPct,
  }
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

// PATCH /api/lab/billing/auto-renew { enabled: false } -> cancela la
// renovación automática. El servicio sigue activo hasta nextDueDate (no hay
// corte de servicio a mitad de período) — solo deja de cobrarse en adelante.
export async function cancelAutoRenew() {
  if (USE_MOCKS) {
    billingState = { ...billingState, autoRenew: false, cancelAtPeriodEnd: true }
    return mockDelay({ ...billingState })
  }
  return apiFetch('/lab/billing/auto-renew', { method: 'PATCH', body: JSON.stringify({ enabled: false }) })
}

// PATCH /api/lab/billing/auto-renew { enabled: true } -> reactiva la
// renovación automática antes de que se cumpla nextDueDate.
export async function enableAutoRenew() {
  if (USE_MOCKS) {
    billingState = { ...billingState, autoRenew: true, cancelAtPeriodEnd: false }
    return mockDelay({ ...billingState })
  }
  return apiFetch('/lab/billing/auto-renew', { method: 'PATCH', body: JSON.stringify({ enabled: true }) })
}

// POST /api/lab/billing/report-transfer { reference } -> registra en el
// sistema que el laboratorio ya transfirió, en vez de depender de un aviso
// externo (WhatsApp/mail) que el dueño de la plataforma puede no ver. Queda
// visible para el admin como pendiente de verificar hasta que se acredite.
export async function reportManualTransfer(reference) {
  if (USE_MOCKS) {
    billingState = {
      ...billingState,
      pendingTransfer: { reference, reportedAt: new Date().toISOString() },
    }
    return mockDelay({ ...billingState }, 500)
  }
  return apiFetch('/lab/billing/report-transfer', { method: 'POST', body: JSON.stringify({ reference }) })
}
