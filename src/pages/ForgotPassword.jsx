import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Logo from '../components/ui/Logo.jsx'
import { forgotPassword } from '../api/authService.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message || 'No se pudo procesar el pedido.')
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

        <h1 className="mt-6 text-center text-xl font-bold text-white">Recuperar contraseña</h1>

        {sent ? (
          <p className="mt-4 text-center text-sm text-[#8b949e]">
            Si el email existe, te mandamos un link para restablecer la contraseña (y un
            código por SMS si tenés un teléfono de seguridad cargado). Revisá tu correo.
          </p>
        ) : (
          <>
            <p className="mt-1 text-center text-sm text-[#8b949e]">
              Ingresá tu email y te mandamos un link para elegir una nueva contraseña.
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

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full py-2.5">
                <Mail size={16} />
                {loading ? 'Enviando…' : 'Enviar link'}
              </Button>
            </form>
          </>
        )}

        <Link to="/login" className="mt-6 block text-center text-xs text-[#8b949e] hover:text-white">
          ← Volver a iniciar sesión
        </Link>
      </Card>
    </div>
  )
}
