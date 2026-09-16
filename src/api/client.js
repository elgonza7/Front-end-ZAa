// Base HTTP client for the ZeroAutoapp backend (ASP.NET Core Minimal APIs).
// Set VITE_API_BASE_URL in a .env file to point this at the real API
// (e.g. VITE_API_BASE_URL=https://api.zeroautoapp.com). Defaults to a same-origin
// "/api" prefix so it works behind a reverse proxy in production.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const TOKEN_KEY = 'zero_token'
const ROLE_KEY = 'zero_role'
const LAB_ID_KEY = 'zero_lab_id'
const MUST_CHANGE_PASSWORD_KEY = 'zero_must_change_password'
const ONBOARDING_COMPLETED_KEY = 'zero_onboarding_completed'

export function getAuthToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  else sessionStorage.removeItem(TOKEN_KEY)
}

export function getAuthRole() {
  return sessionStorage.getItem(ROLE_KEY)
}

export function getAuthLabId() {
  return sessionStorage.getItem(LAB_ID_KEY)
}

export function getMustChangePassword() {
  return sessionStorage.getItem(MUST_CHANGE_PASSWORD_KEY) === 'true'
}

export function setMustChangePassword(value) {
  if (value) sessionStorage.setItem(MUST_CHANGE_PASSWORD_KEY, 'true')
  else sessionStorage.removeItem(MUST_CHANGE_PASSWORD_KEY)
}

// true por default: para roles/casos sin un laboratorio todavía resuelto
// (admin, o el selector de cuenta con varios laboratorios) no tiene sentido
// forzar el asistente de configuración inicial.
export function getOnboardingCompleted() {
  return sessionStorage.getItem(ONBOARDING_COMPLETED_KEY) !== 'false'
}

export function setOnboardingCompleted(value) {
  if (value) sessionStorage.removeItem(ONBOARDING_COMPLETED_KEY)
  else sessionStorage.setItem(ONBOARDING_COMPLETED_KEY, 'false')
}

// Guarda la sesión completa que devuelve POST /api/auth/login
// ({ token, role, labId, mustChangePassword, onboardingCompleted }) — se
// llama una sola vez, desde authService.login().
export function setAuthSession({ token, role, labId, mustChangePassword, onboardingCompleted }) {
  setAuthToken(token)
  if (role) sessionStorage.setItem(ROLE_KEY, role)
  else sessionStorage.removeItem(ROLE_KEY)
  if (labId) sessionStorage.setItem(LAB_ID_KEY, labId)
  else sessionStorage.removeItem(LAB_ID_KEY)
  setMustChangePassword(mustChangePassword)
  setOnboardingCompleted(onboardingCompleted ?? true)
}

export function clearAuthSession() {
  setAuthSession({ token: null, role: null, labId: null, mustChangePassword: false, onboardingCompleted: true })
}

// Si el token queda inválido o vencido (401), no tiene sentido mostrarle al
// usuario un error rojo en rojo y obligarlo a cerrar sesión a mano — se
// limpia la sesión y se manda a /login directo. El reload completo (no
// navigate de React Router) es a propósito: reinicia todo el estado de la
// app en vez de dejar pantallas a medio cargar con datos viejos.
function handleUnauthorized() {
  clearAuthSession()
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

// La sesión vive en sessionStorage (no localStorage) a propósito: así cada
// pestaña tiene su propia cuenta logueada de forma completamente
// independiente — podés tener el laboratorio A en una pestaña y el B en
// otra sin que se pisen. (Antes usaba localStorage, que SÍ se comparte entre
// pestañas del mismo navegador: iniciar sesión en la pestaña B con otra
// cuenta pisaba el token de la pestaña A, y ambas terminaban mostrando la
// última cuenta logueada — el bug de "veo los datos de otro laboratorio".)
//
// sessionStorage sí se comparte entre una pestaña y sus duplicados (Ctrl+clic
// en "Duplicar pestaña"), así que este listener sigue siendo útil para ese
// caso puntual: si cerrás sesión en el original, el duplicado se entera.
export function initCrossTabAuthSync() {
  window.addEventListener('storage', (event) => {
    if (event.key === TOKEN_KEY && event.newValue !== event.oldValue) {
      window.location.reload()
    }
  })
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
    if (response.status === 401) {
      handleUnauthorized()
    }
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
