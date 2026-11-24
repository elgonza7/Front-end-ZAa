import { useState } from 'react'
import { CheckCircle2, Circle, ChevronDown, AlertTriangle, Smartphone, QrCode, Lightbulb } from 'lucide-react'
import { PREFLIGHT_ITEMS } from '../../lib/whatsappConnectInfo.js'

// Guía de conexión de WhatsApp para gente que no es de sistemas: lista previa,
// paso a paso con "pantallas" dibujadas (no son capturas reales de Meta: son
// esquemas simplificados para que reconozcan cada pantalla) y qué hacer si
// algo sale mal. Todo sale de conexiones reales hechas en nov 2026 — ver
// Zero/CLAUDE.md, sección "Coexistence con Embedded Signup".

export function PreflightChecklist({ checked, onToggle }) {
  return (
    <ul className="space-y-2">
      {PREFLIGHT_ITEMS.map((item) => {
        const isChecked = checked.includes(item.id)
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              aria-pressed={isChecked}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                isChecked ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]/50'
              }`}
            >
              {isChecked ? (
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-400" />
              ) : (
                <Circle size={20} className="mt-0.5 shrink-0 text-[var(--muted)]" />
              )}
              <span>
                <span className="block text-sm font-medium text-[var(--text-strong)]">{item.title}</span>
                <span className="mt-0.5 block text-xs text-[var(--muted)]">{item.help}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

// ---------- "Pantallas" dibujadas ----------

function MockScreen({ title, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white text-left text-[13px] text-gray-800 shadow-sm" aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-100 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        <span className="ml-2 truncate text-xs text-gray-500">Ventana de Facebook</span>
      </div>
      <div className="space-y-2.5 p-4">
        {title && <p className="font-semibold text-gray-900">{title}</p>}
        {children}
      </div>
    </div>
  )
}

function MockField({ label, value, highlight }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <div className={`mt-0.5 rounded-md border px-2.5 py-1.5 ${highlight ? 'border-amber-500 ring-2 ring-amber-300' : 'border-gray-300'}`}>
        {value}
      </div>
    </div>
  )
}

function MockButton({ children, primary, highlight }) {
  return (
    <span
      className={`inline-block rounded-md px-3 py-1.5 text-xs font-semibold ${
        primary ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700'
      } ${highlight ? 'ring-2 ring-amber-400 ring-offset-1' : ''}`}
    >
      {children}
    </span>
  )
}

function MockButtons({ children }) {
  return <div className="flex justify-end gap-2 pt-1">{children}</div>
}

function MockQr() {
  // Cuadrícula fija (no un QR real) solo para que se reconozca la pantalla.
  const cells = '1110111010110011011101001101100111010111011010011'.split('')
  return (
    <div className="mx-auto grid w-24 grid-cols-7 gap-0.5 rounded bg-white p-1.5 ring-1 ring-gray-300">
      {cells.map((cell, index) => (
        <span key={index} className={`aspect-square ${cell === '1' ? 'bg-gray-900' : 'bg-white'}`} />
      ))}
    </div>
  )
}

// ---------- Paso a paso ----------

const STEPS = [
  {
    title: 'Tocá "Conectar con Facebook"',
    body: 'Se abre una ventana nueva de Facebook. Si no aparece, el navegador la bloqueó: buscá un aviso de "ventana emergente bloqueada" arriba a la derecha y tocá "Permitir".',
    screen: (
      <MockScreen title="Iniciar sesión con Facebook">
        <MockField label="Correo o teléfono" value="tu-email@ejemplo.com" />
        <MockField label="Contraseña" value="••••••••" />
        <MockButtons>
          <MockButton primary>Continuar</MockButton>
        </MockButtons>
      </MockScreen>
    ),
  },
  {
    title: 'Iniciá sesión con tu Facebook',
    body: 'Usá la cuenta del dueño o encargado del laboratorio. Si ya estabas con la sesión iniciada, te pregunta si querés continuar con esa cuenta.',
  },
  {
    title: 'Escribí el número de WhatsApp Business',
    body: 'En "Añade tu número de teléfono de WhatsApp" elegí Argentina (+54) y escribí el número sin el 0 y sin el 15. Ejemplo: 264 555 1234. Después tocá "Siguiente".',
    screen: (
      <MockScreen title="Añade tu número de teléfono de WhatsApp">
        <div className="grid grid-cols-[90px_1fr] gap-2">
          <MockField label="País" value="AR +54" highlight />
          <MockField label="Número" value="264 555 1234" highlight />
        </div>
        <MockButtons>
          <MockButton>Atrás</MockButton>
          <MockButton primary highlight>Siguiente</MockButton>
        </MockButtons>
      </MockScreen>
    ),
    warning:
      'Si en este paso te pide un código por SMS o por llamada, CERRÁ la ventana y no escribas el código. Significa que el número no está en WhatsApp Business (o la app está desactualizada). Si ponés el código, el número se puede desconectar de tu celular.',
  },
  {
    title: 'Confirmá que es tu WhatsApp Business',
    body: 'Aparece "Verifica la información de tu cuenta" con el nombre y el número de tu WhatsApp Business. Si son los correctos, tocá "Siguiente".',
    screen: (
      <MockScreen title="Verifica la información de tu cuenta">
        <div className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 py-3">
          <span className="h-10 w-10 rounded-full bg-gray-300" />
          <span className="font-semibold">Tu laboratorio</span>
          <span className="text-xs text-gray-500">+54 9 264 555 1234</span>
        </div>
        <MockButtons>
          <MockButton primary highlight>Siguiente</MockButton>
        </MockButtons>
      </MockScreen>
    ),
  },
  {
    title: 'Elegí la cuenta comercial (portfolio) de tu laboratorio',
    body: 'Si tu laboratorio ya tiene una en Meta, elegila de la lista. Si no tiene ninguna, elegí "Crear un portfolio empresarial" y completá los datos REALES del laboratorio: nombre, email, país Argentina y sitio web (si no tenés, podés dejar el que aparece).',
    screen: (
      <MockScreen title="Selecciona los activos comerciales">
        <MockField label="Portfolio empresarial" value="Laboratorio (tu nombre real)" highlight />
        <MockField label="País" value="Argentina" />
        <MockButtons>
          <MockButton primary highlight>Siguiente</MockButton>
        </MockButtons>
      </MockScreen>
    ),
    tip: 'Usá los datos reales del laboratorio. Meta revisa estas cuentas y las que parecen inventadas o de prueba las puede bloquear.',
  },
  {
    title: 'Escaneá el código QR con el celular',
    body: 'En la computadora aparece un código QR. En el celular, abrí WhatsApp Business: te llega un mensaje de Meta para conectar tu cuenta. Seguilo y escaneá el código UNA sola vez. Después esperá un par de minutos sin tocar nada.',
    screen: (
      <MockScreen title="Usa la aplicación de WhatsApp Business para escanear el código QR">
        <MockQr />
        <p className="text-center text-xs text-gray-500">Escanealo una sola vez desde el celular</p>
      </MockScreen>
    ),
    warning: 'No escanees el código varias veces seguidas: WhatsApp puede poner tu cuenta "en revisión" por 24 horas.',
  },
  {
    title: 'Aceptá los permisos',
    body: 'Aparece "Revisa lo que compartirás con laboratorio zaa": son los permisos para que el asistente pueda leer y responder los mensajes. La opción "Activar las estadísticas para tu negocio" es para publicidad: podés destildarla. Tocá "Siguiente".',
    screen: (
      <MockScreen title="Revisa lo que compartirás">
        <p className="text-xs text-gray-600">• Administrar tus cuentas de WhatsApp</p>
        <p className="text-xs text-gray-600">• Administrar y acceder a conversaciones en WhatsApp</p>
        <p className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="inline-block h-3 w-3 rounded-sm border border-gray-400" /> Activar las estadísticas (opcional)
        </p>
        <MockButtons>
          <MockButton primary highlight>Siguiente</MockButton>
        </MockButtons>
      </MockScreen>
    ),
  },
  {
    title: 'Esperá a que termine',
    body: 'Aparece "Conectando tu cuenta… Esto puede tardar unos instantes". Puede demorar varios minutos: no cierres la ventana y no toques "Reintentar".',
  },
  {
    title: 'Tocá "Omitir y finalizar configuración"',
    body: 'Cuando diga "Tu cuenta está conectada", Meta te ofrece agregar un método de pago. No hace falta: tus pacientes te escriben primero y esas respuestas no tienen costo de Meta. Tocá "Omitir y finalizar configuración".',
    screen: (
      <MockScreen title="Tu cuenta está conectada">
        <p className="text-xs text-gray-600">Activos creados correctamente</p>
        <MockButtons>
          <MockButton highlight>Omitir y finalizar configuración</MockButton>
          <MockButton primary>Agregar método de pago</MockButton>
        </MockButtons>
      </MockScreen>
    ),
  },
  {
    title: '¡Listo!',
    body: 'La ventana se cierra sola y en ZeroAutoapp el estado pasa a "Conectado". Para probar, mandale un WhatsApp a tu número desde OTRO celular y fijate que conteste el asistente.',
  },
]

export function ConnectSteps() {
  const [open, setOpen] = useState(0)

  return (
    <ol className="space-y-2">
      {STEPS.map((step, index) => {
        const isOpen = open === index
        return (
          <li key={step.title} className="rounded-xl border border-[var(--border)] bg-[var(--bg)]">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-xs font-bold text-[var(--accent)]">
                {index + 1}
              </span>
              <span className="flex-1 text-sm font-medium text-[var(--text-strong)]">{step.title}</span>
              <ChevronDown size={18} className={`shrink-0 text-[var(--muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="grid grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-2">
                <div className="space-y-3 text-sm text-[var(--text)]">
                  <p>{step.body}</p>
                  {step.warning && (
                    <p className="flex gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-[var(--text-strong)]">
                      <AlertTriangle size={17} className="mt-0.5 shrink-0 text-red-400" />
                      <span>{step.warning}</span>
                    </p>
                  )}
                  {step.tip && (
                    <p className="flex gap-2 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-3">
                      <Lightbulb size={17} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                      <span>{step.tip}</span>
                    </p>
                  )}
                  {index < STEPS.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setOpen(index + 1)}
                      className="text-sm font-semibold text-[var(--accent)] underline"
                    >
                      Siguiente paso →
                    </button>
                  )}
                </div>
                {step.screen && (
                  <div>
                    <p className="mb-1.5 text-xs text-[var(--muted)]">Así se ve (aproximadamente):</p>
                    {step.screen}
                  </div>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

// ---------- Si algo sale mal ----------

const PROBLEMS = [
  {
    q: 'Me pidió un código por SMS o por llamada',
    a: 'Cerrá la ventana sin escribir el código. Tu número todavía no está en WhatsApp Business (o la app está desactualizada). Pasalo a WhatsApp Business, actualizá la app, usalo unos días y volvé a intentar.',
  },
  {
    q: 'En el celular dice "Account in review" (cuenta en revisión)',
    a: 'WhatsApp está revisando tu cuenta, suele pasar al escanear el QR varias veces. Esperá a que termine (normalmente 24 horas), seguí usando la app normal y después intentá una sola vez más.',
  },
  {
    q: 'Dice que el número "no cumple los requisitos" o que la cuenta está restringida',
    a: 'Es un bloqueo de Meta sobre la cuenta comercial. No reintentes muchas veces. Entrá a business.facebook.com → "Calidad de la cuenta" y pedí la revisión una sola vez. Escribinos y te ayudamos con el reclamo.',
  },
  {
    q: 'La ventana de Facebook no se abre',
    a: 'El navegador está bloqueando ventanas emergentes. Buscá el aviso arriba a la derecha y tocá "Permitir", o probá con Chrome o Edge sin bloqueadores de publicidad.',
  },
  {
    q: 'Terminé todo pero acá no dice "Conectado"',
    a: 'Recargá la página. Si sigue sin conectar, volvé a tocar "Conectar con Facebook" una sola vez y avanzá sin pausas largas.',
  },
  {
    q: 'Está conectado pero el asistente no contesta',
    a: 'Escribile a tu número desde OTRO celular (desde el mismo no funciona). Si igual no contesta, escribinos: lo revisamos nosotros.',
  },
]

export function ConnectTroubleshooting() {
  return (
    <div className="space-y-2">
      {PROBLEMS.map((problem) => (
        <details key={problem.q} className="group rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-[var(--text-strong)]">
            {problem.q}
            <ChevronDown size={17} className="shrink-0 text-[var(--muted)] transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-sm text-[var(--text)]">{problem.a}</p>
        </details>
      ))}
    </div>
  )
}

// Bloque informativo de qué es Coexistence, en criollo.
export function CoexistenceExplainer() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
        <Smartphone size={20} className="text-[var(--accent)]" />
        <p className="mt-2 text-sm font-semibold text-[var(--text-strong)]">Tu celular sigue igual</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Seguís usando WhatsApp Business como siempre: chats, historial, grupos y llamadas.</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
        <QrCode size={20} className="text-[var(--accent)]" />
        <p className="mt-2 text-sm font-semibold text-[var(--text-strong)]">Se conecta una sola vez</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Con tu Facebook y un código QR. No hay que copiar ningún dato técnico.</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
        <CheckCircle2 size={20} className="text-[var(--accent)]" />
        <p className="mt-2 text-sm font-semibold text-[var(--text-strong)]">El asistente responde solo</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Contesta a tus pacientes por el mismo número. Vos podés intervenir cuando quieras desde el celular.</p>
      </div>
    </div>
  )
}
