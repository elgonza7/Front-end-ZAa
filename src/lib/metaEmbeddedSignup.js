// Embedded Signup de WhatsApp: el laboratorio hace login con Facebook y elige
// su WABA/número sin copiar ningún ID a mano. Necesita dos valores que viven
// en el panel de Meta for Developers (no son del código): VITE_META_APP_ID y
// VITE_META_WHATSAPP_CONFIG_ID (ver .env.example). Si falta alguno, el botón
// de WhatsAppConnect.jsx no se muestra y se sigue usando el formulario manual.
const META_APP_ID = import.meta.env.VITE_META_APP_ID
const WHATSAPP_CONFIG_ID = import.meta.env.VITE_META_WHATSAPP_CONFIG_ID
const SDK_TIMEOUT_MS = 5 * 60 * 1000

export const EMBEDDED_SIGNUP_AVAILABLE = Boolean(META_APP_ID && WHATSAPP_CONFIG_ID)

let sdkLoadPromise = null

function loadFacebookSdk() {
  if (sdkLoadPromise) return sdkLoadPromise

  sdkLoadPromise = new Promise((resolve, reject) => {
    if (window.FB) {
      resolve(window.FB)
      return
    }

    window.fbAsyncInit = function initFacebookSdk() {
      window.FB.init({ appId: META_APP_ID, autoLogAppEvents: true, xfbml: false, version: 'v21.0' })
      resolve(window.FB)
    }

    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/es_LA/sdk.js'
    script.async = true
    script.defer = true
    script.onerror = () => reject(new Error('No se pudo cargar el SDK de Facebook. Revisá tu conexión e intentá de nuevo.'))
    document.body.appendChild(script)
  })

  return sdkLoadPromise
}

// Devuelve { code, wabaId, phoneNumberId } cuando el laboratorio termina el
// flujo, o rechaza la promesa si cancela, Meta devuelve un error, o no
// responde dentro de SDK_TIMEOUT_MS. El "code" sale del callback de
// FB.login(); el wabaId/phoneNumberId salen aparte, por postMessage del
// popup de Meta (evento "WA_EMBEDDED_SIGNUP") — pueden llegar en cualquier
// orden, por eso se combinan con tryResolve() en vez de asumir uno primero.
export function startEmbeddedSignup() {
  if (!EMBEDDED_SIGNUP_AVAILABLE) {
    return Promise.reject(new Error('Falta configurar VITE_META_APP_ID / VITE_META_WHATSAPP_CONFIG_ID.'))
  }

  return new Promise((resolve, reject) => {
    const state = { code: null, wabaId: null, phoneNumberId: null, settled: false }
    let timeoutId

    function cleanup() {
      window.removeEventListener('message', handleMessage)
      window.clearTimeout(timeoutId)
    }

    function settleError(message) {
      if (state.settled) return
      state.settled = true
      cleanup()
      reject(new Error(message))
    }

    function tryResolve() {
      if (state.settled || !state.code || !state.wabaId || !state.phoneNumberId) return
      state.settled = true
      cleanup()
      resolve({ code: state.code, wabaId: state.wabaId, phoneNumberId: state.phoneNumberId })
    }

    function handleMessage(event) {
      // OJO acá: tiene que ser un dominio exacto o un subdominio real de
      // facebook.com (con el punto adelante) — "endsWith('facebook.com')"
      // sin el punto también deja pasar un origen falso como
      // "https://evil-facebook.com", que termina en esa misma cadena de
      // texto sin ser realmente un subdominio de Meta.
      const origin = event.origin
      const isRealFacebookOrigin = origin === 'https://www.facebook.com' || origin.endsWith('.facebook.com')
      if (!isRealFacebookOrigin) return

      let data
      try {
        data = JSON.parse(event.data)
      } catch {
        return // Mensajes de otros scripts/extensiones que no son JSON — se ignoran.
      }
      if (data.type !== 'WA_EMBEDDED_SIGNUP') return

      if (data.event === 'FINISH' || data.event === 'FINISH_ONLY_WABA') {
        state.wabaId = data.data?.waba_id ?? state.wabaId
        state.phoneNumberId = data.data?.phone_number_id ?? state.phoneNumberId
        tryResolve()
      } else if (data.event === 'CANCEL') {
        settleError('Cancelaste la conexión antes de terminar.')
      } else if (data.event === 'ERROR') {
        settleError(data.data?.error_message || 'Meta reportó un error durante la conexión.')
      }
    }

    window.addEventListener('message', handleMessage)
    timeoutId = window.setTimeout(() => settleError('No llegó respuesta de Meta a tiempo — intentá de nuevo.'), SDK_TIMEOUT_MS)

    loadFacebookSdk()
      .then((FB) => {
        FB.login(
          (response) => {
            if (response.authResponse?.code) {
              state.code = response.authResponse.code
              tryResolve()
            } else {
              settleError('Cerraste la ventana de Facebook antes de terminar, o Meta no autorizó el acceso.')
            }
          },
          {
            config_id: WHATSAPP_CONFIG_ID,
            response_type: 'code',
            override_default_response_type: true,
            extras: { sessionInfoVersion: '3' },
          },
        )
      })
      .catch(settleError)
  })
}
