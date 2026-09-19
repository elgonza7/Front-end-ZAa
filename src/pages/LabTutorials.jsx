import { useState } from 'react'
import { GraduationCap, LayoutDashboard, MessageCircle, MessagesSquare, GitBranch, Headset, CreditCard } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import { PanelTutorial } from './LabDashboard.jsx'
import { WhatsappTutorial } from './WhatsAppConnect.jsx'
import { ConversationsTutorial } from './LabConversations.jsx'
import { FlowTutorial } from './FlowBuilder.jsx'
import { AtencionHumanaTutorial } from './HandoffInbox.jsx'
import { BillingTutorial } from './LabBilling.jsx'

// Mismas 6 secciones y el mismo orden que el menú de la izquierda
// (config/nav.js) — cada una reusa el tutorial que ya existe en esa propia
// pantalla (el botón "?" de ahí), para no mantener el mismo texto escrito
// dos veces en dos lugares distintos.
const SECTIONS = [
  { id: 'panel', label: 'Panel', icon: LayoutDashboard, Content: PanelTutorial },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, Content: () => <WhatsappTutorial coexistenceAvailable /> },
  { id: 'mensajes', label: 'Mensajes', icon: MessagesSquare, Content: ConversationsTutorial },
  { id: 'flujo', label: 'Flujo de conversación', icon: GitBranch, Content: FlowTutorial },
  { id: 'atencion', label: 'Atención humana', icon: Headset, Content: AtencionHumanaTutorial },
  { id: 'facturacion', label: 'Facturación', icon: CreditCard, Content: BillingTutorial },
]

export default function LabTutorials() {
  const [activeId, setActiveId] = useState(null)
  const active = SECTIONS.find((section) => section.id === activeId)
  const ActiveContent = active?.Content

  return (
    <LabLayout
      title="Tutoriales"
      subtitle="Elegí una sección para ver cómo funciona, explicado sin vueltas ni palabras técnicas"
    >
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <GraduationCap size={17} className="text-[var(--accent)]" />
            <h2 className="text-base font-bold text-[var(--text-strong)]">Lo más importante, en una frase</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text)]">
            ZeroAutoapp es un empleado que nunca duerme: cuando un paciente le escribe por
            WhatsApp a tu laboratorio, este sistema le contesta solo — sin que vos tengas que
            tocar nada — usando la información que cargaste en "Flujo de conversación". Vos no
            tenés que estar mirando el celular todo el día para que funcione.
          </p>
        </Card>

        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon
            const isActive = section.id === activeId
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveId(isActive ? null : section.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)]/40'
                }`}
              >
                <Icon size={15} />
                {section.label}
              </button>
            )
          })}
        </div>

        {active ? (
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <active.icon size={17} className="text-[var(--accent)]" />
              <h2 className="text-base font-bold text-[var(--text-strong)]">{active.label}</h2>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--text)]">
              <ActiveContent />
            </div>
          </Card>
        ) : (
          <Card className="flex flex-col items-center gap-2 p-10 text-center">
            <GraduationCap size={28} className="text-[var(--muted)]" />
            <p className="text-sm text-[var(--muted)]">
              Tocá una de las secciones de arriba para ver su tutorial completo.
            </p>
          </Card>
        )}

        <Card className="p-6">
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            ¿Algo no funciona como esperabas? No hace falta que sepas nada de tecnología para pedir
            ayuda: escribinos a{' '}
            <a href="mailto:zeroautoapp@gmail.com" className="text-[var(--accent)] underline">
              zeroautoapp@gmail.com
            </a>{' '}
            contando qué esperabas que pasara y qué pasó en cambio, y te ayudamos a resolverlo.
          </p>
        </Card>
      </div>
    </LabLayout>
  )
}
