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

const PLAN_COLORS = ['#F8B500', '#34d399', '#60a5fa']

function TokenTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-xs text-white shadow-lg">
      <p className="text-[#8b949e]">{label}</p>
      <p className="font-semibold text-emerald-400">{payload[0].value.toLocaleString('es-AR')} tokens</p>
    </div>
  )
}

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-xs text-white shadow-lg">
      <p className="text-[#8b949e]">{label}</p>
      <p className="font-semibold text-[#F8B500]">${payload[0].value.toLocaleString('es-AR')}</p>
    </div>
  )
}

function EmptyChart({ label }) {
  return (
    <div className="flex h-full items-center justify-center text-center text-xs text-[#8b949e]">
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
        <div className="flex h-64 items-center justify-center text-sm text-[#8b949e]">Cargando métricas…</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Métricas" subtitle="Consumo, ingresos y distribución de planes de toda la plataforma">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[#F8B500]">Consumición de Tokens</h2>
            <span className="text-sm text-[#8b949e]">
              Cantidad de Respuestas: <span className="font-semibold text-white">{history.responseCount.toLocaleString('es-AR')}</span>
            </span>
          </div>

          <div className="mt-4 h-80">
            {history.tokenHistory.length === 0 ? (
              <EmptyChart label="consumo de tokens" />
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history.tokenHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.75} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#30363d" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#8b949e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toLocaleString('es-AR')}
                />
                <Tooltip content={<TokenTooltip />} cursor={{ stroke: '#30363d' }} />
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
            <h2 className="text-sm font-semibold text-white">Ingresos mensuales (USD)</h2>
            <div className="mt-4 h-64">
              {history.revenueHistory.length === 0 ? (
                <EmptyChart label="ingresos" />
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history.revenueHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#30363d" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<RevenueTooltip />} cursor={{ stroke: '#30363d' }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#F8B500"
                    strokeWidth={3}
                    dot={{ fill: '#F8B500', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-white">Distribución de planes</h2>
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
                      <Cell key={entry.plan} fill={PLAN_COLORS[index % PLAN_COLORS.length]} stroke="#161b22" />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-[#8b949e]">{value}</span>}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#161b22',
                      border: '1px solid #30363d',
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
