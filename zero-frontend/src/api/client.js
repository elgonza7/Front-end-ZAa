// Base HTTP client for the ZeroAutoapp backend (ASP.NET Core Minimal APIs).
// Set VITE_API_BASE_URL in a .env file to point this at the real API
// (e.g. VITE_API_BASE_URL=https://api.zeroautoapp.com). Defaults to a same-origin
// "/api" prefix so it works behind a reverse proxy in production.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const TOKEN_KEY = 'zero_token'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

// Thin fetch wrapper: JSON in/out, bearer token auto-attached, JWT ready for
// the [Authorize] endpoints described in the architecture doc.
export async function apiFetch(path, options = {}) {
  const token = getAuthToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new Error(message || `Error ${response.status} en ${path}`)
  }

  if (response.status === 204) return null
  return response.json()
}

// Small helper used by the mock services below to simulate network latency
// without blocking the UI thread logic. Safe to delete once real endpoints
// are wired up.
export function mockDelay(value, ms = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}
