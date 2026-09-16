import { Link } from 'react-router-dom'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import {
  MessageSquareText,
  GitBranch,
  Headset,
  BarChart3,
  Bell,
  ArrowRight,
} from 'lucide-react'
import LandingNavbar from '../components/layout/LandingNavbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'

const MINI_CHART_DATA = [
  { t: 0, v: 3200 }, { t: 1, v: 2100 }, { t: 2, v: 4300 }, { t: 3, v: 3800 },
  { t: 4, v: 5600 }, { t: 5, v: 4900 }, { t: 6, v: 6400 },
]

function PhoneFrame({ children }) {
  return (
    <div className="mx-auto w-full max-w-xs rounded-[28px] border-4 border-[var(--border)] bg-[var(--bg)] p-3 shadow-2xl">
      <div className="rounded-2xl bg-[var(--bg)] p-3">
        <div className="mb-3 flex items-center gap-2 border-b border-[var(--border)] pb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-soft)] text-xs font-bold text-black">
            LA
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-strong)]">Laboratorio Ameghino</p>
            <p className="text-[10px] text-emerald-400">en línea</p>
          </div>
        </div>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  )
}

function BotBubble({ children }) {
  return (
    <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)]">
      {children}
    </div>
  )
}

function UserBubble({ children }) {
  return (
    <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] px-3 py-2 text-xs font-medium text-black">
      {children}
    </div>
  )
}

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Panel de control con métricas en vivo',
    description:
      'Interacciones consumidas, clientes atendidos y estado de pago, todo en una sola pantalla. Sabés exactamente cuánto está usando tu asistente y cuánto te queda del plan.',
    mockup: (
      <Card className="p-5">
        <p className="text-xs font-semibold text-[var(--text-strong)]">Interacciones</p>
        <p className="mt-1 text-lg font-bold text-[var(--text-strong)]">
          4.580 <span className="text-xs font-normal text-[var(--muted)]">/ 10.000</span>
        </p>
        <div className="mt-3 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MINI_CHART_DATA}>
              <defs>
                <linearGradient id="featGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="var(--accent)" strokeWidth={2} fill="url(#featGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex gap-2">
          <Badge variant="success">Bot activo</Badge>
          <Badge variant="gold">Plan Profesional</Badge>
        </div>
      </Card>
    ),
  },
  {
    icon: GitBranch,
    title: 'Flujo de conversación con ramas ilimitadas',
    description:
      'Armá el árbol de respuestas de tu asistente sin escribir una línea de código: cada botón que ve el paciente es una rama que podés editar, anidar o borrar. Viene precargado con las indicaciones típicas de un laboratorio.',
    mockup: (
      <Card className="p-5 font-mono text-xs text-[var(--muted)]">
        <p className="text-[var(--text-strong)]">💬 Hola, ¿en qué puedo ayudarte?</p>
        <div className="ml-3 mt-2 border-l-2 border-[var(--border)] pl-3">
          <p>├─ 📅 Sacar turno</p>
          <p className="ml-3">│ ├─ 🌅 Turno mañana</p>
          <p className="ml-3">│ └─ 🌙 Turno tarde</p>
          <p>├─ 🏥 Obras Sociales</p>
          <p className="ml-3">│ ├─ PAMI</p>
          <p className="ml-3">│ └─ OSDE</p>
          <p>└─ 🙋 Hablar con un humano</p>
        </div>
      </Card>
    ),
  },
  {
    icon: MessageSquareText,
    title: 'El paciente conversa, no busca',
    description:
      'En vez de un menú confuso, el paciente escribe como le sale y toca las opciones que le vas mostrando. Así se siente una charla real, no un formulario.',
    mockup: (
      <PhoneFrame>
        <BotBubble>¡Hola! Soy el asistente virtual de Laboratorio Ameghino 🧪 ¿En qué puedo ayudarte hoy?</BotBubble>
        <UserBubble>Quiero consultar sobre obras sociales</UserBubble>
        <BotBubble>Escribinos el nombre de tu obra social y te contamos cómo autorizamos tus estudios.</BotBubble>
        <UserBubble>OSDE</UserBubble>
        <BotBubble>Podés compartirnos tu credencial digital o el token de autorización junto con tu DNI 👍</BotBubble>
      </PhoneFrame>
    ),
  },
  {
    icon: Headset,
    title: 'Atención humana cuando el bot no alcanza',
    description:
      'Si el paciente prefiere hablar con una persona, el bot se pausa automáticamente para esa conversación y te avisamos al instante — por panel y, si lo activás, también por email.',
    mockup: (
      <div className="space-y-3">
        <PhoneFrame>
          <UserBubble>Hola, tengo un problema con mi obra social y necesito que alguien me ayude</UserBubble>
          <UserBubble>🙋 Hablar con un humano</UserBubble>
          <BotBubble>Perfecto, un miembro del equipo va a tomar tu conversación en breve.</BotBubble>
        </PhoneFrame>
        <Card className="mx-auto flex max-w-xs items-center gap-3 p-3">
          <Bell size={18} className="shrink-0 text-[var(--accent)]" />
          <p className="text-xs text-[var(--text-strong)]">
            Nueva conversación esperando atención humana <span className="text-[var(--muted)]">· hace 1 min</span>
          </p>
        </Card>
      </div>
    ),
  },
]

export default function Features() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <LandingNavbar />

      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center">
        <h1 className="text-3xl font-extrabold text-[var(--text-strong)] sm:text-4xl">
          Todo lo que necesitás para atender a tus pacientes por WhatsApp
        </h1>
        <p className="mt-4 text-base text-[var(--muted)]">
          ZeroAutoapp no es solo un chatbot: es el panel completo para configurarlo, medirlo y
          mantenerlo bajo control.
        </p>
      </section>

      <section className="mx-auto max-w-6xl space-y-20 px-6 pb-24">
        {FEATURES.map(({ icon: Icon, title, description, mockup }, index) => {
          const textBlock = (
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
                <Icon size={20} />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-[var(--text-strong)]">{title}</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">{description}</p>
            </div>
          )
          const mockupBlock = <div>{mockup}</div>
          const isReversed = index % 2 === 1

          return (
            <div key={title} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              {isReversed ? (
                <>
                  <div className="lg:order-2">{textBlock}</div>
                  <div className="lg:order-1">{mockupBlock}</div>
                </>
              ) : (
                <>
                  {textBlock}
                  {mockupBlock}
                </>
              )}
            </div>
          )
        })}
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <Button as={Link} to="/precios" className="px-6 py-3 text-base">
          Ver planes y precios
          <ArrowRight size={18} />
        </Button>
      </section>

      <Footer />
    </div>
  )
}
