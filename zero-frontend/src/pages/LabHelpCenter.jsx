import { useState } from 'react'
import { Mail, Send, CheckCircle2 } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { submitFeedback } from '../api/feedbackService.js'

const SUPPORT_EMAIL = 'zeroautoapp@gmail.com'

const CATEGORIES = [
  { value: 'BUG', label: 'Encontré un problema' },
  { value: 'SUGERENCIA', label: 'Tengo una sugerencia' },
  { value: 'CONSULTA', label: 'Tengo una consulta' },
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
    await submitFeedback({ labName: 'Laboratorio Ameghino', category, subject, message })
    setSending(false)
    setSent(true)
    setSubject('')
    setMessage('')
  }

  return (
    <LabLayout title="Centro de Ayuda" subtitle="Contactanos o dejanos tu feedback sobre la plataforma">
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
