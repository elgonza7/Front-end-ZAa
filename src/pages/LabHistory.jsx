import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowLeft } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import { getTokenUsageRange, getPatientsPerDayRange } from '../api/labService.js'

function toISODate(date) {
  return date.toISOString().slice(0, 10)
}

// Cada preset calcula su propio [from, to] en el momento en que se elige,
// no una vez al cargar la página — así "Este mes" siempre significa el mes
// en curso, sin importar cuándo se abra esta pantalla.
const PERIODS = [
  {
    id: 'este-mes',
    label: 'Este mes',
    range: () => {
      const now = new Date()
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now }
    },
  },
  {
    id: 'mes-pasado',
    label: 'Mes pasado',
    range: () => {
      const now = new Date()
      return {
        from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        to: new Date(now.getFullYear(), now.getMonth(), 0),
      }
    },
  },
  {
    id: 'ultimos-3-meses',
    label: 'Últimos 3 meses',
    range: () => {
      const now = new Date()
      return { from: new Date(now.getFullYear(), now.getMonth() - 2, 1), to: now }
    },
  },
  {
    id: 'ultimos-6-meses',
    label: 'Últimos 6 meses',
    range: () => {
      const now = new Date()
      return { from: new Date(now.getFullYear(), now.getMonth() - 5, 1), to: now }
    },
  },
  {
    id: 'este-anio',
    label: 'Este año',
    range: () => {
      const now = new Date()
      return { from: new Date(now.getFullYear(), 0, 1), to: now }
    },
  },
  {
    id: 'anio-pasado',
    label: 'Año pasado',
    range: () => {
      const now = new Date()
      return { from: new Date(now.getFullYear() - 1, 0, 1), to: new Date(now.getFullYear() - 1, 11, 31) }
    },
  },
]

function TokensTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-strong)] shadow-lg">
      <p className="text-[var(--muted)]">{label}</p>
      <p className="font-semibold text-[var(--accent)]">{payload[0].value.toLocaleString('es-AR')} tokens</p>
    </div>
  )
}

function PatientsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-strong)] shadow-lg">
      <p className="text-[var(--muted)]">{label}</p>
      <p className="font-semibold text-[var(--accent)]">{payload[0].value.toLocaleString('es-AR')} pacientes</p>
    </div>
  )
}

export default function LabHistory() {
  const [periodId, setPeriodId] = useState('este-mes')
  const [tokenUsage, setTokenUsage] = useState([])
  const [patientsPerDay, setPatientsPerDay] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Reseteo durante el render (no en el efecto) cuando cambia el período
  // elegido, así el usuario ve "Cargando…" al toque en vez del gráfico
  // anterior colgado hasta que responda el fetch.
  const [lastPeriodId, setLastPeriodId] = useState(periodId)
  if (periodId !== lastPeriodId) {
    setLastPeriodId(periodId)
    setLoading(true)
    setError('')
  }

  useEffect(() => {
    const period = PERIODS.find((p) => p.id === periodId)
    const { from, to } = period.range()

    Promise.all([
      getTokenUsageRange(toISODate(from), toISODate(to)),
      getPatientsPerDayRange(toISODate(from), toISODate(to)),
    ])
      .then(([tokens, patients]) => {
        setTokenUsage(tokens)
        setPatientsPerDay(patients)
      })
      .catch((err) => setError(err.message || 'No se pudo cargar el historial.'))
      .finally(() => setLoading(false))
  }, [periodId])

  const totalTokens = tokenUsage.reduce((sum, item) => sum + item.tokens, 0)
  const totalPatients = patientsPerDay.reduce((sum, item) => sum + item.patients, 0)

  return (
    <LabLayout title="Historial" subtitle="Consultá el consumo y la actividad de meses o años anteriores">
      <div className="space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-strong)] hover:border-[var(--accent)]/40"
        >
          <ArrowLeft size={18} />
          Volver al Panel
        </Link>

        <Card className="p-5">
          <p className="text-sm font-semibold text-[var(--text-strong)]">Período</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PERIODS.map((period) => (
              <button
                key={period.id}
                type="button"
                onClick={() => setPeriodId(period.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  periodId === period.id
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)]/40'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </Card>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">Cargando…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Card className="p-5">
                <p className="text-xs text-[var(--muted)]">Tokens consumidos en el período</p>
                <p className="mt-1 text-2xl font-bold text-[var(--text-strong)]">{totalTokens.toLocaleString('es-AR')}</p>
              </Card>
              <Card className="p-5">
                <p className="text-xs text-[var(--muted)]">Pacientes distintos atendidos</p>
                <p className="mt-1 text-2xl font-bold text-[var(--text-strong)]">{totalPatients.toLocaleString('es-AR')}</p>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-sm font-semibold text-[var(--text-strong)]">Tokens consumidos</h2>
              <div className="mt-4 h-72">
                {tokenUsage.every((d) => d.tokens === 0) ? (
                  <div className="flex h-full items-center justify-center text-center text-xs text-[var(--muted)]">
                    No hay datos para este período.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tokenUsage} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip content={<TokensTooltip />} cursor={{ stroke: 'var(--border)' }} />
                      <Line
                        type="monotone"
                        dataKey="tokens"
                        stroke="var(--accent)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--accent)', r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-sm font-semibold text-[var(--text-strong)]">Pacientes atendidos</h2>
              <div className="mt-4 h-72">
                {patientsPerDay.every((d) => d.patients === 0) ? (
                  <div className="flex h-full items-center justify-center text-center text-xs text-[var(--muted)]">
                    No hay datos para este período.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={patientsPerDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<PatientsTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.3 }} />
                      <Bar dataKey="patients" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </LabLayout>
  )
}
