import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Headset, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Switch from '../components/ui/Switch.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import Button from '../components/ui/Button.jsx'
import HelpButton from '../components/ui/HelpButton.jsx'
import { getLabProfile, toggleBot, getTokenUsageHistory, getFaqRanking, getPatientsPerDay, getMessagesByHour } from '../api/labService.js'
import { getHandoffQueue } from '../api/handoffService.js'
import { getConnection } from '../api/whatsappService.js'
import { AVG_TOKENS_PER_INTERACTION_ESTIMATE } from '../lib/pricing.js'

export function PanelTutorial() {
  return (
    <>
      <p>
        Este es el <strong>Panel</strong>: el primer vistazo a cómo está funcionando tu asistente,
        sin tener que entrar a ninguna otra sección.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>El cartel de arriba de todo</strong> (verde, amarillo o rojo) te dice de un
          vistazo si todo está en orden, si hay algo para revisar, o si el asistente no puede
          responder ahora mismo (y por qué).
        </li>
        <li>
          <strong>Asistente de WhatsApp:</strong> el interruptor prende o apaga las respuestas
          automáticas. Apagalo solo si necesitás que un humano se haga cargo de todo por un rato.
        </li>
        <li>
          <strong>Estado de pago:</strong> si dice "Pendiente" o "Vencido", andá a Facturación
          para regularizarlo antes de que afecte el servicio.
        </li>
        <li>
          <strong>Interacciones usadas este mes:</strong> cuántos mensajes de respuesta le mandó tu
          asistente a pacientes, del cupo de tu plan. Es un número estimado (tu plan en realidad se
          mide en tokens, la unidad con la que la IA mide texto — lo ves más chico al lado) porque
          "interacciones" es más fácil de entender de un vistazo que "tokens". Superar el cupo no
          corta el servicio — el excedente se cobra aparte, y te avisamos ahí mismo si conviene
          pasarte a un plan más grande.
        </li>
        <li>
          <strong>El gráfico:</strong> cuánto usó el asistente en los últimos 7 días, para ver si
          viene subiendo o bajando.
        </li>
        <li>
          <strong>Preguntas más frecuentes:</strong> los temas que más preguntan tus pacientes —
          útil para saber qué información reforzar en el flujo de conversación.
        </li>
      </ul>
      <p>
        Si aparece un cartel de "pacientes esperando", es que alguien pidió hablar con una persona
        o está esperando que le envíes su resultado — se resuelve desde "Atención humana".
      </p>
    </>
  )
}

// Semáforo de estado general: un vistazo, sin tener que interpretar nada.
// Rojo = el asistente no puede atender pacientes ahora mismo. Amarillo =
// funciona, pero hay algo para revisar pronto. Verde = todo en orden.
function computeOverallStatus({ profile, connected }) {
  if (!connected) {
    return {
      level: 'danger',
      title: 'El asistente no puede responder',
      detail: 'Todavía no conectaste tu número de WhatsApp.',
      icon: XCircle,
      cta: { label: 'Conectar WhatsApp', to: '/dashboard/whatsapp' },
    }
  }
  if (profile.paymentStatus === 'OVERDUE') {
    return {
      level: 'danger',
      title: 'El asistente no puede responder',
      detail: 'Tu suscripción está vencida — regularizala desde Facturación.',
      icon: XCircle,
      cta: { label: 'Regularizar pago', to: '/dashboard/facturacion' },
    }
  }
  if (!profile.botActive) {
    return { level: 'warning', title: 'El asistente está pausado', detail: 'Lo apagaste vos desde este panel — los pacientes no reciben respuesta automática.', icon: AlertTriangle }
  }
  if (profile.paymentStatus === 'PENDING') {
    return {
      level: 'warning',
      title: 'Funcionando, con un pendiente',
      detail: 'Tenés un pago pendiente de confirmación en Facturación.',
      icon: AlertTriangle,
      cta: { label: 'Ver Facturación', to: '/dashboard/facturacion' },
    }
  }
  if (profile.tokensUsed >= profile.tokensLimit) {
    return {
      level: 'warning',
      title: 'Funcionando, pasaste tu cupo',
      detail: 'El asistente sigue respondiendo — el excedente se cobra aparte.',
      icon: AlertTriangle,
      cta: { label: 'Ver planes', to: '/dashboard/facturacion' },
    }
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
      <p className="font-semibold text-[var(--accent)]">~{payload[0].value.toLocaleString('es-AR')} interacciones</p>
    </div>
  )
}

