import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Logo from '../components/ui/Logo.jsx'
import { resetPassword } from '../api/authService.js'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await resetPassword(token, newPassword, smsCode)
      setDone(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'No se pudo restablecer la contraseña.')
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

        <h1 className="mt-6 text-center text-xl font-bold text-[var(--text-strong)]">Elegir nueva contraseña</h1>

        {!token ? (
          <p className="mt-4 text-center text-sm text-red-400">
            Este link no es válido. Pedí uno nuevo desde "¿Olvidaste tu contraseña?".
          </p>
        ) : done ? (
          <p className="mt-4 text-center text-sm text-[var(--muted)]">
            Contraseña actualizada. Te llevamos al login…
          </p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Nueva contraseña</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] placeholder:text-[var(--muted)]/60 outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                Código por SMS (si cargaste un teléfono de seguridad)
              </label>
              <input
                type="text"
                value={smsCode}
                onChange={(event) => setSmsCode(event.target.value)}
                placeholder="6 dígitos"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] placeholder:text-[var(--muted)]/60 outline-none focus:border-[var(--accent)]"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full py-2.5">
              <KeyRound size={16} />
              {loading ? 'Guardando…' : 'Guardar nueva contraseña'}
            </Button>
          </form>
        )}

        <Link to="/login" className="mt-6 block text-center text-xs text-[var(--muted)] hover:text-[var(--text-strong)]">
          ← Volver a iniciar sesión
        </Link>
      </Card>
    </div>
  )
}
