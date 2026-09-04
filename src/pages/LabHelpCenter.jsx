import { useState } from 'react'
import { Mail, Send, CheckCircle2, ChevronDown, GraduationCap } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { submitFeedback } from '../api/feedbackService.js'

const SUPPORT_EMAIL = 'zeroautoapp@gmail.com'

// Explicado en lenguaje simple a propósito: quien usa esto es un bioquímico o
// el dueño del laboratorio, no alguien de sistemas. Nada de jerga técnica.
const TUTORIAL_ITEMS = [
  {
    question: '¿Qué es un "token"?',
    answer:
      'Es la unidad con la que se mide cuánto "piensa y escribe" la inteligencia artificial. ' +
      'No es plata ni minutos: es más parecido a contar palabras. Cada vez que un paciente te ' +
      'escribe y el asistente responde, se gastan algunos tokens — una conversación corta gasta ' +
      'pocos, una larga con muchas idas y vueltas gasta más. Tu plan viene con una cantidad de ' +
      'tokens incluida por mes.',
  },
  {
    question: '¿Qué pasa si me quedo sin tokens en el mes?',
    answer:
      'Nada se corta. El asistente sigue respondiendo a tus pacientes con total normalidad. Lo ' +
      'único que cambia es que los tokens que uses de más ese mes se cobran aparte, a un precio ' +
      'fijo cada 1.000 tokens extra (lo ves en tu panel de Facturación). El mes siguiente vuelve a ' +
      'empezar de cero con el cupo de tu plan.',
  },
  {
    question: '¿Cómo hace el asistente para responder a mis pacientes?',
    answer:
      'Conectás tu número de WhatsApp Business a la plataforma (una sola vez, desde "Conectar ' +
      'WhatsApp"). A partir de ahí, cuando un paciente te escribe, la inteligencia artificial lee ' +
      'el mensaje y responde automáticamente usando la información que vos cargaste: tu mensaje ' +
      'de bienvenida, el árbol de conversación y los PDF de tu base de conocimiento.',
  },
  {
    question: '¿Qué es el "árbol de conversación" (Flujo)?',
    answer:
      'Es como un mapa de las preguntas y respuestas más comunes de tu laboratorio, organizado en ' +
      'ramas: por ejemplo "Indicaciones para un análisis de sangre" puede abrirse en "Ayuno", ' +
      '"Horarios" y "Dirección". El asistente lo usa como guía para saber qué contestar. Ya viene ' +
      'con contenido cargado para que edites solo lo que sea distinto en tu laboratorio (tus ' +
      'horarios, tu dirección, tus datos de pago) en vez de escribir todo de cero.',
  },
  {
    question: '¿Qué es la "Base de conocimiento"?',
    answer:
      'Es donde subís tus PDF: cartillas de obras sociales, horarios de sucursales, instrucciones ' +
      'de estudios puntuales. El sistema lee ese PDF una sola vez cuando lo subís, y a partir de ' +
      'ahí el asistente puede usar esa información para responder preguntas que no estén cubiertas ' +
      'en el árbol de conversación.',
  },
  {
    question: '¿Qué hace el botón "Mejorar con IA"?',
    answer:
      'Aparece cuando estás editando un mensaje del árbol de conversación. Lo apretás y una IA te ' +
      'corrige la ortografía y prolija la redacción de ESE mensaje puntual, para que quede más ' +
      'claro y profesional. No tiene nada que ver con el asistente que le habla a tus pacientes — ' +
      'solo te ayuda a vos a escribir mejor mientras armás el flujo.',
  },
  {
    question: '¿Qué pasa si un paciente quiere hablar con una persona?',
    answer:
      'Si activaste "Permitir atención humana" en Configuración, el asistente detecta cuándo el ' +
      'paciente necesita hablar con alguien del laboratorio (o cuando el pedido es algo que el bot ' +
      'no puede resolver solo) y pausa las respuestas automáticas en esa conversación. Te llega un ' +
      'aviso en "Atención humana" para que la tome un empleado — el bot no vuelve a responder ahí ' +
      'hasta que se resuelva.',
  },
  {
    question: '¿Por qué hay distintos planes y precios?',
    answer:
      'La diferencia entre planes es la cantidad de tokens que incluye cada uno por mes — es decir, ' +
      'cuántas conversaciones podés atender sin pagar excedente. Si tenés pocos pacientes por día, ' +
      'con un plan chico alcanza; si tenés mucho movimiento de WhatsApp, conviene un plan con más ' +
      'cupo. En la página de Precios hay una calculadora que te sugiere cuál te conviene según ' +
      'cuántos pacientes te contactan por día.',
  },
]

function TutorialAccordion() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="divide-y divide-[#30363d]">
      {TUTORIAL_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
            >
              <span className="text-sm font-medium text-white">{item.question}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-[#8b949e] transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && <p className="pb-4 text-sm text-[#8b949e]">{item.answer}</p>}
          </div>
        )
      })}
    </div>
  )
}

// El backend solo acepta BUG / SUGERENCIA / OTRO (Zero.Domain.Enums.FeedbackCategory)
// — "Tengo una consulta" mapea a OTRO, no puede ser un valor propio.
const CATEGORIES = [
  { value: 'BUG', label: 'Encontré un problema' },
  { value: 'SUGERENCIA', label: 'Tengo una sugerencia' },
  { value: 'OTRO', label: 'Tengo una consulta' },
]

export default function LabHelpCenter() {
  const [category, setCategory] = useState('BUG')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    // El laboratorio lo determina el backend a partir del JWT, nunca de acá.
    await submitFeedback({ category, subject, message })
    setSending(false)
    setSent(true)
    setSubject('')
    setMessage('')
  }

  return (
    <LabLayout title="Centro de Ayuda" subtitle="Contactanos o dejanos tu feedback sobre la plataforma">
      <Card className="mb-6 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#30363d] bg-[#0d1117] text-[#F8B500]">
            <GraduationCap size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Guía rápida: cómo funciona todo esto</h2>
            <p className="text-xs text-[#8b949e]">
              Explicado en criollo, sin tecnicismos — pensado para alguien que nunca usó esta plataforma.
            </p>
          </div>
        </div>
        <div className="mt-2">
          <TutorialAccordion />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#30363d] bg-[#0d1117] text-[#F8B500]">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Contacto directo</p>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm text-[#F8B500] hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#8b949e]">
            Para algo urgente escribinos directamente por email. Para reportar un problema puntual
            o dejar una sugerencia sobre la plataforma, usá el formulario — queda registrado y el
            equipo de ZeroAutoapp le hace seguimiento.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-white">Enviar feedback</h2>
          <p className="mt-1 text-xs text-[#8b949e]">Contanos qué encontraste o qué te gustaría que agreguemos.</p>

          {sent ? (
            <div className="mt-6 flex flex-col items-center gap-2 py-6 text-center">
              <CheckCircle2 size={28} className="text-emerald-400" />
              <p className="text-sm text-white">¡Gracias! Ya lo recibimos.</p>
              <Button variant="outline" className="mt-2 px-4 py-2 text-xs" onClick={() => setSent(false)}>
                Enviar otro mensaje
              </Button>
            </div>
          ) : (
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Categoría</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Asunto</label>
                <input
                  required
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Mensaje</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full resize-none rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
                />
              </div>
              <Button type="submit" disabled={sending} className="px-4 py-2.5 text-sm">
                <Send size={16} />
                {sending ? 'Enviando…' : 'Enviar'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </LabLayout>
  )
}
