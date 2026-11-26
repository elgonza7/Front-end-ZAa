import { useCallback, useEffect, useRef, useState } from 'react'
import { Stethoscope, Search, Pencil, CheckCircle2, Loader2, Sparkles, ClipboardList, CalendarCheck, StickyNote } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Switch from '../components/ui/Switch.jsx'
import HelpButton from '../components/ui/HelpButton.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import PageLoader from '../components/ui/PageLoader.jsx'
import ObraSocialEditModal from '../components/settings/ObraSocialEditModal.jsx'
import { useToast } from '../lib/toastContext.js'
import { getObrasSociales, updateObrasSociales } from '../api/obrasSocialesService.js'

// Cuánto se espera después del último interruptor tocado antes de guardar:
// si el laboratorio prende/apaga varias seguidas, se manda un solo pedido.
const AUTOSAVE_DELAY_MS = 700

const FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'activas', label: 'Activas' },
  { id: 'inactivas', label: 'Inactivas' },
  { id: 'personalizadas', label: 'Personalizadas' },
]

function matchesFilter(obraSocial, filter) {
  if (filter === 'activas') return obraSocial.habilitada
  if (filter === 'inactivas') return !obraSocial.habilitada
  if (filter === 'personalizadas') return obraSocial.personalizado
  return true
}

export function ObrasSocialesTutorial() {
  return (
    <>
      <p>
        Acá elegís qué obras sociales y prepagas acepta tu laboratorio. El asistente solo va a
        hablar de las que estén <strong>activas</strong>: si un paciente nombra una inactiva, le
        pide la orden médica y avisa que el equipo la confirma a mano, en vez de inventar requisitos.
      </p>
      <p>
        Prendé o apagá cada una con su interruptor: <strong>se guarda solo</strong>, no hay que tocar
        ningún botón.
      </p>
      <p>
        Con <strong>"Editar requisitos"</strong> escribís lo que pide tu laboratorio para esa obra
        social (qué traer, qué autorizar, excepciones). Solo cambia para tu cuenta. Si te falta una
        obra social, escribinos a{' '}
        <a href="mailto:zeroautoapp@gmail.com" className="text-[var(--accent)] underline">
          zeroautoapp@gmail.com
        </a>{' '}
        y la agregamos.
      </p>
    </>
  )
}

function Preview({ icon: Icon, label, text }) {
  if (!text) return null
  return (
    <p className="flex gap-1.5 text-xs text-[var(--muted)]">
      <Icon size={13} className="mt-0.5 shrink-0 text-[var(--accent)]/80" />
      <span className="line-clamp-2">
        <span className="font-medium text-[var(--text)]">{label}:</span> {text}
      </span>
    </p>
  )
}

