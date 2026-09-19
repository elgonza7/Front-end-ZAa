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
import { Pencil } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { getMetricsHistory, getGlobalMetrics, getCostSettings, updateCostSettings } from '../api/adminService.js'

const PLAN_COLORS = ['var(--accent)', '#34d399', '#60a5fa']

function TokenTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-strong)] shadow-lg">
      <p className="text-[var(--muted)]">{label}</p>
      <p className="font-semibold text-emerald-400">{payload[0].value.toLocaleString('es-AR')} tokens</p>
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
  const [editingCosts, setEditingCosts] = useState(false)
  const [costForm, setCostForm] = useState({ renderMonthlyCostUSD: '', domainMonthlyCostUSD: '' })
  const [savingCosts, setSavingCosts] = useState(false)

  useEffect(() => {
    Promise.all([getMetricsHistory(), getGlobalMetrics(), getCostSettings()])
      .then(([historyData, metricsData, costSettings]) => {
        setHistory(historyData)
        setMetrics(metricsData)
        setCostForm(costSettings)
      })
      .catch((err) => setError(err.message || 'No se pudieron cargar las métricas.'))
  }, [])

  async function handleSaveCosts() {
    setSavingCosts(true)
    try {
      await updateCostSettings({
        renderMonthlyCostUSD: Number(costForm.renderMonthlyCostUSD),
        domainMonthlyCostUSD: Number(costForm.domainMonthlyCostUSD),
      })
      // Los costos fijos afectan la ganancia neta estimada — se recalcula
      // todo junto en vez de solo pisar los dos números editados.
      const refreshedMetrics = await getGlobalMetrics()
      setMetrics(refreshedMetrics)
      setEditingCosts(false)
    } finally {
      setSavingCosts(false)
    }
  }

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

  return (
    <AdminLayout title="Métricas" subtitle="Consumo, ingresos y distribución de planes de toda la plataforma">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-[var(--muted)]">Costos fijos (Render + dominio)</p>
              {!editingCosts && (
                <button
                  type="button"
                  onClick={() => setEditingCosts(true)}
                  className="text-[var(--muted)] hover:text-[var(--accent)]"
                  aria-label="Editar costos fijos"
                  title="Editar costos fijos"
                >
                  <Pencil size={13} />
                </button>
              )}
            </div>

            {editingCosts ? (
              <div className="mt-2 space-y-2">
                <div>
                  <label className="text-[10px] text-[var(--muted)]">Render (USD/mes)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costForm.renderMonthlyCostUSD}
                    onChange={(event) => setCostForm((prev) => ({ ...prev, renderMonthlyCostUSD: event.target.value }))}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--muted)]">Dominio (USD/mes)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costForm.domainMonthlyCostUSD}
                    onChange={(event) => setCostForm((prev) => ({ ...prev, domainMonthlyCostUSD: event.target.value }))}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="button" disabled={savingCosts} onClick={handleSaveCosts} className="flex-1 justify-center px-2 py-1.5 text-xs">
                    {savingCosts ? 'Guardando…' : 'Guardar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditingCosts(false)} className="flex-1 justify-center px-2 py-1.5 text-xs">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-1.5 text-xl font-bold text-[var(--text)]">
                  ${metrics.fixedInfraCostUSD.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
                <p className="mt-1 text-[10px] text-[var(--muted)]">Por mes, sin importar el uso — tocá el lápiz para actualizarlo.</p>
              </>
            )}
          </Card>
          <Card className="p-4">
            <p className="text-xs text-[var(--muted)]">Ganancia neta estimada</p>
            <p className={`mt-1.5 text-xl font-bold ${metrics.estimatedNetProfitUSD >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${metrics.estimatedNetProfitUSD.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-[10px] text-[var(--muted)]">Ingresos − Gemini estimado − costos fijos.</p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[var(--accent)]">Tokens de la plataforma</h2>
            <span className="text-sm text-[var(--muted)]">
              Cantidad de Respuestas: <span className="font-semibold text-[var(--text-strong)]">{history.responseCount.toLocaleString('es-AR')}</span>
            </span>
          </div>

          <div className="mt-4 h-80">
            {history.tokenHistory.length === 0 ? (
              <EmptyChart label="tokens" />
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
