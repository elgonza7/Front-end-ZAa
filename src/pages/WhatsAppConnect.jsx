import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Send, Unlink, Phone, Smartphone, Wifi, WifiOff, BadgeCheck, Gauge, Lock, Building2, Mail, Globe, MapPin, Tag, ArrowDownToLine } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import HelpButton from '../components/ui/HelpButton.jsx'
import { getConnection, testConnection, disconnect, getBusinessProfile, completeEmbeddedSignup } from '../api/whatsappService.js'
import { updateLabSettings } from '../api/labService.js'
import { EMBEDDED_SIGNUP_AVAILABLE, startEmbeddedSignup } from '../lib/metaEmbeddedSignup.js'

const SUPPORT_MAILTO =
  'mailto:zeroautoapp@gmail.com?subject=Quiero%20que%20conecten%20mi%20WhatsApp&body=Hola%2C%20quiero%20usar%20el%20n%C3%BAmero%3A%20%5Btu%20n%C3%BAmero%20de%20WhatsApp%20ac%C3%A1%5D'

export function WhatsappTutorial() {
  return (
    <>
      <p>
        Conectar tu WhatsApp lleva un par de minutos y se hace <strong>una sola vez</strong>. No
        hace falta saber nada de tecnología ni copiar ningún código.
      </p>

      <p>
        El asistente se conecta en modo <strong>Coexistence</strong>: seguís usando la app de
        WhatsApp Business en tu celular exactamente como siempre —chats, historial, grupos— y el
        asistente responde en paralelo, por el mismo número que ya usás con tus pacientes.
      </p>

      <div>
        <p className="text-sm font-semibold text-[var(--text-strong)]">Antes de empezar, tené a mano:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>La cuenta de Facebook del dueño o encargado del laboratorio.</li>
          <li>
            El celular con la app de <strong>WhatsApp Business</strong> del número que usás con tus
            pacientes — Meta te va a mandar un código ahí para confirmar que el número es tuyo.
          </li>
        </ul>
      </div>

      <ol className="list-decimal space-y-3 pl-5">
        <li>
          Tocá <strong>"Conectar con Facebook"</strong>. Se abre una ventana de Facebook.
        </li>
        <li>
          Iniciá sesión con tu cuenta de Facebook y aceptá los permisos que te pide (son para que
          el asistente pueda leer y responder los mensajes de tu WhatsApp Business).
        </li>
        <li>
          Elegí tu negocio (o creá uno nuevo si Meta te lo ofrece) y después elegí el número de
          WhatsApp Business que querés conectar.
        </li>
        <li>
          Confirmá el número con el código que te llega a la app de WhatsApp Business en el celular.
        </li>
        <li>
          Listo: la ventana se cierra sola y acá vas a ver el estado en <strong>"Conectado"</strong>.
          Tocá "Enviar mensaje de prueba" para confirmar que todo funciona.
        </li>
      </ol>

      <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4">
        <p className="text-sm font-semibold text-[var(--text-strong)]">¿Algo no funciona o preferís que lo hagamos nosotros?</p>
        <p className="mt-1.5">
          No hace falta que sepas nada del tema ni de tecnología: contanos qué pasa y te ayudamos a
          resolverlo, o lo conectamos nosotros por vos.
        </p>
        <a
          href={SUPPORT_MAILTO}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] underline"
        >
          Pedir ayuda →
        </a>
      </div>
    </>
  )
}

function StatusTile({ icon: Icon, iconClass = 'text-[var(--accent)] bg-[var(--accent)]/10', label, children }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--muted)]">{label}</p>
        <div className="mt-1 truncate">{children}</div>
      </div>
    </div>
  )
}

const QUALITY_LABEL = {
  GREEN: { text: 'Calidad alta', variant: 'success' },
  YELLOW: { text: 'Calidad media', variant: 'warning' },
  RED: { text: 'Calidad baja', variant: 'danger' },
}

