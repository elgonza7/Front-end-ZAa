import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, CreditCard, Landmark, Calculator, HelpCircle, Smartphone, Server } from 'lucide-react'
import LandingNavbar from '../components/layout/LandingNavbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { PLAN_PRICING, AVG_TOKENS_PER_INTERACTION_ESTIMATE } from '../lib/pricing.js'

// Estimación para recomendar un plan según cuántos pacientes por día
// escriben por WhatsApp: ~7.500 tokens promedio por conversación completa
// (el bot reenvía el prompt de sistema + historial reciente en cada una de
// las ~5 respuestas típicas de una conversación), contactos/día × 30 días
// × 7.500 tokens, comparado contra el cupo de cada plan. Es una guía, no
// una promesa exacta — el consumo real depende de cuán largas son las
// conversaciones de cada laboratorio.
const TOKENS_PER_CONTACT_ESTIMATE = 7500
const CALCULATOR_MAX_CONTACTS = 30

function recommendPlan(dailyContacts) {
  if (dailyContacts <= 5) return 'Básico'
  if (dailyContacts <= 12) return 'Profesional'
  return 'Premium'
}

function PlanCalculator() {
  const [dailyContacts, setDailyContacts] = useState(5)
  const recommended = recommendPlan(dailyContacts)
  const estimatedTokens = dailyContacts * 30 * TOKENS_PER_CONTACT_ESTIMATE
  const estimatedInteractions = Math.round(estimatedTokens / AVG_TOKENS_PER_INTERACTION_ESTIMATE)
  const recommendedInteractions = Math.round(PLAN_PRICING[recommended].tokensLimit / AVG_TOKENS_PER_INTERACTION_ESTIMATE)

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Calculator size={16} className="text-[var(--accent)]" />
        <h2 className="text-base font-bold text-[var(--text-strong)]">¿No sabés qué plan te conviene?</h2>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        Contanos más o menos cuántos pacientes distintos te escriben por WhatsApp por día y te
        decimos qué plan te alcanza sin quedarte corto.
      </p>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm text-[var(--text-strong)]">
          <span>Pacientes que te contactan por día</span>
          <span className="font-bold text-[var(--accent)]">
            {dailyContacts}
            {dailyContacts === CALCULATOR_MAX_CONTACTS ? '+' : ''}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={CALCULATOR_MAX_CONTACTS}
          value={dailyContacts}
          onChange={(event) => setDailyContacts(Number(event.target.value))}
          className="mt-3 w-full accent-[var(--accent)]"
        />
        <div className="mt-1 flex justify-between text-[10px] text-[var(--muted)]">
          <span>1</span>
          <span>{CALCULATOR_MAX_CONTACTS}+</span>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4">
        <p className="text-xs text-[var(--muted)]">Plan recomendado</p>
        <p className="mt-1 text-lg font-bold text-[var(--text-strong)]">{recommended}</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Con ~{estimatedInteractions.toLocaleString()} interacciones estimadas por mes, entra dentro
          del cupo de ~{recommendedInteractions.toLocaleString()} interacciones de {recommended}
          ({estimatedTokens.toLocaleString()} de {PLAN_PRICING[recommended].tokensLimit.toLocaleString()} tokens).
        </p>
      </div>

      <p className="mt-3 text-[11px] text-[var(--muted)]">
        Es una estimación (varía según cuán largas sean las conversaciones). Si en algún mes te
        pasás del cupo de tu plan, el asistente no se corta — el excedente se cobra aparte, a un
        precio por cada 1.000 tokens extra.
      </p>
    </Card>
  )
}

