import { useEffect, useState } from 'react'
import { Save, Upload, FileText, Trash2, Link as LinkIcon, ShieldCheck } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Switch from '../components/ui/Switch.jsx'
import Button from '../components/ui/Button.jsx'
import ImageDrop from '../components/ui/ImageDrop.jsx'
import HelpButton from '../components/ui/HelpButton.jsx'
import {
  getLabProfile,
  updateLabSettings,
  uploadLogo,
  uploadBanner,
  getKnowledgeDocs,
  uploadKnowledgeDoc,
} from '../api/labService.js'

const DELIVERY_METHODS = [
  { value: 'PORTAL', label: 'Portal web (el paciente ingresa con DNI y contraseña)' },
  { value: 'PDF', label: 'PDF por WhatsApp (el laboratorio lo envía manualmente)' },
  { value: 'MANUAL', label: 'Manual (sin sistema — se avisa que el equipo lo enviará)' },
]

export default function LabSettings() {
  const [form, setForm] = useState(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [docs, setDocs] = useState([])
  const [docUploading, setDocUploading] = useState(false)
  const [securityPhone, setSecurityPhone] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    Promise.all([getLabProfile(), getKnowledgeDocs()])
      .then(([profile, knowledgeDocs]) => {
        setForm(profile)
        setSecurityPhone(profile.securityPhone || '')
        setDocs(knowledgeDocs)
      })
      .catch((err) => setLoadError(err.message || 'No se pudo cargar la configuración.'))
  }, [])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleLogoSelect(file) {
    setLogoUploading(true)
    const { logoUrl } = await uploadLogo(file)
    set('logoUrl', logoUrl)
    setLogoUploading(false)
  }

  async function handleBannerSelect(file) {
    setBannerUploading(true)
    const { bannerUrl } = await uploadBanner(file)
    set('bannerUrl', bannerUrl)
    setBannerUploading(false)
  }

  async function handleSave(event) {
    event.preventDefault()
    setSaving(true)
    const updated = await updateLabSettings({
      businessName: form.businessName,
      ownerName: form.ownerName,
      address: form.address,
      contactPhone: form.contactPhone,
      handlesAppointments: form.handlesAppointments,
      handlesHumanHandoff: form.handlesHumanHandoff,
      handoffNotifyEmail: form.handoffNotifyEmail,
      handoffNotifyEmailAddress: form.handoffNotifyEmailAddress,
      resultsDeliveryMethod: form.resultsDeliveryMethod,
      resultsPortalUrl: form.resultsPortalUrl,
    })
    setForm(updated)
    setSaving(false)
  }

  async function handleDocUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setDocUploading(true)
    const newDoc = await uploadKnowledgeDoc(file)
    setDocs((prev) => [newDoc, ...prev])
    setDocUploading(false)
    event.target.value = ''
  }

  function handleRemoveDoc(id) {
    setDocs((prev) => prev.filter((doc) => doc.id !== id))
  }

  if (loadError) {
    return (
      <LabLayout title="Configuración" userLabel="Error">
        <div className="flex h-64 items-center justify-center text-sm text-red-400">{loadError}</div>
      </LabLayout>
    )
  }

  if (!form) {
    return (
      <LabLayout title="Configuración" userLabel="Cargando…">
        <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">Cargando…</div>
      </LabLayout>
    )
  }

  return (
    <LabLayout title="Configuración" subtitle="Marca, reglas del asistente y base de conocimiento">
      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-[var(--text-strong)]">Marca y datos del laboratorio</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            El logo y el banner son opcionales — se muestran en el panel y en el enlace de resultados.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ImageDrop
              label="Logo"
              value={form.logoUrl}
              uploading={logoUploading}
              height={120}
              onSelect={handleLogoSelect}
              onRemove={() => set('logoUrl', null)}
            />
            <ImageDrop
              label="Banner (opcional)"
              value={form.bannerUrl}
              uploading={bannerUploading}
              height={120}
              onSelect={handleBannerSelect}
              onRemove={() => set('bannerUrl', null)}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Nombre del laboratorio</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(event) => set('businessName', event.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Titular / Responsable</label>
              <input
                type="text"
                value={form.ownerName}
                onChange={(event) => set('ownerName', event.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Dirección</label>
              <input
                type="text"
                value={form.address}
                onChange={(event) => set('address', event.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Teléfono de contacto</label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(event) => set('contactPhone', event.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 opacity-60">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-strong)]">
              <ShieldCheck size={16} className="text-[var(--accent)]" />
              Seguridad
            </h2>
            <Badge variant="neutral">Próximamente</Badge>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Vas a poder cargar un teléfono para recibir por SMS un código extra cada vez que
            restablezcas la contraseña de esta cuenta (además del link que llega por email). Esta
            función todavía no está disponible.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                Teléfono de seguridad (con código de país, ej. +5491122334455)
              </label>
              <input
                type="text"
                disabled
                value={securityPhone}
                onChange={(event) => setSecurityPhone(event.target.value)}
                placeholder="Todavía no disponible"
                className="w-full cursor-not-allowed rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] placeholder:text-[var(--muted)]/60 outline-none"
              />
            </div>
            <Button type="button" variant="outline" disabled className="px-4 py-2.5 text-sm">
              Guardar teléfono
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-[var(--text-strong)]">Reglas del asistente</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Estas opciones habilitan o quitan ramas enteras del flujo de conversación.
          </p>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
              <div>
                <p className="text-sm text-[var(--text-strong)]">Este laboratorio maneja turnos</p>
                <p className="text-xs text-[var(--muted)]">Muestra u oculta la rama "Sacar turno" en el flujo.</p>
              </div>
              <Switch checked={form.handlesAppointments} onChange={(v) => set('handlesAppointments', v)} />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
              <div>
                <p className="text-sm text-[var(--text-strong)]">Permitir atención humana</p>
                <p className="text-xs text-[var(--muted)]">
                  Habilita la rama "Hablar con un humano": pausa las respuestas automáticas y avisa
                  al laboratorio.
                </p>
              </div>
              <Switch checked={form.handlesHumanHandoff} onChange={(v) => set('handlesHumanHandoff', v)} />
            </div>

            {form.handlesHumanHandoff && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--text-strong)]">Avisarme por email</p>
                    <p className="text-xs text-[var(--muted)]">
                      Además del aviso en el panel, recibí un email cada vez que un paciente pida
                      hablar con un humano.
                    </p>
                  </div>
                  <Switch checked={form.handoffNotifyEmail} onChange={(v) => set('handoffNotifyEmail', v)} />
                </div>
                {form.handoffNotifyEmail && (
                  <input
                    type="email"
                    value={form.handoffNotifyEmailAddress}
                    onChange={(event) => set('handoffNotifyEmailAddress', event.target.value)}
                    placeholder="email@tulaboratorio.com"
                    className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
                  />
                )}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-[var(--text-strong)]">Entrega de resultados</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            El bot adapta el mensaje de "Ver resultados" según cómo trabaje tu laboratorio.
          </p>

          <div className="mt-4 space-y-2">
            {DELIVERY_METHODS.map((method) => (
              <label
                key={method.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  form.resultsDeliveryMethod === method.value
                    ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5'
                    : 'border-[var(--border)] bg-[var(--bg)]'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  className="mt-0.5"
                  checked={form.resultsDeliveryMethod === method.value}
                  onChange={() => set('resultsDeliveryMethod', method.value)}
                />
                <span className="text-sm text-[var(--text-strong)]">{method.label}</span>
              </label>
            ))}
          </div>

          {form.resultsDeliveryMethod === 'PORTAL' && (
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">URL del portal de resultados</label>
              <input
                type="text"
                value={form.resultsPortalUrl}
                onChange={(event) => set('resultsPortalUrl', event.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
              />
            </div>
          )}
        </Card>

        <Button type="submit" disabled={saving} className="px-4 py-2.5 text-sm">
          <Save size={16} />
          {saving ? 'Guardando…' : 'Guardar configuración'}
        </Button>
      </form>

      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[var(--text-strong)]">Base de conocimiento</h2>
          <HelpButton title="Cómo funciona la Base de conocimiento" label="¿Cómo funciona?">
            <p>
              Los PDF que subís acá (cartillas de obras sociales, requisitos de estudios, horarios
              de sucursales) se guardan en el almacenamiento del laboratorio y el backend les{' '}
              <strong>extrae el texto automáticamente</strong>. Ese texto queda disponible como
              contexto de referencia para la IA: cuando un paciente pregunta algo que no está
              cubierto por una rama del flujo, el asistente puede consultar esta información antes
              de responder.
            </p>
            <p>
              Es distinto del botón <strong>"Mejorar con IA"</strong> que ves en el editor del
              flujo de conversación: ese botón solo corrige ortografía y prolija el mensaje puntual
              que estás escribiendo en ese momento — no lee ni usa estos PDF.
            </p>
            <p className="text-xs text-[var(--muted)]">
              En resumen: la Base de conocimiento le da información al bot; "Mejorar con IA" te
              ayuda a redactar mejor un mensaje.
            </p>
          </HelpButton>
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Subí cartillas médicas en PDF para que la IA responda con tu información.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
            <Upload size={16} />
            {docUploading ? 'Subiendo…' : 'Subir cartilla médica PDF'}
            <input type="file" accept="application/pdf" className="hidden" onChange={handleDocUpload} />
          </label>
          <Button variant="outline" className="px-4 py-3 text-sm" type="button">
            <LinkIcon size={16} />
            Agregar URL
          </Button>
        </div>

        <ul className="mt-4 space-y-2">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText size={16} className="shrink-0 text-[var(--accent)]" />
                <div className="min-w-0">
                  <p className="truncate text-sm text-[var(--text-strong)]">{doc.name}</p>
                  <p className="text-[11px] text-[var(--muted)]">
                    {doc.size} · {doc.uploadedAt}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDoc(doc.id)}
                className="shrink-0 text-[var(--muted)] hover:text-red-400"
                aria-label={`Eliminar ${doc.name}`}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
          {docs.length === 0 && (
            <p className="py-4 text-center text-xs text-[var(--muted)]">Todavía no subiste documentos.</p>
          )}
        </ul>
      </Card>
    </LabLayout>
  )
}
