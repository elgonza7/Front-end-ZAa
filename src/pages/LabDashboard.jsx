import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Headset, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Switch from '../components/ui/Switch.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import Button from '../components/ui/Button.jsx'
import { getLabProfile, toggleBot, getTokenUsageHistory, getFaqRanking } from '../api/labService.js'
import { getHandoffQueue } from '../api/handoffService.js'
import { getConnection } from '../api/whatsappService.js'

// Semáforo de estado general: un vistazo, sin tener que interpretar nada.
// Rojo = el asistente no puede atender pacientes ahora mismo. Amarillo =
// funciona, pero hay algo para revisar pronto. Verde = todo en orden.
function computeOverallStatus({ profile, connected }) {
  if (!connected) {
    return { level: 'danger', title: 'El asistente no puede responder', detail: 'Todavía no conectaste tu número de WhatsApp.', icon: XCircle }
  }
  if (profile.paymentStatus === 'OVERDUE') {
    return { level: 'danger', title: 'El asistente no puede responder', detail: 'Tu suscripción está vencida — regularizala desde Facturación.', icon: XCircle }
  }
  if (!profile.botActive) {
    return { level: 'warning', title: 'El asistente está pausado', detail: 'Lo apagaste vos desde este panel — los pacientes no reciben respuesta automática.', icon: AlertTriangle }
  }
  if (profile.paymentStatus === 'PENDING') {
    return { level: 'warning', title: 'Funcionando, con un pendiente', detail: 'Tenés un pago pendiente de confirmación en Facturación.', icon: AlertTriangle }
  }
  if (profile.tokensUsed >= profile.tokensLimit) {
    return { level: 'warning', title: 'Funcionando, pasaste tu cupo', detail: 'El asistente sigue respondiendo — el excedente se cobra aparte.', icon: AlertTriangle }
  }
  return { level: 'success', title: 'Todo funcionando correctamente', detail: 'Tu asistente está conectado y respondiendo a tus pacientes.', icon: CheckCircle2 }
}

const STATUS_STYLE = {
  success: { badge: 'success', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', iconColor: 'text-emerald-400' },
  warning: { badge: 'warning', border: 'border-amber-500/30', bg: 'bg-amber-500/5', iconColor: 'text-amber-400' },
  danger: { badge: 'danger', border: 'border-red-500/30', bg: 'bg-red-500/5', iconColor: 'text-red-400' },
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-strong)] shadow-lg">
      <p className="text-[var(--muted)]">{label}</p>
      <p className="font-semibold text-[var(--accent)]">{payload[0].value.toLocaleString('es-AR')} interacciones</p>
    </div>
  )
}

