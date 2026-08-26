import { apiFetch, setAuthToken, mockDelay } from './client.js'

const USE_MOCKS = true // flip to false once POST /api/auth/login exists

// Real call (Minimal API): POST /api/auth/login { email, password }
// Expected response: { token, role: "lab" | "admin", labId? }
export async function login(email, password) {
  if (USE_MOCKS) {
    const role = email.includes('admin') ? 'admin' : 'lab'
    const token = `mock.${role}.token`
    setAuthToken(token)
    return mockDelay({ token, role, labId: 'lab_ameghino' })
  }

  const result = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setAuthToken(result.token)
  return result
}

export function logout() {
  setAuthToken(null)
}
