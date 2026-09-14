import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import LandingNavbar from '../components/layout/LandingNavbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Card from '../components/ui/Card.jsx'

function Section({ id, title, children }) {
  return (
    <Card id={id} className="scroll-mt-24 p-6">
      <h2 className="text-lg font-bold text-[var(--accent)]">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--text)]">{children}</div>
    </Card>
  )
}

function SubHeading({ children }) {
  return <h3 className="text-sm font-semibold text-[var(--text-strong)]">{children}</h3>
}

export default function Legal() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const el = document.querySelector(location.hash)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.hash])

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <LandingNavbar />

      <section className="mx-auto max-w-3xl px-6 pb-8 pt-20 text-center">
        <h1 className="text-3xl font-extrabold text-[var(--text-strong)] sm:text-4xl">Términos, Condiciones y Privacidad</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Versión 3.0 — Última actualización: 25 de agosto de 2026</p>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Este documento constituye un contrato legalmente vinculante entre ZeroAutoapp (domiciliado
          en San Juan, Provincia de San Juan, Argentina) y el "Cliente" (laboratorio clínico, centro
          de salud o entidad contratante). Al registrarse, acceder a la plataforma, abonar la
          suscripción en el panel de Facturación o utilizar cualquier módulo del servicio, el
          Cliente declara haber leído, comprendido y aceptado de manera incondicional, total e
          irrefutable estos Términos y Condiciones.
        </p>
      </section>

      <section className="mx-auto max-w-3xl space-y-6 px-6 pb-24">
        <Section id="terminos" title="I. Naturaleza del servicio y exención de responsabilidad">
          <div>
            <SubHeading>1. Provisión de tecnología "as-is" (tal como está)</SubHeading>
            <p className="mt-2">
              ZeroAutoapp es estricta y únicamente una herramienta tecnológica de autogestión.
              Proveemos el software; el Cliente asume el control total de cómo lo utiliza. Nuestra
              única responsabilidad técnica es garantizar que el sistema esté en línea.
              ZeroAutoapp se exime expresamente de cualquier responsabilidad derivada de la relación
              entre el Cliente y sus propios pacientes.
            </p>
          </div>
          <div>
            <SubHeading>2. Responsabilidad exclusiva sobre el Flujo de Conversación</SubHeading>
            <p className="mt-2">
              El módulo de "Flujo de conversación" permite al Cliente diseñar, redactar y modificar
              libremente sus mensajes y opciones de respuesta. ZeroAutoapp NO es responsable de lo
              que el asistente virtual responda: si un paciente presenta una queja o inconformidad
              respecto al tono, la información médica o el trato recibido por el bot, la
              responsabilidad recae 100% sobre el Cliente. Nos desvinculamos completamente de
              cualquier conflicto derivado de los textos, reglas, links o imágenes que el Cliente
              configure en su panel.
            </p>
          </div>
          <div>
            <SubHeading>3. Exención de responsabilidad en la "Atención humana"</SubHeading>
            <p className="mt-2">
              ZeroAutoapp no audita, no monitorea y no interviene en la bandeja de Atención humana.
              Si un paciente queda esperando respuesta, o el personal del Cliente ignora los
              mensajes acumulados en este módulo, ZeroAutoapp carece de toda responsabilidad civil,
              penal o comercial. Es obligación exclusiva del Cliente gestionar a los pacientes que
              la Inteligencia Artificial le deriva.
            </p>
          </div>
        </Section>

        <Section id="pagos" title="II. Política de pagos, facturación y prevención de fraudes">
          <div>
            <SubHeading>1. Única vía de pago autorizada</SubHeading>
            <p className="mt-2">
              Todo pago por concepto de suscripción deberá realizarse exclusivamente a través del
              módulo interno de "Facturación" dentro de la plataforma oficial. Los pagos por
              transferencia solo serán válidos si se envían a los alias y CVU/CBU explícitamente
              detallados en la pantalla de Facturación de la cuenta del Cliente.
            </p>
          </div>
          <div>
            <SubHeading>2. Protocolo anti-estafas y phishing</SubHeading>
            <p className="mt-2">
              ZeroAutoapp <strong>JAMÁS</strong> enviará correos, mensajes de WhatsApp ni SMS
              solicitando pagos a cuentas alternativas, alertando sobre "problemas de facturación"
              con links externos, ni ofreciendo descuentos fuera de la plataforma. Si el Cliente
              transfiere dinero a una cuenta distinta a la especificada en su panel de Facturación
              por haber sido víctima de una estafa o suplantación de identidad, ZeroAutoapp no se
              hará responsable de la pérdida de esos fondos ni bonificará el servicio. El único
              correo que el Cliente recibirá es el comprobante automático una vez que el pago haya
              sido acreditado.
            </p>
          </div>
          <div>
            <SubHeading>3. Suspensión automática por falta de pago</SubHeading>
            <p className="mt-2">
              El Cliente se compromete a mantener su suscripción al día. ZeroAutoapp se reserva el
              derecho de automatizar la suspensión del servicio de IA en caso de que el sistema no
              registre el pago correspondiente en la fecha de vencimiento estipulada.
            </p>
          </div>
        </Section>

        <Section id="datos" title="III. Protección de datos de pacientes">
          <div>
            <SubHeading>1. Propiedad de los datos</SubHeading>
            <p className="mt-2">
              Toda la base de conocimiento, la configuración de marca, logos, reglas del asistente y
              los números de teléfono de los pacientes que interactúen con el sistema son propiedad
              única y exclusiva del Cliente. ZeroAutoapp actúa como un mero canal de transmisión y
              no asume la titularidad de los pacientes del laboratorio.
            </p>
          </div>
        </Section>

        <Section id="privacidad" title="Política de privacidad — Confidencialidad">
          <div>
            <SubHeading>2. Confidencialidad</SubHeading>
            <p className="mt-2">
              El Cliente acepta que, si bien ZeroAutoapp provee la estructura segura, es
              responsabilidad del Cliente proteger sus credenciales de acceso a la aplicación.
              ZeroAutoapp no se responsabiliza por filtraciones de datos que provengan del acceso no
              autorizado de empleados o terceros al panel de control del Cliente.
            </p>
          </div>
        </Section>
      </section>

      <Footer />
    </div>
  )
}
