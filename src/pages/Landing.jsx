import { Link } from 'react-router-dom'
import { ArrowRight, MessageSquareText, ShieldCheck, Zap, FileText } from 'lucide-react'
import LandingNavbar from '../components/layout/LandingNavbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'

const FEATURES = [
  {
    icon: MessageSquareText,
    title: 'Asistente 24/7 en WhatsApp',
    description:
      'Responde turnos, requisitos de ayuno y consultas frecuentes al instante, sin depender de un teléfono físico.',
  },
  {
    icon: FileText,
    title: 'Base de conocimiento propia',
    description:
      'Cargá cartillas médicas en PDF y la IA responde únicamente con la información de tu laboratorio.',
  },
  {
    icon: ShieldCheck,
    title: 'Datos aislados por laboratorio',
    description:
      'Arquitectura multi-tenant: cada institución accede solo a sus propios datos y configuraciones.',
  },
  {
    icon: Zap,
    title: 'Panel de control en tiempo real',
    description:
      'Encendé o apagá el bot, controlá interacciones consumidas y tu estado de suscripción desde un solo lugar.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <LandingNavbar />

      <section className="mx-auto max-w-5xl px-6 pb-20 pt-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--accent-soft)]">
          Software para laboratorios clínicos
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-[var(--text-strong)] sm:text-5xl md:text-6xl">
          Automatización inteligente para{' '}
          <span className="bg-gradient-to-r from-[var(--accent)] to-[#FCEABB] bg-clip-text text-transparent">
            Laboratorios
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">
          Centralizá la atención por WhatsApp de tus pacientes con un asistente de inteligencia
          artificial entrenado con tu propia información. Gestioná todo desde un panel simple y
          seguro.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button as={Link} to="/login" className="px-6 py-3 text-base">
            Comenzar ahora
            <ArrowRight size={18} />
          </Button>
          <Button as="a" href="#contacto" variant="outline" className="px-6 py-3 text-base">
            Hablar con ventas
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)]">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[var(--text-strong)]">{title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="contacto" className="mx-auto max-w-4xl px-6 pb-24">
        <Card className="flex flex-col items-center gap-4 p-10 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-strong)]">¿Listo para automatizar tu laboratorio?</h2>
          <p className="max-w-xl text-sm text-[var(--muted)]">
            Escribinos y te ayudamos a configurar tu asistente de WhatsApp en menos de una semana.
          </p>
          <Button as="a" href="mailto:contacto@zeroautoapp.com" className="px-6 py-3">
            Contactar equipo comercial
          </Button>
        </Card>
      </section>

      <Footer />
    </div>
  )
}
