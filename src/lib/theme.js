const STORAGE_KEY = 'zero_theme'

// No sigue el tema del sistema operativo a propósito — el toggle es una
// elección explícita del usuario, guardada en este navegador. Por defecto
// queda oscuro (el look de siempre) hasta que alguien elija claro.
export function getTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function setTheme(theme) {
  applyTheme(theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // localStorage puede fallar (modo privado, storage bloqueado) — el tema
    // sigue aplicado en esta sesión, solo no se recuerda la próxima vez.
  }
}

// Se llama una vez al arrancar la app (ver main.jsx) para que el atributo
// data-theme esté puesto antes del primer render y no haya parpadeo.
export function initTheme() {
  applyTheme(getTheme())
}