export default function WhatsAppConnect() {
  const [connection, setConnection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const [businessProfile, setBusinessProfile] = useState(null)
  const [addressCopied, setAddressCopied] = useState(false)
  const [connectConfirmed, setConnectConfirmed] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupError, setSignupError] = useState('')
  const [disconnecting, setDisconnecting] = useState(false)

  useEffect(() => {
    getConnection().then((data) => {
      setConnection(data)
      setLoading(false)

      // El perfil solo existe del lado de Meta si hay un número conectado —
      // si falla (ej. token vencido), no rompemos la pantalla por esto.
      if (data.connected) {
        getBusinessProfile().then(setBusinessProfile).catch(() => setBusinessProfile(null))
      }
    })
  }, [])

  async function handleUseAddress() {
    if (!businessProfile?.address) return
    await updateLabSettings({ address: businessProfile.address })
    setAddressCopied(true)
  }

  async function handleEmbeddedSignup() {
    setSignupLoading(true)
    setSignupError('')
    try {
      const { code, wabaId, phoneNumberId } = await startEmbeddedSignup()
      const updated = await completeEmbeddedSignup({ code, wabaId, phoneNumberId })
      setConnection(updated)
      setConnectConfirmed(true)
      setTimeout(() => setConnectConfirmed(false), 6000)
      getBusinessProfile().then(setBusinessProfile).catch(() => setBusinessProfile(null))
    } catch (err) {
      setSignupError(err.message || 'No se pudo completar la conexión con Facebook.')
    } finally {
      setSignupLoading(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    try {
      const result = await testConnection()
      setTestResult(result)
    } catch (err) {
      setTestResult({ ok: false, message: err.message || 'No se pudo enviar el mensaje de prueba.' })
    } finally {
      setTesting(false)
    }
  }

  async function handleDisconnect() {
    if (!window.confirm('¿Desvincular tu WhatsApp? El asistente va a dejar de responder a tus pacientes hasta que lo vuelvas a conectar.')) {
      return
    }
    setDisconnecting(true)
    try {
      const updated = await disconnect()
      setConnection(updated)
      setBusinessProfile(null)
      setTestResult(null)
    } finally {
      setDisconnecting(false)
    }
  }

  if (loading || !connection) {
    return (
      <LabLayout title="Conexión de WhatsApp" userLabel="Cargando…">
        <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">Cargando…</div>
      </LabLayout>
    )
  }

  const quality = QUALITY_LABEL[connection.qualityRating] ?? QUALITY_LABEL.YELLOW

  return (
    <LabLayout
      title="Conexión de WhatsApp"
      subtitle="Conectá tu WhatsApp Business para que el asistente pueda responder a tus pacientes"
      headerActions={
        <HelpButton title="Cómo conectar tu WhatsApp">
          <WhatsappTutorial />
        </HelpButton>
      }
    >
      <Card className="mb-6 p-5">
        <div className="flex items-center gap-2 text-base font-semibold text-[var(--text-strong)]">
          <Smartphone size={17} className="text-[var(--accent)]" /> Conexión en modo Coexistence
        </div>
        <p className="mt-1.5 text-sm text-[var(--muted)]">
          Seguís usando la app de WhatsApp Business en tu celular como siempre —chats, grupos,
          historial— mientras el asistente responde en paralelo por el mismo número. No se borra
          nada.
        </p>

        <div className="mt-4 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4 text-sm text-[var(--text)]">
          <p className="flex items-center gap-1.5 font-semibold text-[var(--text-strong)]">
            <Lock size={14} className="text-[var(--accent)]" /> Cosas para saber
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Alguien tiene que abrir la app de WhatsApp Business en el celular al menos una vez cada 14 días — si nadie la abre, WhatsApp pausa el asistente hasta que se vuelva a abrir.</li>
            <li>Los grupos y las llamadas siguen funcionando solo desde el celular, no pasan por el asistente.</li>
            <li>Algunas funciones del celular se desactivan mientras esté activo (mensajes que se autodestruyen, ubicación en vivo, listas de difusión clásicas).</li>
          </ul>
        </div>
      </Card>

      {!connection.connected && (
        <Card className="mb-6 border-[var(--accent)]/40 bg-[var(--accent)]/5 p-6">
          {EMBEDDED_SIGNUP_AVAILABLE ? (
            <>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-[var(--text-strong)]">Conectar tu WhatsApp</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Iniciás sesión con la cuenta de Facebook del laboratorio, elegís tu WhatsApp
                    Business, y listo — no hace falta copiar ningún código.
                  </p>
                </div>
                <Button type="button" onClick={handleEmbeddedSignup} disabled={signupLoading} className="shrink-0 px-5 py-3 text-sm">
                  {signupLoading ? 'Conectando…' : 'Conectar con Facebook'}
                </Button>
              </div>
              {signupError && (
                <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-red-400">
                  <XCircle size={16} /> {signupError}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-base font-semibold text-[var(--text-strong)]">Conectar tu WhatsApp</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                La conexión automática todavía no está disponible. Escribinos y lo conectamos por vos.
              </p>
            </>
          )}
          <p className="mt-4 text-sm text-[var(--muted)]">
            ¿Algo no funciona? No hace falta que sepas de tecnología:{' '}
            <a href={SUPPORT_MAILTO} className="font-semibold text-[var(--accent)] underline">
              contanos y te ayudamos
            </a>
            .
          </p>
        </Card>
      )}

      {connectConfirmed && (
        <p className="mb-6 flex items-center gap-1.5 text-sm font-medium text-emerald-400">
          <CheckCircle2 size={16} /> ¡Tu WhatsApp quedó conectado!
        </p>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)]">
            <Phone size={20} />
          </div>
          <div>
            <p className="text-base font-semibold text-[var(--text-strong)]">Estado de la conexión</p>
            <p className="text-sm text-[var(--muted)]">WhatsApp Business</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatusTile
            icon={connection.connected ? Wifi : WifiOff}
            iconClass={connection.connected ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}
            label="Estado"
          >
            {connection.connected ? (
              <Badge variant="success">
                <CheckCircle2 size={12} /> Conectado
              </Badge>
            ) : (
              <Badge variant="danger">
                <XCircle size={12} /> Desconectado
              </Badge>
            )}
          </StatusTile>
          <StatusTile icon={Phone} label="Número">
            <span className="text-base font-semibold text-[var(--text-strong)]">{connection.displayPhoneNumber || '—'}</span>
          </StatusTile>
          <StatusTile icon={BadgeCheck} label="Nombre verificado">
            <span className="text-base font-semibold text-[var(--text-strong)]">{connection.verifiedName || '—'}</span>
          </StatusTile>
          <StatusTile icon={Gauge} label="Calidad">
            {connection.connected ? (
              <Badge variant={quality.variant}>{quality.text}</Badge>
            ) : (
              <span className="text-base font-semibold text-[var(--text-strong)]">—</span>
            )}
          </StatusTile>
        </div>

        {connection.connected && (
          <div className="mt-6 border-t border-[var(--border)] pt-5">
            <p className="text-sm text-[var(--muted)]">
              Antes de enviar el mensaje de prueba: desde el celular con el "Teléfono de contacto"
              configurado en Configuración, mandale primero un WhatsApp cualquiera (ej. "hola") a tu
              número conectado. WhatsApp no deja que un negocio le escriba primero a alguien que nunca
              lo contactó.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" className="px-4 py-2.5 text-sm" onClick={handleTest} disabled={testing}>
                <Send size={15} />
                {testing ? 'Enviando…' : 'Enviar mensaje de prueba'}
              </Button>
              <Button type="button" variant="danger" className="px-4 py-2.5 text-sm" onClick={handleDisconnect} disabled={disconnecting}>
                <Unlink size={15} />
                {disconnecting ? 'Desvinculando…' : 'Desvincular WhatsApp'}
              </Button>
            </div>
            {testResult && (
              <p className={`mt-3 text-sm ${testResult.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                {testResult.message}
              </p>
            )}
          </div>
        )}
      </Card>

      {connection.connected && businessProfile && (
        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold text-[var(--text-strong)]">Perfil de WhatsApp Business</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Esto es lo que ven tus pacientes cuando tocan el nombre del chat — está de solo lectura
            acá, como referencia.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {businessProfile.vertical && (
              <div className="flex items-start gap-2.5 text-sm">
                <Tag size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Categoría</p>
                  <p className="text-[var(--text-strong)]">{businessProfile.vertical}</p>
                </div>
              </div>
            )}
            {businessProfile.email && (
              <div className="flex items-start gap-2.5 text-sm">
                <Mail size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Email</p>
                  <p className="text-[var(--text-strong)]">{businessProfile.email}</p>
                </div>
              </div>
            )}
            {businessProfile.websites?.length > 0 && (
              <div className="flex items-start gap-2.5 text-sm">
                <Globe size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Sitio web</p>
                  <p className="text-[var(--text-strong)]">{businessProfile.websites.join(', ')}</p>
                </div>
              </div>
            )}
            {businessProfile.description && (
              <div className="flex items-start gap-2.5 text-sm">
                <Building2 size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Descripción</p>
                  <p className="text-[var(--text-strong)]">{businessProfile.description}</p>
                </div>
              </div>
            )}
            {businessProfile.address && (
              <div className="flex items-start justify-between gap-3 sm:col-span-2">
                <div className="flex items-start gap-2.5 text-sm">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  <div>
                    <p className="text-xs text-[var(--muted)]">Dirección</p>
                    <p className="text-[var(--text-strong)]">{businessProfile.address}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 px-3 py-1.5 text-xs"
                  onClick={handleUseAddress}
                  disabled={addressCopied}
                >
                  <ArrowDownToLine size={13} />
                  {addressCopied ? 'Copiada a Configuración' : 'Usar en Configuración'}
                </Button>
              </div>
            )}
          </div>

          {!businessProfile.vertical && !businessProfile.email && !businessProfile.address && !businessProfile.description && (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Todavía no cargaste nada de esto en el perfil de WhatsApp Business.
            </p>
          )}
        </Card>
      )}
    </LabLayout>
  )
}
