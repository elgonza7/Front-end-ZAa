import { useEffect, useState } from 'react'
import { Headset, Phone, CheckCircle2, FileText, IdCard } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { getHandoffQueue, claimConversation } from '../api/handoffService.js'

function timeAgo(isoString) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(isoString).getTime()) / 60000))
  if (minutes < 1) return 'recién'
  if (minutes < 60) return `hace ${minutes} min`
  return `hace ${Math.round(minutes / 60)} h`
}

export default function HandoffInbox() {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState(null)

  useEffect(() => {
    getHandoffQueue().then((data) => {
      setQueue(data)
      setLoading(false)
    })
  }, [])

  async function handleClaim(id) {
    setClaimingId(id)
    await claimConversation(id)
    setQueue((prev) => prev.filter((conv) => conv.id !== id))
    setClaimingId(null)
  }

  return (
    <LabLayout
      title="Atención humana"
      subtitle="Pacientes que necesitan que alguien del equipo haga algo — hablarles, o enviarles su resultado"
    >
      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">Cargando…</div>
      ) : queue.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-12 text-center">
          <CheckCircle2 size={32} className="text-emerald-400" />
          <p className="text-sm text-[var(--text-strong)]">No hay nada pendiente de atención humana.</p>
          <p className="text-xs text-[var(--muted)]">
            Cuando un paciente pida hablar con una persona, o pida su resultado, aparecerá acá.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {queue.map((conv) => {
            const isResultsRequest = conv.reason === 'ResultsRequest'
            return (
              <Card key={conv.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)]">
                    {isResultsRequest ? <FileText size={18} /> : <Headset size={18} />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[var(--text-strong)]">{conv.patientName}</p>
                      <Badge variant={isResultsRequest ? 'gold' : 'neutral'}>
                        {isResultsRequest ? 'Pidió su resultado' : 'Pidió hablar con alguien'}
                      </Badge>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                      <Phone size={12} /> {conv.phone}
                    </p>
                    {isResultsRequest && conv.dni && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                        <IdCard size={12} /> DNI {conv.dni}
                      </p>
                    )}
                    <p className="mt-1.5 max-w-xl text-sm text-[var(--text)]">"{conv.lastMessage}"</p>
                    <p className="mt-1 text-[11px] text-[var(--muted)]">Esperando {timeAgo(conv.waitingSince)}</p>
                  </div>
                </div>

                <Button
                  className="shrink-0 px-4 py-2 text-xs"
                  disabled={claimingId === conv.id}
                  onClick={() => handleClaim(conv.id)}
                >
                  {claimingId === conv.id ? 'Tomando…' : isResultsRequest ? 'Ya se lo envié' : 'Tomar conversación'}
                </Button>
              </Card>
            )
          })}
        </div>
      )}
    </LabLayout>
  )
}
