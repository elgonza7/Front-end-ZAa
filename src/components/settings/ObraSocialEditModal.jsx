import { useEffect, useRef, useState } from 'react'
import { RotateCcw, Save, Sparkles } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import InfoTooltip from '../ui/InfoTooltip.jsx'
import { improveMessage } from '../../api/aiService.js'
import { updateObraSocialTexto, resetObraSocialTexto } from '../../api/obrasSocialesService.js'

// Un campo de texto + botón "Mejorar con IA", igual al que ya usa el editor
// del flujo de conversación (FlowNodeEditor): acorta el texto para gastar
// menos tokens sin sacar información médica/administrativa relevante — el
// propio prompt del backend ya cuida eso (ver GeminiClient.ImproveTextAsync).
function EditableField({ label, value, onChange, rows = 3 }) {
  const [improving, setImproving] = useState(false)
  const [tokensConsumed, setTokensConsumed] = useState(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  async function handleImprove() {
    if (!value.trim()) return
    setImproving(true)
    try {
      const { text, tokensConsumed: used } = await improveMessage(value)
      onChange(text)
      setTokensConsumed(used ?? null)
    } finally {
      setImproving(false)
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">{label}</label>
      <textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
        style={{ minHeight: rows * 26 }}
      />
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="px-3 py-1.5 text-xs"
          onClick={handleImprove}
          disabled={improving || !value.trim()}
        >
          <Sparkles size={13} />
          {improving ? 'Mejorando…' : 'Mejorar con IA'}
        </Button>
        <InfoTooltip text="Corrige ortografía y acorta el texto con IA para gastar menos tokens, sin sacar datos médicos o administrativos importantes. Siempre podés seguir editando el resultado." />
        {tokensConsumed !== null && (
          <span className="text-xs text-[var(--muted)]">
            Consumió <span className="text-[var(--text-strong)]">{tokensConsumed.toLocaleString()} tokens</span>
          </span>
        )}
      </div>
    </div>
  )
}

// Formulario en un componente aparte, montado con key={obraSocial.id}, para
// que el estado arranque de cero en cada obra social sin necesitar un efecto
// que lo resetee a mano.
function ObraSocialEditForm({ obraSocial, onSaved }) {
  const [form, setForm] = useState({
    requisitosRegistro: obraSocial.requisitosRegistro || '',
    requisitosEstudio: obraSocial.requisitosEstudio || '',
    notas: obraSocial.notas || '',
  })
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const updated = await updateObraSocialTexto(obraSocial.id, {
      requisitosRegistro: form.requisitosRegistro.trim(),
      requisitosEstudio: form.requisitosEstudio.trim(),
      notas: form.notas.trim() || null,
    })
    setSaving(false)
    onSaved(updated)
  }

  async function handleReset() {
    setResetting(true)
    const updated = await resetObraSocialTexto(obraSocial.id)
    setResetting(false)
    onSaved(updated)
  }

  return (
    <>
      <p className="text-xs text-[var(--muted)]">
        Este texto es solo para tu laboratorio — no afecta a los demás. Dejalo como está si te sirve
        el genérico, o ajustalo si tenés reglas propias para esta cobertura.
      </p>

      <div className="mt-4 space-y-5">
        <EditableField
          label="Para autorizar y cargar la orden (qué pedirle al paciente)"
          value={form.requisitosRegistro}
          onChange={(v) => set('requisitosRegistro', v)}
        />
        <EditableField
          label="El día del estudio (qué tiene que traer)"
          value={form.requisitosEstudio}
          onChange={(v) => set('requisitosEstudio', v)}
        />
        <EditableField
          label="Notas (excepciones, coseguros, planes no habilitados — opcional)"
          value={form.notas}
          onChange={(v) => set('notas', v)}
          rows={2}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        {obraSocial.personalizado ? (
          <Button type="button" variant="outline" className="px-3 py-2 text-xs" onClick={handleReset} disabled={resetting}>
            <RotateCcw size={14} />
            {resetting ? 'Restaurando…' : 'Restaurar el del catálogo'}
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving || !form.requisitosRegistro.trim() || !form.requisitosEstudio.trim()}
          className="px-4 py-2.5 text-sm"
        >
          <Save size={16} />
          {saving ? 'Guardando…' : 'Guardar personalización'}
        </Button>
      </div>
    </>
  )
}

// Edita el texto que el asistente usa para UNA obra social puntual, propio
// de este laboratorio — si nunca lo tocó, se ven (y se pueden editar) los
// valores del catálogo general como punto de partida.
export default function ObraSocialEditModal({ obraSocial, onClose, onSaved }) {
  return (
    <Modal open={!!obraSocial} onClose={onClose} title={obraSocial ? `Personalizar "${obraSocial.nombre}"` : ''} size="lg">
      {obraSocial && <ObraSocialEditForm key={obraSocial.id} obraSocial={obraSocial} onSaved={onSaved} />}
    </Modal>
  )
}
