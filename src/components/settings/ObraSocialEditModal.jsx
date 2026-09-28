import { useState } from 'react'
import { RotateCcw, Save } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { updateObraSocialTexto, resetObraSocialTexto } from '../../api/obrasSocialesService.js'

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

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
            Para autorizar y cargar la orden (qué pedirle al paciente)
          </label>
          <textarea
            rows={3}
            value={form.requisitosRegistro}
            onChange={(event) => setForm((prev) => ({ ...prev, requisitosRegistro: event.target.value }))}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
            El día del estudio (qué tiene que traer)
          </label>
          <textarea
            rows={3}
            value={form.requisitosEstudio}
            onChange={(event) => setForm((prev) => ({ ...prev, requisitosEstudio: event.target.value }))}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
            Notas (excepciones, coseguros, planes no habilitados — opcional)
          </label>
          <textarea
            rows={2}
            value={form.notas}
            onChange={(event) => setForm((prev) => ({ ...prev, notas: event.target.value }))}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
          />
        </div>
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
    <Modal open={!!obraSocial} onClose={onClose} title={obraSocial ? `Personalizar "${obraSocial.nombre}"` : ''}>
      {obraSocial && <ObraSocialEditForm key={obraSocial.id} obraSocial={obraSocial} onSaved={onSaved} />}
    </Modal>
  )
}
