import { Navigate, useLocation } from 'react-router-dom'
import { getAuthToken, getAuthRole } from '../../api/client.js'

const HOME_BY_ROLE = { lab: '/dashboard', admin: '/admin' }

// Protege un grupo de rutas: sin token, manda a /login; con token pero rol
// equivocado (ej. un lab intentando entrar a /admin), manda a la home de su
// propio rol en vez de dejarlo pasar.
export default function RequireAuth({ role, children }) {
  const location = useLocation()
  const token = getAuthToken()
  const currentRole = getAuthRole()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (role && currentRole !== role) {
    return <Navigate to={HOME_BY_ROLE[currentRole] ?? '/login'} replace />
  }

  return children
}
