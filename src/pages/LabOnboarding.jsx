import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Switch from '../components/ui/Switch.jsx'
import Badge from '../components/ui/Badge.jsx'
import ImageDrop from '../components/ui/ImageDrop.jsx'
import Logo from '../components/ui/Logo.jsx'
import { getLabProfile, updateLabSettings, uploadLogo, uploadBanner } from '../api/labService.js'
import { setOnboardingCompleted } from '../api/client.js'
import { DELIVERY_METHODS } from '../lib/deliveryMethods.js'

const STEPS = ['Marca y datos', 'Reglas del asistente', 'Entrega de resultados']

// Sin sidebar a propósito, igual que ChangePassword.jsx: es una pantalla de
// paso obligatorio, no un panel más — no tiene sentido ofrecer links de
// navegación que igual van a rebotar de vuelta acá (ver el gate en
// RequireAuth.jsx).
function OnboardingShell({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex justify-center">
          <Logo size={44} />
        </div>
        <div className="mt-6 text-center">
          <h1 className="text-xl font-bold text-[var(--text-strong)]">¡Bienvenido a ZeroAutoapp!</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Antes de arrancar, terminemos de configurar tu asistente — te lleva un par de minutos.
          </p>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

// Asistente de configuración guiada que se muestra UNA sola vez, en el
// primer login de un laboratorio nuevo (después de cambiar la contraseña
// temporal) — ver el gate en RequireAuth.jsx. Reusa los mismos campos y el
// mismo endpoint que la pantalla de Configuración normal (PUT
// /api/lab/settings), separados en pasos para que no abrume de entrada. Al
// guardar el último paso, el backend marca OnboardingCompleted = true y acá
// actualizamos el flag local (sessionStorage) para que RequireAuth deje de
// redirigir antes de navegar al panel.
export default function LabOnboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [logoUploading, setLogoUploading] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    getLabProfile()
      .then(setForm)
      .catch((err) => setLoadError(err.message || 'No se pudo cargar tu laboratorio.'))
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

  async function handleFinish() {
    setSaving(true)
    setSaveError('')
    try {
      await updateLabSettings({
        businessName: form.businessName,
        ownerName: form.ownerName,
        address: form.address,
        contactPhone: form.contactPhone,
        whatsappAbout: form.whatsappAbout,
        handlesAppointments: form.handlesAppointments,
        handlesHumanHandoff: form.handlesHumanHandoff,
        handoffNotifyEmail: form.handoffNotifyEmail,
        handoffNotifyEmailAddress: form.handoffNotifyEmailAddress,
        resultsDeliveryMethod: form.resultsDeliveryMethod,
        resultsPortalUrl: form.resultsPortalUrl,
      })
      setOnboardingCompleted(true)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setSaveError(err.message || 'No se pudo guardar la configuración.')
    } finally {
      setSaving(false)
    }
  }

  if (loadError) {
    return (
      <OnboardingShell>
        <div className="flex h-64 items-center justify-center text-sm text-red-400">{loadError}</div>
      </OnboardingShell>
    )
  }

  if (!form) {
    return (
      <OnboardingShell>
        <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">Cargando…</div>
      </OnboardingShell>
    )
  }

  const isLastStep = step === STEPS.length - 1

  return (
    <OnboardingShell>
      <div className="space-y-5">
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  index < step
                    ? 'bg-[var(--accent)] text-black'
                    : index === step
                      ? 'border-2 border-[var(--accent)] text-[var(--accent)]'
                      : 'border border-[var(--border)] text-[var(--muted)]'
                }`}
              >
                {index < step ? <CheckCircle2 size={15} /> : index + 1}
              </div>
              <span
                className={`hidden text-xs sm:inline ${
                  index === step ? 'font-semibold text-[var(--text-strong)]' : 'text-[var(--muted)]'
                }`}
              >
                {label}
              </span>
              {index < STEPS.length - 1 && <div className="h-px w-6 bg-[var(--border)] sm:w-10" />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-[var(--text-strong)]">Marca y datos del laboratorio</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Esto es lo que ven tus pacientes en el chat de WhatsApp y en el enlace de resultados. Si ya tenés
              logo, subilo acá — lo podés cambiar cuando quieras desde Configuración.
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
                  value={form.address ?? ''}
                  onChange={(event) => set('address', event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Teléfono de contacto</label>
                <input
                  type="text"
                  value={form.contactPhone ?? ''}
                  onChange={(event) => set('contactPhone', event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                  Descripción para WhatsApp (se ve en "Info. del contacto")
                </label>
                <input
                  type="text"
                  maxLength={139}
                  value={form.whatsappAbout ?? ''}
                  onChange={(event) => set('whatsappAbout', event.target.value)}
                  placeholder='Ej: "Laboratorio de análisis clínicos — turnos y resultados por WhatsApp"'
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)]"
                />
                <p className="mt-1.5 text-[11px] text-[var(--muted)]">
                  Se aplica al perfil real de WhatsApp Business en cuanto conectes tu número. El nombre
                  grande de arriba del todo ("verified name") no se puede cambiar desde acá.
                </p>
              </div>
            </div>
          </Card>
        )}

        {step === 1 && (
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-[var(--text-strong)]">Reglas del asistente</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Estas opciones habilitan o quitan ramas enteras del flujo de conversación con el paciente.
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
                    Habilita la rama "Hablar con un humano": pausa las respuestas automáticas y avisa al
                    laboratorio.
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
                        Recibí un email cada vez que un paciente pida hablar con un humano.
                      </p>
                    </div>
                    <Switch checked={form.handoffNotifyEmail} onChange={(v) => set('handoffNotifyEmail', v)} />
                  </div>
                  {form.handoffNotifyEmail && (
                    <input
                      type="email"
                      value={form.handoffNotifyEmailAddress ?? ''}
                      onChange={(event) => set('handoffNotifyEmailAddress', event.target.value)}
                      placeholder="email@tulaboratorio.com"
                      className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
              <Sparkles size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold text-[var(--text-strong)]">
                  Próximamente <Badge variant="neutral">En camino</Badge>
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
                  Vas a poder indicar acá qué obras sociales aceptás y qué estudios hacés, para que las ramas
                  que no te aplican (por ejemplo, una obra social que no tenés o un estudio que no realizás)
                  se oculten solas del flujo. Todavía no está disponible — por ahora, sacá esas ramas a mano
                  desde "Flujo de conversación".
                </p>
              </div>
            </div>
          </Card>
        )}

        {step === 2 && (
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
                  value={form.resultsPortalUrl ?? ''}
                  onChange={(event) => set('resultsPortalUrl', event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
                />
              </div>
            )}

            {form.resultsDeliveryMethod === 'PDF' && (
              <p className="mt-4 text-xs text-[var(--muted)]">
                Para enviar el PDF manualmente desde el mismo número que usa el bot, vas a necesitar activar{' '}
                <strong>Coexistence</strong> al conectar tu WhatsApp (así seguís teniendo la app de WhatsApp
                Business en tu celular, en paralelo al asistente) — eso se configura en el panel, en "WhatsApp".
              </p>
            )}

            {saveError && <p className="mt-4 text-xs text-red-400">{saveError}</p>}
          </Card>
        )}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            className="px-4 py-2.5 text-sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft size={16} />
            Atrás
          </Button>

          {isLastStep ? (
            <Button type="button" className="px-4 py-2.5 text-sm" onClick={handleFinish} disabled={saving}>
              {saving ? 'Guardando…' : 'Finalizar configuración'}
              <CheckCircle2 size={16} />
            </Button>
          ) : (
            <Button type="button" className="px-4 py-2.5 text-sm" onClick={() => setStep((s) => s + 1)}>
              Siguiente
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </OnboardingShell>
  )
}
