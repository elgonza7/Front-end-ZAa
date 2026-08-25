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
      const { role } = await login(email, password)
      navigate(role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-6">
      <Card className="w-full max-w-sm p-8">
        <div className="flex justify-center">
          <Logo size={44} />
        </div>

        <h1 className="mt-6 text-center text-xl font-bold text-white">Iniciar sesión</h1>
        <p className="mt-1 text-center text-sm text-[#8b949e]">
          Accedé al panel de tu laboratorio o al panel administrativo.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="laboratorio@ejemplo.com"
              className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8b949e]/60 outline-none focus:border-[#F8B500]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8b949e]/60 outline-none focus:border-[#F8B500]"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full py-2.5">
            <LogIn size={16} />
            {loading ? 'Ingresando…' : 'Ingresar'}
          </Button>

          <p className="text-center text-xs text-[#8b949e]">
            Tip: usá un email con "admin" para ver el panel de administración.
          </p>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-[#8b949e] hover:text-white">
          ← Volver al inicio
        </Link>
      </Card>
    </div>
  )
}