const PLAN_FEATURES = {
  Básico: [
    '1 número de WhatsApp',
    'Elegís si mantenés tu WhatsApp Business (Coexistence)',
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

// Decisión de producto (2026-09-16): Coexistence pasa a estar disponible en
// los 3 planes — es el método recomendado para todos los laboratorios
// nuevos, así ninguno pierde su WhatsApp Business existente. Ver el mismo
// cambio del lado del backend en WhatsappService.cs.
const PLANES_CON_COEXISTENCE = new Set(['Básico', 'Profesional', 'Premium'])

function CoexistenceExplainer() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-4 border-t border-[var(--border)] pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]"
      >
        <HelpCircle size={13} />
        {open ? 'Ocultar explicación' : '¿Qué es Coexistence?'}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-strong)]">
              <Smartphone size={12} className="text-[var(--accent)]" /> Con Coexistence
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
              Seguís usando tu WhatsApp Business de siempre, en tu celular, con todos tus chats y
              contactos. El asistente de IA responde en paralelo, en el mismo número — no se borra
              ni se pierde nada de lo que ya tenías.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-strong)]">
              <Server size={12} className="text-[var(--accent)]" /> Sin Coexistence (número dedicado)
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
              Ese número deja de funcionar como WhatsApp Business normal en un celular — pasa a
              atenderse 100% a través de nuestra plataforma, como si fuera tu WhatsApp Business
              pero manejado por el asistente. Ideal para un número nuevo, sin historia previa.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <LandingNavbar />

      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center">
        <h1 className="text-3xl font-extrabold text-[var(--text-strong)] sm:text-4xl">Planes y precios</h1>
        <p className="mt-4 text-base text-[var(--muted)]">
          Pagás una habilitación única al contratar y después una cuota mensual que depende de
          cuántos tokens de IA consume tu asistente. Esa cuota cubre las dos IA del asistente: el
          motor conversacional que responde a tus pacientes y Gemini, que corrige y prolija los
          mensajes del flujo con el botón "Mejorar con IA".
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          El token es la unidad con la que se mide cuánto "piensa y escribe" la IA — no es lo mismo
          que una conversación: cada charla con un paciente gasta entre 4.000 y 6.000 tokens según
          lo larga que sea, así que el cupo de tu plan alcanza para bastantes más charlas de lo que
          el número parece indicar.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Object.entries(PLAN_PRICING).map(([planName, plan]) => (
            <Card
              key={planName}
              className={`flex flex-col p-6 ${planName === 'Profesional' ? 'border-[var(--accent)]/50' : ''}`}
            >
              {planName === 'Profesional' && (
                <span className="mb-3 inline-flex w-fit items-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[#FCEABB] px-2.5 py-1 text-[11px] font-bold text-black">
                  MÁS ELEGIDO
                </span>
              )}
              {planName === 'Básico' && (
                <span className="mb-3 inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
                  Recomendado para laboratorio nuevo
                </span>
              )}
              <h2 className="text-lg font-bold text-[var(--text-strong)]">{planName}</h2>

              <div className="mt-3">
                <p className="text-3xl font-extrabold text-[var(--text-strong)]">
                  ${plan.priceUSD}
                  <span className="text-sm font-normal text-[var(--muted)]"> USD/mes</span>
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  + ${plan.setupFeeUSD} USD de habilitación (pago único, al contratar)
                </p>
              </div>

              <p className="mt-2 text-sm font-bold text-[var(--accent-soft)]">
                ≈ {Math.round(plan.tokensLimit / AVG_TOKENS_PER_INTERACTION_ESTIMATE).toLocaleString()} interacciones por mes
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                {plan.tokensLimit.toLocaleString()} tokens de IA (cada interacción usa ~{AVG_TOKENS_PER_INTERACTION_ESTIMATE.toLocaleString()} tokens aprox.)
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {PLAN_FEATURES[planName].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[var(--text)]">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              {PLANES_CON_COEXISTENCE.has(planName) && <CoexistenceExplainer />}

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

      <section className="mx-auto max-w-2xl px-6 pb-16">
        <PlanCalculator />
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <Card className="p-6">
          <h2 className="text-base font-bold text-[var(--text-strong)]">¿Cómo funciona el pago?</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)]">
                <Landmark size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-strong)]">1. Habilitación (una sola vez)</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Al contratar, se abona un pago único que activa tu cuenta, tu número de WhatsApp y
                  la carga inicial de tu flujo de conversación.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)]">
                <CreditCard size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-strong)]">2. Cuota mensual, sin compromiso</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Por defecto el cobro es automático con Mercado Pago: se renueva solo cada mes y
                  podés cancelar cuando quieras desde el panel de Facturación. Si cancelás antes de
                  la fecha de corte, no se te cobra el próximo período — igual seguís con el
                  servicio activo hasta que termine el que ya pagaste. También podés pagar por
                  transferencia (alias/CVU en pesos, alias/CBU en dólares) y avisarlo desde la app.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-5 text-xs text-[var(--muted)]">
            ¿Tenés más de un laboratorio? El 2° laboratorio del mismo dueño tiene 15% de descuento
            y el 3° en adelante, 25% — se gestiona desde el panel de Facturación.
          </p>
          <p className="mt-3 text-xs text-[var(--muted)]">
            ¿Y si me paso de los tokens de mi plan? El asistente sigue funcionando sin cortes — el
            excedente se cobra aparte, a un precio por cada 1.000 tokens de más que uses ese mes.
          </p>
        </Card>
      </section>

      <Footer />
    </div>
  )
}
