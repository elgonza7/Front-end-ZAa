import { useEffect, useState } from 'react'
import { MessagesSquare, Bot, User, Headset, Inbox } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import HelpButton from '../components/ui/HelpButton.jsx'
import { getConversations, getConversationMessages } from '../api/conversationsService.js'

export function ConversationsTutorial() {
  return (
    <p>
      Acá ves, en orden, todo lo que tus pacientes le escribieron al asistente y todo lo que el
      asistente les contestó — como si fuera una libreta de todas las charlas del WhatsApp,
      aunque vos no tengas ese WhatsApp abierto en ningún celular. Elegí una charla de la lista de
      la izquierda para leerla completa a la derecha. No hace falta hacer nada acá: es solo para
      que puedas ver lo que está pasando.
    </p>
  )
}

// El conversationId es el wa_id (número sin "+" ni espacios) — se muestra
// legible cuando no hay nombre de perfil de WhatsApp para esa charla.
function formatPhone(waId) {
  const digits = String(waId).replace(/\D/g, '')
  if (digits.length < 8) return `+${digits}`
  return `+${digits.slice(0, digits.length - 8)} ${digits.slice(-8, -4)} ${digits.slice(-4)}`
}

function timeAgo(isoString) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(isoString).getTime()) / 60000))
  if (minutes < 1) return 'recién'
  if (minutes < 60) return `hace ${minutes} min`
  if (minutes < 24 * 60) return `hace ${Math.round(minutes / 60)} h`
  return new Date(isoString).toLocaleDateString('es-AR')
}

const SENDER_STYLE = {
  PATIENT: { align: 'justify-start', bubble: 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]', icon: User, label: 'Paciente' },
  BOT: { align: 'justify-end', bubble: 'bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--text-strong)]', icon: Bot, label: 'Asistente' },
  HUMAN: { align: 'justify-end', bubble: 'bg-emerald-500/10 border border-emerald-500/30 text-[var(--text-strong)]', icon: Headset, label: 'Persona del equipo' },
}

export default function LabConversations() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  useEffect(() => {
    getConversations().then((data) => {
      setConversations(data)
      setLoading(false)
      if (data.length > 0) setSelectedId(data[0].conversationId)
    })
  }, [])

  useEffect(() => {
    if (!selectedId) return
    setLoadingMessages(true)
    getConversationMessages(selectedId).then((data) => {
      setMessages(data)
      setLoadingMessages(false)
    })
  }, [selectedId])

  return (
    <LabLayout
      title="Mensajes"
      subtitle="Todas las charlas que tus pacientes tuvieron con el asistente por WhatsApp"
      headerActions={
        <HelpButton title="Cómo leer esta pantalla">
          <ConversationsTutorial />
        </HelpButton>
      }
    >
      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">Cargando…</div>
      ) : conversations.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-12 text-center">
          <Inbox size={32} className="text-[var(--muted)]" />
          <p className="text-sm text-[var(--text-strong)]">Todavía no hay charlas registradas.</p>
          <p className="text-xs text-[var(--muted)]">
            En cuanto un paciente le escriba a tu número de WhatsApp, la conversación va a
            aparecer acá.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-1">
            {conversations.map((conv) => (
              <button
                key={conv.conversationId}
                type="button"
                onClick={() => setSelectedId(conv.conversationId)}
                className={`w-full rounded-xl border p-3.5 text-left transition ${
                  selectedId === conv.conversationId
                    ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-[var(--text-strong)]">
                    <MessagesSquare size={13} className="shrink-0 text-[var(--accent)]" />
                    <span className="truncate">{conv.patientName || formatPhone(conv.conversationId)}</span>
                  </p>
                  <span className="shrink-0 text-[10px] text-[var(--muted)]">{timeAgo(conv.lastMessageAt)}</span>
                </div>
                <p className="mt-1.5 truncate text-xs text-[var(--muted)]">{conv.lastMessage}</p>
                <p className="mt-1 text-[10px] text-[var(--muted)]">
                  {conv.patientName ? `${formatPhone(conv.conversationId)} · ` : ''}
                  {conv.messageCount} mensajes
                </p>
              </button>
            ))}
          </div>

          <Card className="flex flex-col p-5 lg:col-span-2">
            {loadingMessages ? (
              <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">Cargando…</div>
            ) : (
              <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1">
                {messages.map((msg, index) => {
                  const style = SENDER_STYLE[msg.sender] ?? SENDER_STYLE.PATIENT
                  const Icon = style.icon
                  return (
                    <div key={index} className={`flex ${style.align}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${style.bubble}`}>
                        <p className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                          <Icon size={11} /> {style.label}
                        </p>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <p className="mt-1 text-right text-[10px] text-[var(--muted)]">
                          {new Date(msg.createdAt).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      )}
    </LabLayout>
  )
}
