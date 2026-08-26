import { Link } from 'react-router-dom'
import { Check, ArrowRight, CreditCard, Landmark } from 'lucide-react'
import LandingNavbar from '../components/layout/LandingNavbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { PLAN_PRICING } from '../lib/pricing.js'

const PLAN_FEATURES = {
  Básico: [
    '1 número de WhatsApp',
    'Flujo de conversación completo',
    'Corrección de mensajes con IA (motor conversacional + Gemini)',
    'Base de conocimiento (PDF)',
    'Soporte por email',
  ],
  Profesional: [
    'Todo lo del plan Básico',
    'Más tokens mensuales',
    'Métricas de preguntas frecuentes',
    'Atención humana con notificación por email',
  ],
  Premium: [
    'Todo lo del plan Profesional',
    'Mayor volumen de tokens',
    'Soporte prioritario',
    'Descuentos por laboratorio adicional del mismo dueño',
  ],
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <LandingNavbar />

      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Planes y precios</h1>
        <p className="mt-4 text-base text-[#8b949e]">
          Pagás una habilitación única al contratar y después una cuota mensual que depende de
          cuántos tokens de IA consume tu asistente. Esa cuota cubre las dos IA del asistente: el
          motor conversacional que responde a tus pacientes y Gemini, que corrige y prolija los
          mensajes del flujo con el botón "Mejorar con IA".
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Object.entries(PLAN_PRICING).map(([planName, plan]) => (
            <Card
              key={planName}
              className={`flex flex-col p-6 ${planName === 'Profesional' ? 'border-[#F8B500]/50' : ''}`}
            >
              {planName === 'Profesional' && (
                <span className="mb-3 inline-flex w-fit items-center rounded-full bg-gradient-to-r from-[#F8B500] to-[#FCEABB] px-2.5 py-1 text-[11px] font-bold text-black">
                  MÁS ELEGIDO
                </span>
              )}
              <h2 className="text-lg font-bold text-white">{planName}</h2>

              <div className="mt-3">
                <p className="text-3xl font-extrabold text-white">
                  ${plan.priceUSD}
                  <span className="text-sm font-normal text-[#8b949e]"> USD/mes</span>
                </p>
                <p className="mt-1 text-xs text-[#8b949e]">
                  + ${plan.setupFeeUSD} USD de habilitación (pago único, al contratar)
                </p>
              </div>

              <p className="mt-2 text-xs text-[#e3c065]">{plan.tokensLimit.toLocaleString()} tokens de IA por mes</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {PLAN_FEATURES[planName].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[#e6e6e6]">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                as={Link}
                to="/login"
                variant={planName === 'Profesional' ? 'primary' : 'outline'}
                className="mt-6 w-full py-2.5 text-sm"
              >
                Empezar con {planName}
                <ArrowRight size={16} />
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <Card className="p-6">
          <h2 className="text-base font-bold text-white">¿Cómo funciona el pago?</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#30363d] bg-[#0d1117] text-[#F8B500]">
                <Landmark size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">1. Habilitación (una sola vez)</p>
                <p className="mt-1 text-xs text-[#8b949e]">
                  Al contratar, se abona un pago único que activa tu cuenta, tu número de WhatsApp y
                  la carga inicial de tu flujo de conversación.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#30363d] bg-[#0d1117] text-[#F8B500]">
                <CreditCard size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">2. Cuota mensual, sin compromiso</p>
                <p className="mt-1 text-xs text-[#8b949e]">
                  Por defecto el cobro es automático con Mercado Pago: se renueva solo cada mes y
                  podés cancelar cuando quieras desde el panel de Facturación. Si cancelás antes de
                  la fecha de corte, no se te cobra el próximo período — igual seguís con el
                  servicio activo hasta que termine el que ya pagaste. También podés pagar por
                  transferencia (alias/CVU en pesos, alias/CBU en dólares) y avisarlo desde la app.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-5 text-xs text-[#8b949e]">
            ¿Tenés más de un laboratorio? El 2° laboratorio del mismo dueño tiene 15% de descuento
            y el 3° en adelante, 25% — se gestiona desde el panel de Facturación.
          </p>
        </Card>
      </section>

      <Footer />
    </div>
  )
}
