import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Ban, PlayCircle, Eye, ArrowUpRight, ArrowDownRight, Minus, Send } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import { getLabs, createLab, suspendLab, reactivateLab, getLabDetail } from '../api/adminService.js'

const STATUS_LABEL = {
  PAID: { text: 'Pagado', variant: 'success' },
  OVERDUE: { text: 'Vencido', variant: 'danger' },
  PENDING: { text: 'Pendiente', variant: 'warning' },
}

const EMPTY_FORM = { name: '', email: '', phone: '', plan: 'Básico' }

function getTrend(usageHistory) {
  if (!usageHistory || usageHistory.length < 2) return { direction: 'flat', pct: 0 }
  const last = usageHistory[usageHistory.length - 1].tokens
  const prev = usageHistory[usageHistory.length - 2].tokens
  const pct = prev === 0 ? 0 : Math.round(((last - prev) / prev) * 100)
  if (pct > 5) return { direction: 'up', pct }
  if (pct < -5) return { direction: 'down', pct }
  return { direction: 'flat', pct }
}

function TrendBadge({ usageHistory }) {
  const { direction, pct } = getTrend(usageHistory)
  if (direction === 'up') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
        <ArrowUpRight size={13} /> {pct}%
      </span>
    )
  }
  if (direction === 'down') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400">
        <ArrowDownRight size={13} /> {pct}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8b949e]">
      <Minus size={13} /> estable
    </span>
  )
}

function DetailTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-xs text-white shadow-lg">
      <p className="text-[#8b949e]">{label}</p>
      <p className="font-semibold text-[#F8B500]">{payload[0].value.toLocaleString('es-AR')} tokens</p>
    </div>
  )
}

