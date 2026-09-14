import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, KeyRound } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Logo from '../components/ui/Logo.jsx'
import { changePassword } from '../api/authService.js'
import { getAuthRole } from '../api/client.js'

const HOME_BY_ROLE = { lab: '/dashboard', admin: '/admin' }

export default function ChangePassword() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await changePassword(newPassword)
      navigate(HOME_BY_ROLE[getAuthRole()] ?? '/login', { replace: true })
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la contraseña.')
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

        <div className="mt-6 flex items-center justify-center gap-2 text-amber-400">
          <ShieldAlert size={18} />
          <h1 className="text-center text-xl font-bold text-[var(--text-strong)]">Actualizá tu contraseña</h1>
        </div>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Tu cuenta todavía tiene la contraseña temporal que te asignó el administrador — es
          insegura porque cualquiera podría adivinarla. Elegí una nueva antes de continuar.
        </p>

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
            <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Confirmar contraseña</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repetí la contraseña"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] placeholder:text-[var(--muted)]/60 outline-none focus:border-[var(--accent)]"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full py-2.5">
            <KeyRound size={16} />
            {loading ? 'Guardando…' : 'Guardar y continuar'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