export default function LabObrasSociales() {
  const [obrasSociales, setObrasSociales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('todas')
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved
  const [editing, setEditing] = useState(null)
  const saveTimer = useRef(null)
  const toast = useToast()

  function fetchObrasSociales() {
    getObrasSociales()
      .then(setObrasSociales)
      .catch((err) => setError(err.message || 'Revisá tu conexión e intentá de nuevo.'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchObrasSociales, [])

  function retryLoad() {
    setLoading(true)
    setError('')
    fetchObrasSociales()
  }

  const scheduleSave = useCallback(
    (next) => {
      clearTimeout(saveTimer.current)
      setSaveState('saving')
      saveTimer.current = setTimeout(async () => {
        try {
          const updated = await updateObrasSociales(next.filter((o) => o.habilitada).map((o) => o.id))
          setObrasSociales(updated)
          setSaveState('saved')
        } catch (err) {
          setSaveState('idle')
          toast.error(err.message || 'No se pudieron guardar los cambios. Revisá tu conexión.')
          fetchObrasSociales()
        }
      }, AUTOSAVE_DELAY_MS)
    },
    [toast],
  )

  useEffect(() => () => clearTimeout(saveTimer.current), [])

  function setHabilitada(ids, habilitada) {
    const next = obrasSociales.map((o) => (ids.includes(o.id) ? { ...o, habilitada } : o))
    setObrasSociales(next)
    scheduleSave(next)
  }

  function handleTextoSaved(updated) {
    setObrasSociales((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
    setEditing(null)
    toast.success(`Requisitos de ${updated.nombre} guardados`)
  }

  const visible = obrasSociales.filter(
    (o) => matchesFilter(o, filter) && o.nombre.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const activeCount = obrasSociales.filter((o) => o.habilitada).length
  const percent = obrasSociales.length ? Math.round((activeCount / obrasSociales.length) * 100) : 0

  return (
    <>
      <LabLayout
        title="Obras sociales"
        subtitle="Elegí cuáles aceptás y qué le pedís al paciente en cada una"
        headerActions={
          <HelpButton title="Cómo funcionan las obras sociales">
            <ObrasSocialesTutorial />
          </HelpButton>
        }
      >
        {loading ? (
          <PageLoader />
        ) : error !== '' ? (
          <ErrorState message={error} onRetry={retryLoad} />
        ) : (
          <div className="space-y-5">
            <Card className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                    <Stethoscope size={21} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--text-strong)]">
                      {activeCount} de {obrasSociales.length} activas
                    </p>
                    <p className="text-sm text-[var(--muted)]">El asistente solo habla de las activas.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm" aria-live="polite">
                  {saveState === 'saving' && (
                    <span className="flex items-center gap-1.5 text-[var(--muted)]">
                      <Loader2 size={15} className="animate-spin" /> Guardando…
                    </span>
                  )}
                  {saveState === 'saved' && (
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={15} /> Cambios guardados
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[#FCEABB] transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </Card>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFilter(option.id)}
                    aria-pressed={filter === option.id}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      filter === option.id
                        ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]'
                        : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--text-strong)]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative sm:w-64">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar obra social…"
                    aria-label="Buscar obra social"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-2 pl-9 pr-3 text-sm text-[var(--text-strong)] outline-none placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHabilitada(visible.map((o) => o.id), true)}
                    className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Activar {query || filter !== 'todas' ? 'estas' : 'todas'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHabilitada(visible.map((o) => o.id), false)}
                    className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--text-strong)]"
                  >
                    Desactivar {query || filter !== 'todas' ? 'estas' : 'todas'}
                  </button>
                </div>
              </div>
            </div>

            {visible.length === 0 ? (
              <Card className="p-10 text-center text-sm text-[var(--muted)]">
                {query ? `Ninguna obra social coincide con "${query}".` : 'No hay obras sociales en este filtro.'}
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((obraSocial, index) => (
                  <div
                    key={obraSocial.id}
                    className={`card-enter flex flex-col rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                      obraSocial.habilitada
                        ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5'
                        : 'border-[var(--border)] bg-[var(--surface)] opacity-75'
                    }`}
                    style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-[var(--text-strong)]">{obraSocial.nombre}</p>
                        <p className={`mt-0.5 text-xs font-medium ${obraSocial.habilitada ? 'text-emerald-400' : 'text-[var(--muted)]'}`}>
                          {obraSocial.habilitada ? 'Activa' : 'Inactiva'}
                          {obraSocial.personalizado && (
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/15 px-1.5 py-0.5 text-[var(--accent-soft)]">
                              <Sparkles size={11} /> Personalizada
                            </span>
                          )}
                        </p>
                      </div>
                      <Switch
                        checked={obraSocial.habilitada}
                        onChange={(value) => setHabilitada([obraSocial.id], value)}
                        label={`${obraSocial.habilitada ? 'Desactivar' : 'Activar'} ${obraSocial.nombre}`}
                      />
                    </div>

                    <div className="mt-3 flex-1 space-y-1.5">
                      <Preview icon={ClipboardList} label="Para autorizar" text={obraSocial.requisitosRegistro} />
                      <Preview icon={CalendarCheck} label="El día del estudio" text={obraSocial.requisitosEstudio} />
                      <Preview icon={StickyNote} label="Notas" text={obraSocial.notas} />
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditing(obraSocial)}
                      className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] py-2 text-sm font-medium text-[var(--text-strong)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      <Pencil size={14} /> Editar requisitos
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </LabLayout>
      <ObraSocialEditModal obraSocial={editing} onClose={() => setEditing(null)} onSaved={handleTextoSaved} />
    </>
  )
}
