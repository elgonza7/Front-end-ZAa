import { apiFetch, setAuthSession, clearAuthSession, mockDelay } from './client.js'

const USE_MOCKS = true // flip to false once POST /api/auth/login exists

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