export default function LabDashboard() {
  const [profile, setProfile] = useState(null)
  const [usageHistory, setUsageHistory] = useState([])
  const [faqRanking, setFaqRanking] = useState([])
  const [handoffQueue, setHandoffQueue] = useState([])
  const [whatsappConnected, setWhatsappConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getLabProfile(), getTokenUsageHistory(), getFaqRanking(), getHandoffQueue(), getConnection()])
      .then(([profileData, usageData, faqData, handoffData, connectionData]) => {
        setProfile(profileData)
        setUsageHistory(usageData)
        setFaqRanking(faqData)
        setHandoffQueue(handoffData)
        setWhatsappConnected(connectionData.connected)
      })
      .catch((err) => setError(err.message || 'No se pudo cargar el panel del laboratorio.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleToggleBot(next) {
    setProfile((prev) => ({ ...prev, botActive: next }))
    await toggleBot(next)
  }

  if (error) {
    return (
      <LabLayout title="Panel de control" userLabel="Error">
        <div className="flex h-64 items-center justify-center text-sm text-red-400">{error}</div>
      </LabLayout>
    )
  }

  if (loading || !profile) {
    return (
      <LabLayout title="Panel de control" userLabel="Cargando…">
        <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
          Cargando panel del laboratorio…
        </div>
      </LabLayout>
    )
  }

  const paymentVariant =
    profile.paymentStatus === 'PAID' ? 'success' : profile.paymentStatus === 'OVERDUE' ? 'danger' : 'warning'

  return (
    <LabLayout
      title={`Hola, ${profile.name}`}
      subtitle="Centralizá la gestión de tu asistente de WhatsApp"
      userLabel={profile.name}
    >
      <div className="space-y-6">
        {(() => {
          const status = computeOverallStatus({ profile, connected: whatsappConnected })
          const style = STATUS_STYLE[status.level]
          const Icon = status.icon
          return (
            <Card className={`flex items-center gap-3.5 border p-4 ${style.border} ${style.bg}`}>
              <Icon size={26} className={`shrink-0 ${style.iconColor}`} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-strong)]">{status.title}</p>
                <p className="text-xs text-[var(--muted)]">{status.detail}</p>
              </div>
              <Badge variant={style.badge} className="ml-auto shrink-0">
                {status.level === 'success' ? 'OK' : status.level === 'warning' ? 'Atención' : 'Caído'}
              </Badge>
            </Card>
          )
        })()}

        {handoffQueue.length > 0 && (() => {
          const humanCount = handoffQueue.filter((t) => t.reason !== 'ResultsRequest').length
          const resultsCount = handoffQueue.length - humanCount
          const parts = []
          if (humanCount > 0) parts.push(humanCount === 1 ? '1 paciente pidió hablar con alguien' : `${humanCount} pacientes pidieron hablar con alguien`)
          if (resultsCount > 0) parts.push(resultsCount === 1 ? '1 paciente espera que le envíes su resultado' : `${resultsCount} pacientes esperan que les envíes su resultado`)

          return (
            <Card className="flex flex-col items-start gap-3 border-[var(--accent)]/40 bg-gradient-to-r from-[var(--accent)]/10 to-transparent p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-40" />
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-soft)] text-black">
                    <Headset size={18} />
                  </span>
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-strong)]">{parts.join(' — ')}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {humanCount > 0 && resultsCount > 0
                      ? 'El bot pausó las conversaciones de handoff; las de resultados siguen respondiéndose solas.'
                      : humanCount > 0
                        ? 'El bot pausó las respuestas automáticas en esas conversaciones.'
                        : 'El bot les sigue respondiendo normal mientras les enviás el resultado.'}
                  </p>
                </div>
              </div>
              <Button as={Link} to="/dashboard/conversaciones" className="shrink-0 px-4 py-2 text-xs">
                Ver atención humana
                <ArrowRight size={14} />
              </Button>
            </Card>
          )
        })()}

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text-strong)]">Asistente de WhatsApp</p>
              <Switch
                checked={profile.botActive}
                onChange={handleToggleBot}
                label="Activar asistente de WhatsApp"
              />
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">
              {profile.botActive
                ? 'El bot está respondiendo mensajes en tiempo real.'
                : 'El bot está apagado. No se responderán nuevos mensajes.'}
            </p>
            <Badge variant={profile.botActive ? 'success' : 'neutral'} className="mt-3">
              {profile.botActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-[var(--text-strong)]">Estado de pago</p>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant={paymentVariant}>
                {profile.paymentStatus === 'PAID' ? 'Pagado' : profile.paymentStatus === 'OVERDUE' ? 'Vencido' : 'Pendiente'}
              </Badge>
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">
              Próximo vencimiento: <span className="text-[var(--text-strong)]">{profile.nextDueDate}</span>
            </p>
            <Button variant="outline" className="mt-4 w-full py-2 text-xs">
              Gestionar suscripción
            </Button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text-strong)]">Interacciones usadas este mes</p>
              <Badge variant="gold">Plan {profile.planName}</Badge>
            </div>
            <p className="mt-2 text-xl font-bold text-[var(--text-strong)]">
              {profile.tokensUsed.toLocaleString()}{' '}
              <span className="text-sm font-normal text-[var(--muted)]">
                / {profile.tokensLimit.toLocaleString()} incluidas en tu plan
              </span>
            </p>
            <ProgressBar value={profile.tokensUsed} max={profile.tokensLimit} className="mt-3" />
            <p className="mt-2 text-xs text-[var(--muted)]">
              Clientes atendidos: <span className="text-[var(--text-strong)]">{profile.clientsAttended.toLocaleString()}</span>
            </p>
            {profile.averageTokensPerInteraction > 0 && (
              <p className="mt-1 text-xs text-[var(--muted)]">
                Cada interacción te consume en promedio{' '}
                <span className="text-[var(--text-strong)]">
                  ~{profile.averageTokensPerInteraction.toLocaleString()} tokens
                </span>{' '}
                este mes
                {profile.tokensUsed < profile.tokensLimit && (
                  <>
                    {' '}— con ese promedio te quedan ~
                    {Math.floor((profile.tokensLimit - profile.tokensUsed) / profile.averageTokensPerInteraction).toLocaleString()}{' '}
                    interacciones más en tu cupo
                  </>
                )}
                .
              </p>
            )}
            {profile.tokensUsed >= profile.tokensLimit ? (
              <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                <p>
                  Superaste el cupo de tu plan. El asistente sigue funcionando igual — el excedente se
                  cobra automáticamente a ${profile.overagePricePer1kTokensUSD} USD cada 1.000 interacciones.
                </p>
                <Link to="/dashboard/facturacion" className="mt-1.5 inline-block font-semibold underline">
                  Te recomendamos pasarte al siguiente plan para no tener sorpresas el próximo mes →
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-[11px] text-[var(--muted)]">
                Si te pasás del cupo, el asistente no se corta: el excedente se cobra aparte a $
                {profile.overagePricePer1kTokensUSD} USD cada 1.000 interacciones.
              </p>
            )}
          </Card>
        </div>

        {/* Analítica */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--text-strong)]">Interacciones (últimos 7 días)</h2>
            </div>
            <div className="mt-4 h-64">
              {usageHistory.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-xs text-[var(--muted)]">
                  Todavía no hay datos disponibles — el bot no registró interacciones.
                </div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)' }} />
                  <Line
                    type="monotone"
                    dataKey="tokens"
                    stroke="var(--accent)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--accent)', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-[var(--text-strong)]">Preguntas más frecuentes</h2>
            {faqRanking.length === 0 && (
              <p className="mt-4 py-4 text-center text-xs text-[var(--muted)]">
                Todavía no hay datos disponibles — esperando las primeras conversaciones.
              </p>
            )}
            <ul className="mt-4 space-y-3">
              {faqRanking.map((faq, index) => (
                <li key={faq.question} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--bg)] text-[10px] font-bold text-[var(--accent)] border border-[var(--border)]">
                      {index + 1}
                    </span>
                    <span className="truncate text-sm text-[var(--text)]">{faq.question}</span>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-[var(--muted)]">{faq.count}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </LabLayout>
  )
}