export default function AdminTenants() {
  const [labs, setLabs] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [creating, setCreating] = useState(false)
  const [detailLab, setDetailLab] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const [listError, setListError] = useState('')

  useEffect(() => {
    getLabs()
      .then((data) => setLabs(data))
      .catch((err) => setListError(err.message || 'No se pudieron cargar los laboratorios.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredLabs = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return labs
    return labs.filter(
      (lab) => lab.name.toLowerCase().includes(term) || lab.email?.toLowerCase().includes(term),
    )
  }, [labs, search])

  async function handleToggleSuspend(lab) {
    setBusyId(lab.id)
    try {
      const updated = lab.botActive ? await suspendLab(lab.id) : await reactivateLab(lab.id)
      setLabs((prev) =>
        prev.map((item) => (item.id === lab.id ? { ...item, botActive: updated.botActive } : item)),
      )
    } catch (err) {
      setListError(err.message || 'No se pudo actualizar el estado del laboratorio.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleViewDetail(lab) {
    setDetailLoading(true)
    try {
      const detail = await getLabDetail(lab.id)
      setDetailLab(detail)
    } catch (err) {
      setListError(err.message || 'No se pudo cargar el detalle del laboratorio.')
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleCreate(event) {
    event.preventDefault()
    setCreating(true)
    setCreateError('')
    try {
      const newLab = await createLab(form)
      setLabs((prev) => [newLab, ...prev])
      setModalOpen(false)
      setForm(EMPTY_FORM)
    } catch (err) {
      setCreateError(err.message || 'No se pudo crear el laboratorio.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <AdminLayout title="Inquilinos" subtitle="Alta, baja y modificación de cuentas de laboratorios">
      {listError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {listError}
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#30363d] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o email…"
              className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-[#F8B500]"
            />
          </div>
          <Button
            className="shrink-0 px-3.5 py-2 text-sm"
            onClick={() => {
              setCreateError('')
              setModalOpen(true)
            }}
          >
            <Plus size={16} />
            Nuevo laboratorio
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#30363d] text-xs uppercase tracking-wide text-[#8b949e]">
                <th className="px-6 py-3 font-medium">Laboratorio</th>
                <th className="px-6 py-3 font-medium">Contacto</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Estado del Bot</th>
                <th className="px-6 py-3 font-medium">Último Pago</th>
                <th className="px-6 py-3 font-medium">Uso (tendencia)</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#30363d]/60">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-[#0d1117]" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                filteredLabs.map((lab) => {
                  const status = STATUS_LABEL[lab.status] ?? STATUS_LABEL.PENDING
                  return (
                    <tr key={lab.id} className="border-b border-[#30363d]/60 last:border-0 hover:bg-[#0d1117]/40">
                      <td className="px-6 py-4 font-medium text-white">{lab.name}</td>
                      <td className="px-6 py-4 text-[#8b949e]">
                        <p className="text-[#e6e6e6]">{lab.email}</p>
                        <p className="text-xs">{lab.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="gold">{lab.plan}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={lab.botActive ? 'success' : 'neutral'}>
                          {lab.botActive ? 'ON' : 'OFF'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-[#e6e6e6]">
                        {lab.lastPayment}
                        <Badge variant={status.variant} className="ml-2">
                          {status.text}
                        </Badge>
                        {lab.pendingTransfer && (
                          <span className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-[#F8B500]">
                            <Send size={11} />
                            Transferencia sin verificar
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[#e6e6e6]">{lab.tokensConsumed.toLocaleString()} tokens</p>
                        <TrendBadge usageHistory={lab.usageHistory} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-stretch gap-2">
                          <Button
                            variant="outline"
                            className="justify-center px-3 py-1.5 text-xs"
                            disabled={detailLoading}
                            onClick={() => handleViewDetail(lab)}
                          >
                            <Eye size={14} />
                            Ver detalle
                          </Button>
                          <Button
                            variant={lab.botActive ? 'danger' : 'primary'}
                            className="justify-center px-3 py-1.5 text-xs"
                            disabled={busyId === lab.id}
                            onClick={() => handleToggleSuspend(lab)}
                          >
                            {lab.botActive ? <Ban size={14} /> : <PlayCircle size={14} />}
                            {busyId === lab.id
                              ? 'Procesando…'
                              : lab.botActive
                                ? 'Suspender'
                                : 'Reactivar'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

              {!loading && filteredLabs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-[#8b949e]">
                    {labs.length === 0
                      ? 'Todavía no hay laboratorios cargados. Creá el primero con "Nuevo laboratorio".'
                      : `No se encontraron laboratorios para "${search}".`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo laboratorio">
        <form className="space-y-4" onSubmit={handleCreate}>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Nombre</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Teléfono</label>
            <input
              type="text"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Plan</label>
            <select
              value={form.plan}
              onChange={(event) => setForm({ ...form, plan: event.target.value })}
              className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
            >
              <option>Básico</option>
              <option>Profesional</option>
              <option>Premium</option>
            </select>
          </div>
          <p className="text-xs text-[#8b949e]">
            La cuenta arranca con la contraseña temporal <span className="font-mono text-[#e6e6e6]">123</span> y
            el laboratorio va a tener que cambiarla apenas inicie sesión por primera vez.
          </p>

          {createError && <p className="text-sm text-red-400">{createError}</p>}

          <Button type="submit" disabled={creating} className="w-full py-2.5 text-sm">
            {creating ? 'Creando…' : 'Crear laboratorio'}
          </Button>
        </form>
      </Modal>

      <Modal open={!!detailLab} onClose={() => setDetailLab(null)} title={detailLab?.name ?? 'Detalle'}>
        {detailLab && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold">{detailLab.plan}</Badge>
              <Badge variant={detailLab.botActive ? 'success' : 'neutral'}>
                {detailLab.botActive ? 'Bot activo' : 'Bot suspendido'}
              </Badge>
              <Badge variant={STATUS_LABEL[detailLab.status]?.variant ?? 'neutral'}>
                {STATUS_LABEL[detailLab.status]?.text ?? detailLab.status}
              </Badge>
              {(() => {
                const { direction, pct } = getTrend(detailLab.usageHistory)
                if (direction === 'up') return <Badge variant="success">En crecimiento (+{pct}%)</Badge>
                if (direction === 'down') return <Badge variant="danger">En baja ({pct}%)</Badge>
                return <Badge variant="neutral">Uso estable</Badge>
              })()}
            </div>

            {detailLab.pendingTransfer && (
              <div className="flex items-center justify-between rounded-xl border border-[#F8B500]/30 bg-[#F8B500]/5 px-3.5 py-2.5">
                <div>
                  <p className="text-sm text-white">Transferencia reportada por el laboratorio</p>
                  <p className="text-xs text-[#8b949e]">
                    Ref. "{detailLab.pendingTransfer.reference}" ·{' '}
                    {new Date(detailLab.pendingTransfer.reportedAt).toLocaleString('es-AR')}
                  </p>
                </div>
                <Badge variant="warning">Verificar</Badge>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs text-[#8b949e]">
              <p>
                Email: <span className="text-[#e6e6e6]">{detailLab.email}</span>
              </p>
              <p>
                Teléfono: <span className="text-[#e6e6e6]">{detailLab.phone}</span>
              </p>
              <p>
                Cliente desde: <span className="text-[#e6e6e6]">{detailLab.createdAt}</span>
              </p>
              <p>
                Última actividad:{' '}
                <span className="text-[#e6e6e6]">
                  {detailLab.lastActivityAt ? new Date(detailLab.lastActivityAt).toLocaleString('es-AR') : '—'}
                </span>
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-[#8b949e]">Tokens consumidos — últimos 6 meses</p>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={detailLab.usageHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#30363d" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<DetailTooltip />} cursor={{ stroke: '#30363d' }} />
                    <Line
                      type="monotone"
                      dataKey="tokens"
                      stroke="#F8B500"
                      strokeWidth={3}
                      dot={{ fill: '#F8B500', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}
