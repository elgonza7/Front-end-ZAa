import { apiFetch, setAuthSession, clearAuthSession, setMustChangePassword, mockDelay } from './client.js'

const USE_MOCKS = false // flip to false once POST /api/auth/login exists

// Real call (Minimal API): POST /api/auth/login { email, password }
// Expected response: { token, role: "lab" | "admin", labId? }
export async function login(email, password) {
  if (USE_MOCKS) {
    const role = email.includes('admin') ? 'admin' : 'lab'
    const token = `mock.${role}.token`
    const session = { token, role, labId: 'lab_ameghino' }
    setAuthSession(session)
    return mockDelay(session)
  }

  const result = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setAuthSession(result)
  return result
}

export function logout() {
  clearAuthSession()
}

// POST /api/auth/forgot-password { email } -> 204, siempre (no revela si el
// email existe). Si existe y tiene teléfono cargado, también manda un
// código por SMS que hace falta en el paso de reset-password.
export async function forgotPassword(email) {
  if (USE_MOCKS) return mockDelay(null)
  return apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

// POST /api/auth/reset-password { token, smsCode?, newPassword } -> 204
export async function resetPassword(token, newPassword, smsCode) {
  if (USE_MOCKS) return mockDelay(null)
  return apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, smsCode: smsCode || null, newPassword }),
  })
}

// PUT /api/account/password { newPassword } -> 204 (requiere sesión). Se usa
// tanto para el cambio forzado de la contraseña temporal "123" como para un
// cambio voluntario cualquiera.
export async function changePassword(newPassword) {
  if (USE_MOCKS) return mockDelay(null)
  await apiFetch('/account/password', {
    method: 'PUT',
    body: JSON.stringify({ newPassword }),
  })
  setMustChangePassword(false)
}

// PUT /api/account/security-phone { phone } -> 204 (requiere sesión)
export async function updateSecurityPhone(phone) {
  if (USE_MOCKS) return mockDelay(null)
  return apiFetch('/account/security-phone', {
    method: 'PUT',
    body: JSON.stringify({ phone: phone || null }),
  })
}
