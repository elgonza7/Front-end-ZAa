import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Card from '../components/ui/Card.jsx'
import { getMetricsHistory, getGlobalMetrics } from '../api/adminService.js'

const PLAN_COLORS = ['var(--accent)', '#34d399', '#60a5fa']

function TokenTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-strong)] shadow-lg">
      <p className="text-[var(--muted)]">{label}</p>
      <p className="font-semibold text-emerald-400">{payload[0].value.toLocaleString('es-AR')} interacciones</p>
    </div>
  )
}

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-strong)] shadow-lg">
      <p className="text-[var(--muted)]">{label}</p>
      <p className="font-semibold text-[var(--accent)]">${payload[0].value.toLocaleString('es-AR')}</p>
    </div>
  )
}

function EmptyChart({ label }) {
  return (
    <div className="flex h-full items-center justify-center text-center text-xs text-[var(--muted)]">
      Todavía no hay datos disponibles{label ? ` de ${label}` : ''}.
    </div>
  )
}

export default function AdminMetrics() {
  const [history, setHistory] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getMetricsHistory(), getGlobalMetrics()])
      .then(([historyData, metricsData]) => {
        setHistory(historyData)
        setMetrics(metricsData)
      })
      .catch((err) => setError(err.message || 'No se pudieron cargar las métricas.'))
  }, [])

  if (error) {
    return (
      <AdminLayout title="Métricas" userLabel="Error">
        <div className="flex h-64 items-center justify-center text-sm text-red-400">{error}</div>
      </AdminLayout>
    )
  }

  if (!history || !metrics) {
    return (
      <AdminLayout title="Métricas" userLabel="Cargando…">
        <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">Cargando métricas…</div>
      </AdminLayout>
    )
  }

  const netMargin = metrics.monthlyRevenueUSD - metrics.estimatedGeminiCostUSD

  return (
    <AdminLayout title="Métricas" subtitle="Consumo, ingresos y distribución de planes de toda la plataforma">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <p className="text-xs text-[var(--muted)]">Laboratorios activos</p>
            <p className="mt-1.5 text-xl font-bold text-[var(--text-strong)]">
              {metrics.activeLabs} <span className="text-sm font-normal text-[var(--muted)]">/ {metrics.totalLabs}</span>
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-[var(--muted)]">Ingresos este mes</p>
            <p className="mt-1.5 text-xl font-bold text-[var(--text-strong)]">${metrics.monthlyRevenueUSD.toLocaleString('es-AR')}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-[var(--muted)]">Costo estimado de Gemini</p>
            <p className="mt-1.5 text-xl font-bold text-[var(--text)]">
              ${metrics.estimatedGeminiCostUSD.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-[10px] text-[var(--muted)]">
              Estimado sobre {metrics.totalTokensConsumed.toLocaleString('es-AR')} tokens — no es la
              factura real de Google, es una guía.
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-[var(--muted)]">Margen neto estimado</p>
            <p className={`mt-1.5 text-xl font-bold ${netMargin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${netMargin.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[var(--accent)]">Interacciones de la plataforma</h2>
            <span className="text-sm text-[var(--muted)]">
              Cantidad de Respuestas: <span className="font-semibold text-[var(--text-strong)]">{history.responseCount.toLocaleString('es-AR')}</span>
            </span>
          </div>

          <div className="mt-4 h-80">
            {history.tokenHistory.length === 0 ? (
              <EmptyChart label="interacciones" />
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history.tokenHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.75} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="var(--muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toLocaleString('es-AR')}
                />
                <Tooltip content={<TokenTooltip />} cursor={{ stroke: 'var(--border)' }} />
                <Area
                  type="monotone"
                  dataKey="tokens"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fill="url(#tokenGradient)"
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-sm font-semibold text-[var(--text-strong)]">Ingresos mensuales (USD)</h2>
            <div className="mt-4 h-64">
              {history.revenueHistory.length === 0 ? (
                <EmptyChart label="ingresos" />
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history.revenueHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<RevenueTooltip />} cursor={{ stroke: 'var(--border)' }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--accent)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--accent)', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-[var(--text-strong)]">Distribución de planes</h2>
            <div className="mt-4 h-64">
              {history.planDistribution.length === 0 ? (
                <EmptyChart label="planes contratados" />
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={history.planDistribution}
                    dataKey="count"
                    nameKey="plan"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {history.planDistribution.map((entry, index) => (
                      <Cell key={entry.plan} fill={PLAN_COLORS[index % PLAN_COLORS.length]} stroke="var(--surface)" />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-[var(--muted)]">{value}</span>}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
