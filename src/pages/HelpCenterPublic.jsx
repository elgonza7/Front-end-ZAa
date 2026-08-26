import { Mail, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import LandingNavbar from '../components/layout/LandingNavbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'

const SUPPORT_EMAIL = 'zeroautoapp@gmail.com'

export default function HelpCenterPublic() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <LandingNavbar />

      <section className="mx-auto max-w-2xl px-6 pb-24 pt-20 text-center">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Centro de Ayuda</h1>
        <p className="mt-4 text-base text-[#8b949e]">
          ¿Tenés dudas sobre cómo funciona ZeroAutoapp o necesitás soporte técnico? Escribinos.
        </p>

        <Card className="mt-8 p-6 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#30363d] bg-[#0d1117] text-[#F8B500]">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Contacto técnico</p>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm text-[#F8B500] hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#8b949e]">
            Respondemos en horario comercial de San Juan, Argentina. Para reportar un problema
            puntual o dejar una sugerencia sobre tu cuenta, si ya sos cliente, hacelo desde el{' '}
            <strong>Centro de Ayuda</strong> dentro de tu panel — así queda asociado a tu
            laboratorio y lo podemos hacer seguimiento.
          </p>
          <Button as="a" href={`mailto:${SUPPORT_EMAIL}`} className="mt-5 px-4 py-2.5 text-sm">
            <Mail size={16} />
            Escribir por email
          </Button>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#8b949e]">
          ¿Ya sos cliente?
          <Link to="/login" className="inline-flex items-center gap-1 text-[#F8B500] hover:underline">
            <LogIn size={14} />
            Iniciar sesión
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
