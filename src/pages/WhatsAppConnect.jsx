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
        Estos datos salen de <strong>Meta for Developers</strong>, la plataforma de Meta (la
        empresa de Facebook/WhatsApp) para conectar aplicaciones a WhatsApp. No hace falta saber
        de programación: es completar formularios en su sitio. Se configura <strong>una sola vez</strong>{' '}
        y de ahí en más el asistente queda funcionando solo.
      </p>

      <div>
        <p className="text-sm font-semibold text-white">Antes de empezar, necesitás:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            Una cuenta de Facebook (personal, sirve la del dueño o encargado del laboratorio) para
            entrar a Meta for Developers.
          </li>
          <li>
            Un <strong>Facebook Business Manager</strong> (administrador comercial). Si no lo
            tenés, Meta te lo ofrece crear gratis en el mismo paso 1 — no es necesario tenerlo de
            antemano.
          </li>
          <li>
            El número de WhatsApp que vas a usar para el bot. <strong>Importante:</strong> ese
            número no puede tener WhatsApp normal o WhatsApp Business App instalado al mismo
            tiempo — Meta lo migra a la API y deja de funcionar en el celular. Si querés seguir
            usando ese número a mano, usá otro número para el bot (podés arrancar con el número de
            prueba gratuito de Meta mientras tanto, ver paso 2).
          </li>
        </ul>
      </div>

      <ol className="list-decimal space-y-3 pl-5">
        <li>
          <strong>Creá la App de Meta.</strong> Entrá a{' '}
          <a
            href="https://developers.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F8B500] underline"
          >
            developers.facebook.com
          </a>{' '}
          → arriba a la derecha, "Mis Apps" → "Crear app". Elegí el tipo <strong>"Business"</strong>{' '}
          (Empresa), ponele un nombre (ej. el nombre del laboratorio) y confirmá. Si te pide crear
          un Business Manager nuevo, aceptá — es gratis.
        </li>
        <li>
          <strong>Agregá el producto WhatsApp.</strong> Dentro del panel de la App, en la lista de
          productos que aparece, buscá la tarjeta <strong>"WhatsApp"</strong> y tocá "Configurar" /
          "Set up". Meta te asigna automáticamente un número de prueba gratuito con un token
          temporal (dura 24 hs) — sirve para probar todo el flujo antes de usar tu número real.
        </li>
        <li>
          <strong>Copiá el Phone Number ID y el WABA ID.</strong> En el menú lateral{' '}
          <strong>WhatsApp → Configuración de la API</strong> ("API Setup") vas a ver dos códigos
          largos de números: <strong>Phone Number ID</strong> (el número que envía los mensajes) y
          más abajo el <strong>WhatsApp Business Account ID</strong> (WABA ID, la cuenta que agrupa
          uno o más números). Copialos tal cual figuran, sin espacios.
        </li>
        <li>
          <strong>Generá un Access Token permanente.</strong> El token que te da la pantalla de
          prueba dura 24 hs y después el bot deja de responder. Para uno que no vence: andá a{' '}
          <strong>Configuración de la empresa</strong> (ícono de engranaje, arriba a la izquierda,
          fuera del panel de la App) → <strong>Usuarios → Usuarios del sistema</strong> → "Añadir" →
          creá un usuario con rol <strong>Administrador</strong>. Entrá a ese usuario → "Añadir
          activos" → asignale tu App con permiso "Control total". Después tocá{' '}
          <strong>"Generar nuevo token"</strong>, elegí esa misma App, y marcá los permisos{' '}
          <code className="rounded bg-[#0d1117] px-1 py-0.5 text-[#e3c065]">whatsapp_business_messaging</code>{' '}
          y{' '}
          <code className="rounded bg-[#0d1117] px-1 py-0.5 text-[#e3c065]">whatsapp_business_management</code>.
          Ese token largo (empieza con "EAAG…") es el <strong>Access Token</strong> — copialo en el
          momento, Meta no te lo vuelve a mostrar completo después.
        </li>
        <li>
          <strong>Pasá a tu número real (opcional, para producción).</strong> Mientras usás el
          número de prueba, el bot solo le puede escribir a números que vos agregues a mano como
          "destinatario de prueba" en esa misma pantalla. Para atender pacientes de verdad,
          necesitás vincular tu número real: en{' '}
          <strong>WhatsApp → Configuración de la API</strong>, "Agregar número de teléfono", y
          seguí la verificación por SMS o llamada. Si es la primera vez que verificás el negocio
          ante Meta (Business Verification), puede pedir datos legales del laboratorio (CUIT,
          dirección) — tarda entre minutos y un par de días.
        </li>
        <li>
          <strong>Definí el Webhook Verify Token.</strong> Es un texto cualquiera que vos inventás
          (ej. <code className="rounded bg-[#0d1117] px-1 py-0.5 text-[#e3c065]">zeroauto-mi-laboratorio-2026</code>),
          no lo genera Meta. Pegalo en el campo de acá abajo y también en Meta, en{' '}
          <strong>WhatsApp → Configuración → Webhook → Editar</strong>: como URL de callback poné
          la dirección de nuestro servidor terminada en{' '}
          <code className="rounded bg-[#0d1117] px-1 py-0.5 text-[#e3c065]">/api/webhooks/whatsapp</code>,
          y como "Verify Token" el mismo texto que elegiste. Guardá y suscribite al campo{' '}
          <strong>messages</strong> (es el que avisa cuando llega un mensaje nuevo).
        </li>
        <li>
          <strong>Completá el formulario acá abajo.</strong> Pegá los 4 datos (Phone Number ID,
          WABA ID, Access Token, Webhook Verify Token), tocá "Guardar y conectar", y después "Enviar
          mensaje de prueba" para confirmar que llega a un WhatsApp real.
        </li>
      </ol>

      <p className="text-xs text-[#8b949e]">
        Este proceso se hace una única vez por laboratorio; después de guardado, el asistente queda
        conectado hasta que lo desvincules. Si en algún paso Meta muestra una pantalla distinta a
        la descripta, es porque cambian el diseño seguido — los nombres de los menús
        (Configuración de la API, Usuarios del sistema, Webhook) se mantienen aunque cambie el
        acomodo visual. Ante cualquier duda, escribinos a{' '}
        <a href="mailto:zeroautoapp@gmail.com" className="text-[#F8B500] underline">
          zeroautoapp@gmail.com
        </a>{' '}
        y te ayudamos a conectarlo.
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
