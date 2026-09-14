import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Logo from '../components/ui/Logo.jsx'
import { login } from '../api/authService.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { role, mustChangePassword } = await login(email, password)
      navigate(mustChangePassword ? '/cambiar-password' : role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6">
      <Card className="w-full max-w-sm p-8">
        <div className="flex justify-center">
          <Logo size={44} />
        </div>

        <h1 className="mt-6 text-center text-xl font-bold text-[var(--text-strong)]">Iniciar sesión</h1>
        <p className="mt-1 text-center text-sm text-[var(--muted)]">
          Accedé al panel de tu laboratorio o al panel administrativo.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="laboratorio@ejemplo.com"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] placeholder:text-[var(--muted)]/60 outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] placeholder:text-[var(--muted)]/60 outline-none focus:border-[var(--accent)]"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full py-2.5">
            <LogIn size={16} />
            {loading ? 'Ingresando…' : 'Ingresar'}
          </Button>

          <Link
            to="/olvide-password"
            className="block text-center text-xs text-[var(--muted)] hover:text-[var(--text-strong)]"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-[var(--muted)] hover:text-[var(--text-strong)]">
          ← Volver al inicio
        </Link>
      </Card>
    </div>
  )
}
