import { useEffect, useState } from 'react'
import { Bug, Lightbulb, MessageCircleQuestion, Check } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { getFeedback, resolveFeedback } from '../api/feedbackService.js'

const CATEGORY_META = {
  BUG: { label: 'Problema', icon: Bug, variant: 'danger' },
  SUGERENCIA: { label: 'Sugerencia', icon: Lightbulb, variant: 'gold' },
  CONSULTA: { label: 'Consulta', icon: MessageCircleQuestion, variant: 'neutral' },
}

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [resolvingId, setResolvingId] = useState(null)

  useEffect(() => {
    getFeedback().then((data) => {
      setFeedback(data)
      setLoading(false)
    })
  }, [])

  async function handleResolve(id) {
    setResolvingId(id)
    await resolveFeedback(id)
    setFeedback((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'RESOLVED' } : item)))
    setResolvingId(null)
  }

  const open = feedback.filter((item) => item.status === 'OPEN')
  const resolved = feedback.filter((item) => item.status === 'RESOLVED')

  return (
    <AdminLayout title="Soporte" subtitle="Reclamos y sugerencias enviados por los laboratorios">
      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-[#8b949e]">Cargando…</div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-white">Pendientes ({open.length})</h2>
            {open.length === 0 ? (
              <Card className="p-6 text-center text-sm text-[#8b949e]">No hay mensajes pendientes.</Card>
            ) : (
              <div className="space-y-3">
                {open.map((item) => {
                  const meta = CATEGORY_META[item.category] ?? CATEGORY_META.CONSULTA
                  const Icon = meta.icon
                  return (
                    <Card key={item.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#30363d] bg-[#0d1117] text-[#F8B500]">
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={meta.variant}>{meta.label}</Badge>
                            <span className="text-xs text-[#8b949e]">{item.labName}</span>
                          </div>
                          <p className="mt-1.5 text-sm font-semibold text-white">{item.subject}</p>
                          <p className="mt-1 max-w-xl text-sm text-[#e6e6e6]">{item.message}</p>
                          <p className="mt-1.5 text-[11px] text-[#8b949e]">
                            {new Date(item.createdAt).toLocaleString('es-AR')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="shrink-0 px-3 py-1.5 text-xs"
                        disabled={resolvingId === item.id}
                        onClick={() => handleResolve(item.id)}
                      >
                        <Check size={14} />
                        {resolvingId === item.id ? 'Marcando…' : 'Marcar resuelto'}
                      </Button>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {resolved.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-white">Resueltos ({resolved.length})</h2>
              <div className="space-y-2">
                {resolved.map((item) => (
                  <Card key={item.id} className="flex items-center justify-between p-4 opacity-60">
                    <p className="text-sm text-white">
                      {item.subject} <span className="text-xs text-[#8b949e]">· {item.labName}</span>
                    </p>
                    <Badge variant="success">Resuelto</Badge>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