function BarTooltip({ active, payload, label, unit, formatLabel }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-strong)] shadow-lg">
      <p className="text-[var(--muted)]">{formatLabel ? formatLabel(label) : label}</p>
      <p className="font-semibold text-[var(--accent)]">{payload[0].value.toLocaleString('es-AR')} {unit}</p>
    </div>
  )
}

export default function LabDashboard() {
  const [profile, setProfile] = useState(null)
  const [usageHistory, setUsageHistory] = useState([])
  const [faqRanking, setFaqRanking] = useState([])
  const [patientsPerDay, setPatientsPerDay] = useState([])
  const [messagesByHour, setMessagesByHour] = useState([])
  const [handoffQueue, setHandoffQueue] = useState([])
  const [whatsappConnected, setWhatsappConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      getLabProfile(),
      getTokenUsageHistory(),
      getFaqRanking(),
      getHandoffQueue(),
      getConnection(),
      getPatientsPerDay(),
      getMessagesByHour(),
    ])
      .then(([profileData, usageData, faqData, handoffData, connectionData, patientsData, hourData]) => {
        setProfile(profileData)
        setUsageHistory(usageData)
        setFaqRanking(faqData)
        setHandoffQueue(handoffData)
        setWhatsappConnected(connectionData.connected)
        setPatientsPerDay(patientsData)
        setMessagesByHour(hourData)
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

  // Un token no le dice nada a un dueño de laboratorio — "interacciones"
  // (mensajes de respuesta a un paciente) sí. Con datos reales del mes se
  // usa el promedio real; sin uso todavía, se cae a una estimación general
  // para no mostrar "0 tokens por interacción" ni dividir por cero.
  const avgTokensPerInteraction = profile.averageTokensPerInteraction > 0
    ? profile.averageTokensPerInteraction
    : AVG_TOKENS_PER_INTERACTION_ESTIMATE
  const interactionsUsed = Math.round(profile.tokensUsed / avgTokensPerInteraction)
  const interactionsLimit = Math.round(profile.tokensLimit / avgTokensPerInteraction)

  return (
    <LabLayout
      title={`Hola, ${profile.name}`}
      subtitle="Centralizá la gestión de tu asistente de WhatsApp"
      userLabel={profile.name}
      headerActions={
        <HelpButton title="Cómo leer el Panel">
          <PanelTutorial />
        </HelpButton>
      }
    >
      <div className="space-y-6">
        {(() => {
          const status = computeOverallStatus({ profile, connected: whatsappConnected })
          const style = STATUS_STYLE[status.level]
          const Icon = status.icon
          return (
            <Card className={`flex items-center gap-3.5 border p-4 ${style.border} ${style.bg}`}>
              <Icon size={26} className={`shrink-0 ${style.iconColor}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text-strong)]">{status.title}</p>
                <p className="text-xs text-[var(--muted)]">{status.detail}</p>
              </div>
              {status.cta && (
                <Button as={Link} to={status.cta.to} variant="outline" className="ml-auto shrink-0 px-3.5 py-2 text-xs">
                  {status.cta.label}
                  <ArrowRight size={13} />
                </Button>
              )}
              <Badge variant={style.badge} className={`shrink-0 ${status.cta ? '' : 'ml-auto'}`}>
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
            <Button as={Link} to="/dashboard/facturacion" variant="outline" className="mt-4 w-full py-2 text-xs">
              Gestionar suscripción
            </Button>
          </Card>

        </div>

        {/* Interacciones usadas este mes — ancho completo, desglose a la derecha.
            El número grande es interacciones (mensajes de respuesta a un
            paciente) porque es lo que un dueño de laboratorio entiende de
            un vistazo; los tokens (la unidad real de facturación) quedan
            como aclaración chica al lado. */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--text-strong)]">Interacciones usadas este mes</p>
            <Badge variant="gold">Plan {profile.planName}</Badge>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-xl font-bold text-[var(--text-strong)]">
                ~{interactionsUsed.toLocaleString()}{' '}
                <span className="text-sm font-normal text-[var(--muted)]">
                  / ~{interactionsLimit.toLocaleString()} interacciones incluidas en tu plan
                </span>
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                {profile.tokensUsed.toLocaleString()} / {profile.tokensLimit.toLocaleString()} tokens
                (cada interacción usa ~{avgTokensPerInteraction.toLocaleString()} tokens aprox.)
              </p>
              <ProgressBar value={profile.tokensUsed} max={profile.tokensLimit} className="mt-3" />
              <p className="mt-2 text-xs text-[var(--muted)]">
                Clientes atendidos: <span className="text-[var(--text-strong)]">{profile.clientsAttended.toLocaleString()}</span>
              </p>
              {profile.tokensUsed >= profile.tokensLimit && (
                <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                  <p>Superaste el cupo de tu plan. El asistente sigue funcionando igual — el excedente se cobra aparte.</p>
                  <Link to="/dashboard/facturacion" className="mt-1.5 inline-block font-semibold underline">
                    Te recomendamos pasarte al siguiente plan para no tener sorpresas el próximo mes →
                  </Link>
                </div>
              )}
            </div>

            <div className="space-y-2.5 border-t border-[var(--border)] pt-3.5 md:border-l md:border-t-0 md:pl-5 md:pt-0">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted)]">Interacciones incluidas (estimado)</span>
                <span className="font-semibold text-[var(--text-strong)]">~{interactionsLimit.toLocaleString()} / mes</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted)]">Cada interacción usa</span>
                <span className="font-semibold text-[var(--text-strong)]">~{avgTokensPerInteraction.toLocaleString()} tokens</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted)]">Si se supera el cupo, se cobra</span>
                <span className="font-semibold text-[var(--text-strong)]">${profile.overagePricePer1kTokensUSD} USD c/1.000 tokens</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted)]">Costo aprox. por interacción</span>
                <span className="font-semibold text-[var(--text-strong)]">
                  ~${((profile.overagePricePer1kTokensUSD / 1000) * avgTokensPerInteraction).toFixed(4)} USD
                </span>
              </div>
              {profile.tokensUsed < profile.tokensLimit && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted)]">Con ese promedio, te quedan</span>
                  <span className="font-semibold text-[var(--text-strong)]">
                    ~{Math.floor((profile.tokensLimit - profile.tokensUsed) / avgTokensPerInteraction).toLocaleString()} interacciones
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Analítica */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--text-strong)]">Interacciones (últimos 7 días)</h2>
              <Button as={Link} to="/dashboard/historial" variant="outline" className="shrink-0 px-3 py-1.5 text-xs">
                Ver meses pasados
              </Button>
            </div>
            <div className="mt-4 h-64">
              {usageHistory.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-xs text-[var(--muted)]">
                  Todavía no hay datos disponibles — el bot no tuvo actividad.
                </div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={usageHistory.map((d) => ({ day: d.day, interactions: Math.round(d.tokens / avgTokensPerInteraction) }))}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)' }} />
                  <Line
                    type="monotone"
                    dataKey="interactions"
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

        {/* Analítica avanzada */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-[var(--text-strong)]">Pacientes atendidos por día</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Personas distintas que le escribieron al asistente cada día (últimos 7 días) — no cuenta
              mensajes repetidos de la misma persona.
            </p>
            <div className="mt-4 h-56">
              {patientsPerDay.every((d) => d.patients === 0) ? (
                <div className="flex h-full items-center justify-center text-center text-xs text-[var(--muted)]">
                  Todavía no hay datos disponibles.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientsPerDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<BarTooltip unit="pacientes" />} cursor={{ fill: 'var(--border)', opacity: 0.3 }} />
                    <Bar dataKey="patients" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-[var(--text-strong)]">Mensajes por hora del día</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              A qué hora te suelen escribir los pacientes (últimos 30 días, hora Argentina) — útil para
              saber cuándo conviene tener a alguien más atento.
            </p>
            <div className="mt-4 h-56">
              {messagesByHour.every((h) => h.count === 0) ? (
                <div className="flex h-full items-center justify-center text-center text-xs text-[var(--muted)]">
                  Todavía no hay datos disponibles.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={messagesByHour} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="hour"
                      tickFormatter={(hour) => `${String(hour).padStart(2, '0')}h`}
                      interval={2}
                      stroke="var(--muted)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      content={<BarTooltip unit="mensajes" formatLabel={(hour) => `${String(hour).padStart(2, '0')}:00`} />}
                      cursor={{ fill: 'var(--border)', opacity: 0.3 }}
                    />
                    <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>
      </div>
    </LabLayout>
  )
}
