import { useEffect, useRef } from 'react'

// Ejecuta `callback` cada `intervalMs` mientras la pestaña esté visible, y una
// vez apenas vuelve a estar visible (si estuvo oculta). No llama en el
// montaje: la pantalla ya hace su propia carga inicial.
export function useVisiblePolling(callback, intervalMs) {
  const saved = useRef(callback)
  useEffect(() => {
    saved.current = callback
  }, [callback])

  useEffect(() => {
    let timer = null

    function start() {
      if (timer === null) timer = setInterval(() => saved.current(), intervalMs)
    }

    function stop() {
      if (timer !== null) {
        clearInterval(timer)
        timer = null
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        saved.current()
        start()
      } else {
        stop()
      }
    }

    if (document.visibilityState === 'visible') start()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [intervalMs])
}
