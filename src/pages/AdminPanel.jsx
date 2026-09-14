import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Coins, PlayCircle, ShieldAlert, ArrowRight } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import Button from '../components/ui/Button.jsx'
import { getLabs, getGlobalMetrics } from '../api/adminService.js'

const STATUS_LABEL = {
  PAID: { text: 'Pagado', variant: 'success' },
  OVERDUE: { text: 'Vencido', variant: 'danger' },
  PENDING: { text: 'Pendiente', variant: 'warning' },
}

export default function AdminPanel() {
  const [labs, setLabs] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getLabs(), getGlobalMetrics()])
      .then(([labsData, metricsData]) => {
        setLabs(labsData.slice(0, 5))
        setMetrics(metricsData)
      })
      .catch((err) => setError(err.message || 'No se pudieron cargar los datos de la plataforma.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout title="Panel de Administración" subtitle="Vista general de la plataforma">
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Building2} label="Laboratorios" value={metrics?.totalLabs ?? '—'} accent />
          <StatCard icon={PlayCircle} label="Bots activos" value={metrics?.activeLabs ?? '—'} />
          <StatCard
            icon={Coins}
            label="Tokens consumidos"
            value={metrics ? metrics.totalTokensConsumed.toLocaleString() : '—'}
          />
          <StatCard
            icon={ShieldAlert}
            label="Ingresos mensuales"
            value={metrics ? `$${metrics.monthlyRevenueUSD.toLocaleString()}` : '—'}
          />
        </div>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
            <h2 className="text-sm font-semibold text-[var(--text-strong)]">Laboratorios recientes</h2>
            <Button as={Link} to="/admin/inquilinos" variant="outline" className="px-3 py-1.5 text-xs">
              Ver todos los inquilinos
              <ArrowRight size={14} />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th className="px-6 py-3 font-medium">Nombre del Lab</th>
                  <th className="px-6 py-3 font-medium">Estado del Bot</th>
                  <th className="px-6 py-3 font-medium">Último Pago</th>
                  <th className="px-6 py-3 font-medium">Tokens Consumidos</th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-[var(--border)]/60">
                      <td colSpan={4} className="px-6 py-4">
                        <div className="h-4 w-full animate-pulse rounded bg-[var(--bg)]" />
                      </td>
                    </tr>
                  ))}

                {!loading &&
                  labs.map((lab) => {
                    const status = STATUS_LABEL[lab.status] ?? STATUS_LABEL.PENDING
                    return (
                      <tr key={lab.id} className="border-b border-[var(--border)]/60 last:border-0 hover:bg-[var(--bg)]/40">
                        <td className="px-6 py-4 font-medium text-[var(--text-strong)]">{lab.name}</td>
                        <td className="px-6 py-4">
                          <Badge variant={lab.botActive ? 'success' : 'neutral'}>
                            {lab.botActive ? 'ON' : 'OFF'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-[var(--text)]">
                          {lab.lastPayment}
                          <Badge variant={status.variant} className="ml-2">
                            {status.text}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-[var(--text)]">{lab.tokensConsumed.toLocaleString()}</td>
                      </tr>
                    )
                  })}

                {!loading && labs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-[var(--muted)]">
                      Todavía no hay datos disponibles — no cargaste ningún laboratorio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
