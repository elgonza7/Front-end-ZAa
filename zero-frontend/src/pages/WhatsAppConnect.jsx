import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Send, Unlink, Save, Phone } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import HelpButton from '../components/ui/HelpButton.jsx'
import { getConnection, saveConnection, testConnection, disconnect } from '../api/whatsappService.js'

function WhatsappTutorial() {
  return (
    <>
      <p>
        Estos datos salen de <strong>Meta for Developers</strong>, la plataforma de Meta para
        conectar aplicaciones a WhatsApp. Se configura una sola vez:
      </p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Entrá a{' '}
          <a
            href="https://developers.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F8B500] underline"
          >
            developers.facebook.com
          </a>{' '}
          con el Facebook del laboratorio y creá una App de tipo <strong>"Business"</strong>.
        </li>
        <li>
          Dentro de la App, agregá el producto <strong>WhatsApp</strong>. Meta te crea
          automáticamente un número de prueba con un token temporal (dura 24 hs) — sirve para
          probar la conexión.
        </li>
        <li>
          En <strong>WhatsApp → Configuración de la API</strong> vas a encontrar el{' '}
          <strong>Phone Number ID</strong> y el <strong>WhatsApp Business Account ID</strong>{' '}
          (WABA ID). Copialos tal cual figuran ahí.
        </li>
        <li>
          Para producción (que no se corte cada 24 hs) necesitás un token permanente: en{' '}
          <strong>Configuración empresarial → Usuarios del sistema</strong>, creá un "System User",
          asignale la App y generá un token con los permisos{' '}
          <code className="rounded bg-[#0d1117] px-1 py-0.5 text-[#e3c065]">whatsapp_business_messaging</code>{' '}
          y{' '}
          <code className="rounded bg-[#0d1117] px-1 py-0.5 text-[#e3c065]">whatsapp_business_management</code>.
          Ese es el <strong>Access Token</strong>.
        </li>
        <li>
          Para usar tu propio número de WhatsApp (no el de prueba) necesitás verificar el negocio
          ante Meta (Business Verification) y vincular el número real como WhatsApp Business
          Account.
        </li>
        <li>
          Elegí un <strong>Webhook Verify Token</strong> (cualquier texto que vos definas — pegalo
          también acá abajo) y configurá el webhook en Meta apuntando a la URL de tu backend
          seguida de <code className="rounded bg-[#0d1117] px-1 py-0.5 text-[#e3c065]">/api/webhooks/whatsapp</code>.
          Suscribite al campo <strong>messages</strong>.
        </li>
        <li>Pegá los 4 datos en el formulario, guardá, y probá con "Enviar mensaje de prueba".</li>
      </ol>
      <p className="text-xs text-[#8b949e]">
        Este proceso se hace una única vez por laboratorio; después de guardado, el asistente queda
        conectado hasta que lo desvincules.
      </p>
    </>
  )
}

const QUALITY_LABEL = {
  GREEN: { text: 'Calidad alta', variant: 'success' },
  YELLOW: { text: 'Calidad media', variant: 'warning' },
  RED: { text: 'Calidad baja', variant: 'danger' },
}

