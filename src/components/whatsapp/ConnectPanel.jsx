import { useState } from 'react'
import { XCircle, ListChecks, Footprints, LifeBuoy } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { PreflightChecklist, ConnectSteps, ConnectTroubleshooting } from './ConnectGuide.jsx'
import { PREFLIGHT_ITEMS, SUPPORT_MAILTO } from '../../lib/whatsappConnectInfo.js'
import { completeEmbeddedSignup } from '../../api/whatsappService.js'
import { EMBEDDED_SIGNUP_AVAILABLE, startEmbeddedSignup } from '../../lib/metaEmbeddedSignup.js'
import { explainConnectError } from '../../lib/whatsappConnectErrors.js'

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section>
      <div className="flex items-start gap-2.5">
        <Icon size={19} className="mt-0.5 shrink-0 text-[var(--accent)]" />
        <div>
          <h3 className="text-base font-semibold text-[var(--text-strong)]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-[var(--muted)]">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

// Lista previa + botón "Conectar con Facebook" + paso a paso + problemas
// comunes. `onConnected(connection)` se llama con la conexión ya guardada.
export default function ConnectPanel({ onConnected }) {
  const [checked, setChecked] = useState([])
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const missing = PREFLIGHT_ITEMS.length - checked.length

  function toggle(id) {
    setChecked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  async function handleConnect() {
    setConnecting(true)
    setError('')
    try {
      const { code, wabaId, phoneNumberId } = await startEmbeddedSignup()
      const connection = await completeEmbeddedSignup({ code, wabaId, phoneNumberId })
      onConnected?.(connection)
    } catch (err) {
      setError(err.message || 'No se pudo completar la conexión con Facebook.')
    } finally {
      setConnecting(false)
    }
  }

  const explained = error ? explainConnectError(error) : null

  return (
    <div className="space-y-8">
      <Section
        icon={ListChecks}
        title="1. Antes de empezar"
        subtitle="Tocá cada punto cuando lo tengas listo. Si falta alguno, la conexión puede fallar."
      >
        <PreflightChecklist checked={checked} onToggle={toggle} />
      </Section>

      <Section icon={Footprints} title="2. Conectar" subtitle="Abrí la guía de abajo mientras lo hacés: te dice qué tocar en cada pantalla.">
        {EMBEDDED_SIGNUP_AVAILABLE ? (
          <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/5 p-5">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--text)]">
                {missing === 0
                  ? '¡Todo listo! Tocá el botón y seguí los pasos de la guía.'
                  : `Te ${missing === 1 ? 'falta 1 punto' : `faltan ${missing} puntos`} de la lista. Podés intentar igual, pero es más probable que algo falle.`}
              </p>
              <Button type="button" onClick={handleConnect} disabled={connecting} className="shrink-0 px-5 py-3 text-sm">
                {connecting ? 'Conectando… seguí en la ventana de Facebook' : 'Conectar con Facebook'}
              </Button>
            </div>

            {explained && (
              <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4" role="alert">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-strong)]">
                  <XCircle size={17} className="text-red-400" /> {explained.title}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--text)]">
                  {explained.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-[var(--muted)]">Detalle técnico (por si nos escribís): {error}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm text-[var(--muted)]">
            La conexión automática todavía no está disponible. Escribinos y la hacemos con vos.
          </p>
        )}

        <div className="mt-4">
          <ConnectSteps />
        </div>
      </Section>

      <Section icon={LifeBuoy} title="3. Si algo sale mal">
        <ConnectTroubleshooting />
        <p className="mt-4 text-sm text-[var(--muted)]">
          ¿No se resolvió? No hace falta que sepas de tecnología:{' '}
          <a href={SUPPORT_MAILTO} className="font-semibold text-[var(--accent)] underline">
            escribinos y lo conectamos con vos
          </a>
          .
        </p>
      </Section>
    </div>
  )
}
