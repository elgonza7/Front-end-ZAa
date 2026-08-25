import { useEffect, useState } from 'react'
import { Headset, Phone, CheckCircle2 } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
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
      subtitle="Pacientes que pidieron hablar con una persona — el bot dejó de responderles automáticamente"
    >
      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-[#8b949e]">Cargando…</div>
      ) : queue.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-12 text-center">
          <CheckCircle2 size={32} className="text-emerald-400" />
          <p className="text-sm text-white">No hay conversaciones esperando atención humana.</p>
          <p className="text-xs text-[#8b949e]">
            Cuando un paciente elija "Hablar con un humano" en el flujo, aparecerá acá.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {queue.map((conv) => (
            <Card key={conv.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#30363d] bg-[#0d1117] text-[#F8B500]">
                  <Headset size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{conv.patientName}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#8b949e]">
                    <Phone size={12} /> {conv.phone}
                  </p>
                  <p className="mt-1.5 max-w-xl text-sm text-[#e6e6e6]">"{conv.lastMessage}"</p>
                  <p className="mt-1 text-[11px] text-[#8b949e]">Esperando {timeAgo(conv.waitingSince)}</p>
                </div>
              </div>

              <Button
                className="shrink-0 px-4 py-2 text-xs"
                disabled={claimingId === conv.id}
                onClick={() => handleClaim(conv.id)}
              >
                {claimingId === conv.id ? 'Tomando…' : 'Tomar conversación'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </LabLayout>
  )
}
