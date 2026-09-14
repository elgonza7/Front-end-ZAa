// Base HTTP client for the ZeroAutoapp backend (ASP.NET Core Minimal APIs).
// Set VITE_API_BASE_URL in a .env file to point this at the real API
// (e.g. VITE_API_BASE_URL=https://api.zeroautoapp.com). Defaults to a same-origin
// "/api" prefix so it works behind a reverse proxy in production.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const TOKEN_KEY = 'zero_token'
const ROLE_KEY = 'zero_role'
const LAB_ID_KEY = 'zero_lab_id'
const MUST_CHANGE_PASSWORD_KEY = 'zero_must_change_password'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getAuthRole() {
  return localStorage.getItem(ROLE_KEY)
}

export function getAuthLabId() {
  return localStorage.getItem(LAB_ID_KEY)
}

export function getMustChangePassword() {
  return localStorage.getItem(MUST_CHANGE_PASSWORD_KEY) === 'true'
}

export function setMustChangePassword(value) {
  if (value) localStorage.setItem(MUST_CHANGE_PASSWORD_KEY, 'true')
  else localStorage.removeItem(MUST_CHANGE_PASSWORD_KEY)
}

// Guarda la sesión completa que devuelve POST /api/auth/login
// ({ token, role, labId, mustChangePassword }) — se llama una sola vez, desde
// authService.login().
export function setAuthSession({ token, role, labId, mustChangePassword }) {
  setAuthToken(token)
  if (role) localStorage.setItem(ROLE_KEY, role)
  else localStorage.removeItem(ROLE_KEY)
  if (labId) localStorage.setItem(LAB_ID_KEY, labId)
  else localStorage.removeItem(LAB_ID_KEY)
  setMustChangePassword(mustChangePassword)
}

export function clearAuthSession() {
  setAuthSession({ token: null, role: null, labId: null, mustChangePassword: false })
}

// Thin fetch wrapper: JSON in/out, bearer token auto-attached, JWT ready for
// the [Authorize] endpoints described in the architecture doc.
export async function apiFetch(path, options = {}) {
  const token = getAuthToken()

  // Si el body es FormData (subida de archivos), el navegador tiene que
  // poner su propio Content-Type con el boundary del multipart — si
  // forzamos "application/json" acá, el backend recibe application/json
  // con un body que no lo es y responde 415. Pasar headers:{} desde el
  // caller no alcanza para evitar esto porque igual heredaba el default.
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, path))
  }

  if (response.status === 204) return null
  return response.json()
}

// El backend devuelve errores como ProblemDetails (application/problem+json,
// { title, status, detail }) o, para errores de validación de FluentValidation,
// como { errors: { campo: ["mensaje"] } }. Nunca mostramos el JSON crudo en la UI.
async function extractErrorMessage(response, path) {
  const raw = await response.text().catch(() => '')

  if (raw) {
    try {
      const body = JSON.parse(raw)
      if (body.detail) return body.detail
      if (body.errors && typeof body.errors === 'object') {
        const firstField = Object.values(body.errors)[0]
        if (Array.isArray(firstField) && firstField.length > 0) return firstField[0]
      }
      if (body.title) return body.title
    } catch {
      // No era JSON: seguimos con el texto crudo como último recurso.
    }
  }

  return raw || response.statusText || `Error ${response.status} en ${path}`
}

// Small helper used by the mock services below to simulate network latency
// without blocking the UI thread logic. Safe to delete once real endpoints
// are wired up.
export function mockDelay(value, ms = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}
