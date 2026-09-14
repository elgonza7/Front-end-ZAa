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
    <div className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-xs text-white shadow-lg">
      <p className="text-[#8b949e]">{label}</p>
      <p className="font-semibold text-[#F8B500]">{payload[0].value} tokens</p>
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
        <div className="flex h-64 items-center justify-center text-sm text-[#8b949e]">
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
                <p className="text-sm font-semibold text-white">{status.title}</p>
                <p className="text-xs text-[#8b949e]">{status.detail}</p>
              </div>
              <Badge variant={style.badge} className="ml-auto shrink-0">
                {status.level === 'success' ? 'OK' : status.level === 'warning' ? 'Atención' : 'Caído'}
              </Badge>
            </Card>
          )
        })()}

        {handoffQueue.length > 0 && (
          <Card className="flex flex-col items-start gap-3 border-[#F8B500]/40 bg-gradient-to-r from-[#F8B500]/10 to-transparent p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F8B500] opacity-40" />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F8B500] to-[#e3c065] text-black">
                  <Headset size={18} />
                </span>
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  {handoffQueue.length === 1
                    ? '1 paciente está esperando atención humana'
                    : `${handoffQueue.length} pacientes están esperando atención humana`}
                </p>
                <p className="text-xs text-[#8b949e]">El bot pausó las respuestas automáticas en esas conversaciones.</p>
              </div>
            </div>
            <Button as={Link} to="/dashboard/conversaciones" className="shrink-0 px-4 py-2 text-xs">
              Ver conversaciones
              <ArrowRight size={14} />
            </Button>
          </Card>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Asistente de WhatsApp</p>
              <Switch
                checked={profile.botActive}
                onChange={handleToggleBot}
                label="Activar asistente de WhatsApp"
              />
            </div>
            <p className="mt-3 text-xs text-[#8b949e]">
              {profile.botActive
                ? 'El bot está respondiendo mensajes en tiempo real.'
                : 'El bot está apagado. No se responderán nuevos mensajes.'}
            </p>
            <Badge variant={profile.botActive ? 'success' : 'neutral'} className="mt-3">
              {profile.botActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-white">Estado de pago</p>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant={paymentVariant}>
                {profile.paymentStatus === 'PAID' ? 'Pagado' : profile.paymentStatus === 'OVERDUE' ? 'Vencido' : 'Pendiente'}
              </Badge>
            </div>
            <p className="mt-3 text-xs text-[#8b949e]">
              Próximo vencimiento: <span className="text-white">{profile.nextDueDate}</span>
            </p>
            <Button variant="outline" className="mt-4 w-full py-2 text-xs">
              Gestionar suscripción
            </Button>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-white">Tokens restantes</p>
            <p className="mt-2 text-xl font-bold text-white">
              {profile.tokensUsed.toLocaleString()}{' '}
              <span className="text-sm font-normal text-[#8b949e]">
                / {profile.tokensLimit.toLocaleString()}
              </span>
            </p>
            <ProgressBar value={profile.tokensUsed} max={profile.tokensLimit} className="mt-3" />
            <p className="mt-2 text-xs text-[#8b949e]">
              Clientes atendidos: <span className="text-white">{profile.clientsAttended.toLocaleString()}</span>
            </p>
            {profile.tokensUsed >= profile.tokensLimit ? (
              <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                Superaste el cupo de tu plan. El asistente sigue funcionando igual — el excedente se
                cobra automáticamente a ${profile.overagePricePer1kTokensUSD} USD cada 1.000 tokens.
              </p>
            ) : (
              <p className="mt-3 text-[11px] text-[#8b949e]">
                Si te pasás del cupo, el asistente no se corta: el excedente se cobra aparte a $
                {profile.overagePricePer1kTokensUSD} USD cada 1.000 tokens.
              </p>
            )}
          </Card>
        </div>

        {/* Analítica */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Consumo de tokens (últimos 7 días)</h2>
            </div>
            <div className="mt-4 h-64">
              {usageHistory.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-xs text-[#8b949e]">
                  Todavía no hay datos disponibles — el bot no registró consumo de tokens.
                </div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#30363d" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#30363d' }} />
                  <Line
                    type="monotone"
                    dataKey="tokens"
                    stroke="#F8B500"
                    strokeWidth={3}
                    dot={{ fill: '#F8B500', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-white">Preguntas más frecuentes</h2>
            {faqRanking.length === 0 && (
              <p className="mt-4 py-4 text-center text-xs text-[#8b949e]">
                Todavía no hay datos disponibles — esperando las primeras conversaciones.
              </p>
            )}
            <ul className="mt-4 space-y-3">
              {faqRanking.map((faq, index) => (
                <li key={faq.question} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#0d1117] text-[10px] font-bold text-[#F8B500] border border-[#30363d]">
                      {index + 1}
                    </span>
                    <span className="truncate text-sm text-[#e6e6e6]">{faq.question}</span>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-[#8b949e]">{faq.count}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </LabLayout>
  )
}