export default function WhatsAppConnect() {
  const [connection, setConnection] = useState(null)
  const [form, setForm] = useState({ phoneNumberId: '', wabaId: '', accessToken: '', webhookVerifyToken: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    getConnection().then((data) => {
      setConnection(data)
      setForm({
        phoneNumberId: data.phoneNumberId || '',
        wabaId: data.wabaId || '',
        accessToken: data.accessToken || '',
        webhookVerifyToken: data.webhookVerifyToken || '',
      })
      setLoading(false)
    })
  }, [])

  async function handleSave(event) {
    event.preventDefault()
    setSaving(true)
    const updated = await saveConnection(form)
    setConnection(updated)
    setSaving(false)
  }

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    const result = await testConnection()
    setTestResult(result)
    setTesting(false)
  }

  async function handleDisconnect() {
    const updated = await disconnect()
    setConnection(updated)
  }

  if (loading || !connection) {
    return (
      <LabLayout title="Conexión de WhatsApp" userLabel="Cargando…">
        <div className="flex h-64 items-center justify-center text-sm text-[#8b949e]">Cargando…</div>
      </LabLayout>
    )
  }

  const quality = QUALITY_LABEL[connection.qualityRating] ?? QUALITY_LABEL.YELLOW

  return (
    <LabLayout
      title="Conexión de WhatsApp"
      subtitle="Vinculá tu número con la API de WhatsApp Cloud (Meta) para que el asistente pueda responder"
      headerActions={
        <HelpButton title="Cómo obtener tus credenciales de WhatsApp Cloud API">
          <WhatsappTutorial />
        </HelpButton>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#30363d] bg-[#0d1117] text-[#F8B500]">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Estado de la conexión</p>
              <p className="text-xs text-[#8b949e]">WhatsApp Cloud API</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8b949e]">Estado</span>
              {connection.connected ? (
                <Badge variant="success">
                  <CheckCircle2 size={12} /> Conectado
                </Badge>
              ) : (
                <Badge variant="danger">
                  <XCircle size={12} /> Desconectado
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8b949e]">Número</span>
              <span className="text-sm text-white">{connection.displayPhoneNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8b949e]">Nombre verificado</span>
              <span className="text-sm text-white">{connection.verifiedName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8b949e]">Calidad</span>
              <Badge variant={quality.variant}>{quality.text}</Badge>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Button type="button" variant="outline" className="py-2 text-sm" onClick={handleTest} disabled={testing}>
              <Send size={15} />
              {testing ? 'Enviando…' : 'Enviar mensaje de prueba'}
            </Button>
            {testResult && (
              <p className={`text-xs ${testResult.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                {testResult.message}
              </p>
            )}
            <Button type="button" variant="danger" className="py-2 text-sm" onClick={handleDisconnect}>
              <Unlink size={15} />
              Desvincular número
            </Button>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-white">Credenciales de Meta Cloud API</h2>
          <p className="mt-1 text-xs text-[#8b949e]">
            Obtenelas desde tu App de Meta for Developers (WhatsApp → API Setup). El backend guarda
            el token de forma cifrada y registra el webhook automáticamente.
          </p>

          <form className="mt-4 space-y-4" onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Phone Number ID</label>
                <input
                  type="text"
                  value={form.phoneNumberId}
                  onChange={(event) => setForm({ ...form, phoneNumberId: event.target.value })}
                  placeholder="109876543210987"
                  className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">WhatsApp Business Account ID</label>
                <input
                  type="text"
                  value={form.wabaId}
                  onChange={(event) => setForm({ ...form, wabaId: event.target.value })}
                  placeholder="123456789012345"
                  className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Access Token</label>
              <input
                type="password"
                value={form.accessToken}
                onChange={(event) => setForm({ ...form, accessToken: event.target.value })}
                placeholder="EAAG..."
                className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#8b949e]">Webhook Verify Token</label>
              <input
                type="text"
                value={form.webhookVerifyToken}
                onChange={(event) => setForm({ ...form, webhookVerifyToken: event.target.value })}
                placeholder="zero-webhook-verify-xxxx"
                className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F8B500]"
              />
              <p className="mt-1.5 text-[11px] text-[#8b949e]">
                Usá este mismo valor al configurar el webhook en Meta for Developers, apuntando a{' '}
                <code className="rounded bg-[#0d1117] px-1 py-0.5 text-[#e3c065]">/api/webhooks/whatsapp</code>.
              </p>
            </div>

            <Button type="submit" disabled={saving} className="px-4 py-2.5 text-sm">
              <Save size={16} />
              {saving ? 'Guardando…' : 'Guardar y conectar'}
            </Button>
          </form>
        </Card>
      </div>
    </LabLayout>
  )
}
