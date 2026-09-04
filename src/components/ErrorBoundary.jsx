import { Component } from 'react'
import { getAuthRole } from '../api/client.js'

// Adonde mandamos al usuario al tocar "Volver al inicio": su panel según el
// rol logueado, o la landing si no hay sesión — nunca la misma pantalla rota.
function safeHomePath() {
  const role = getAuthRole()
  if (role === 'admin') return '/admin'
  if (role === 'lab') return '/dashboard'
  return '/'
}

// Red de seguridad de último recurso: si un error de render se escapa (un
// campo inesperado en una respuesta del backend, por ejemplo), React
// desmonta todo el árbol y deja la pantalla en blanco/negra sin ningún
// mensaje. Esto lo intercepta y muestra algo accionable en vez de nada.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Error no manejado en la UI:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0d1117] px-6 text-center">
          <p className="text-lg font-semibold text-white">Ocurrió un error inesperado.</p>
          <p className="max-w-sm text-sm text-[#8b949e]">
            Algo falló al mostrar esta pantalla. Recargá la página; si el problema sigue,
            avisale al equipo de soporte.
          </p>
          <button
            type="button"
            onClick={() => window.location.assign(safeHomePath())}
            className="rounded-xl bg-[#F8B500] px-4 py-2 text-sm font-semibold text-[#0d1117]"
          >
            Volver al inicio
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
