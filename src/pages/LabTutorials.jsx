import { useEffect, useState } from 'react'
import { GraduationCap, Server, Smartphone, MessagesSquare, Headset, CircleHelp } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import { getConnection } from '../api/whatsappService.js'

function Step({ n, title, children }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F8B500]/15 text-xs font-bold text-[#F8B500]">
        {n}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-[#8b949e]">{children}</p>
      </div>
    </div>
  )
}

export default function LabTutorials() {
  const [connection, setConnection] = useState(null)

  useEffect(() => {
    getConnection().then(setConnection)
  }, [])

  const type = connection?.connectionType ?? null

  return (
    <LabLayout
      title="Tutoriales"
      subtitle="Cómo funciona tu asistente, explicado sin vueltas ni palabras técnicas"
    >
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <GraduationCap size={17} className="text-[#F8B500]" />
            <h2 className="text-base font-bold text-white">Lo más importante, en una frase</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#e6e6e6]">
            ZeroAutoapp es un empleado que nunca duerme: cuando un paciente le escribe por
            WhatsApp a tu laboratorio, este sistema le contesta solo — sin que vos tengas que
            tocar nada — usando la información que cargaste en "Flujo de conversación". Vos no
            tenés que estar mirando el celular todo el día para que funcione.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            {type === 'COEXISTENCE' ? (
              <Smartphone size={17} className="text-[#F8B500]" />
            ) : (
              <Server size={17} className="text-[#F8B500]" />
            )}
            <h2 className="text-base font-bold text-white">
              {type === 'COEXISTENCE'
                ? 'Tu caso: mantenés tu WhatsApp Business de siempre'
                : type === 'MANUAL'
                  ? 'Tu caso: número dedicado al asistente'
                  : 'Todavía no conectaste tu WhatsApp'}
            </h2>
          </div>

          {type === 'COEXISTENCE' && (
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#e6e6e6]">
              <p>
                Seguís usando la app de WhatsApp Business en tu celular exactamente como siempre —
                mismos chats, mismos grupos, mismo historial. El asistente contesta en paralelo,
                desde el mismo número, y lo que él escribe también te aparece en el celular.
              </p>
              <p className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3 text-xs text-[#8b949e]">
                Una sola cosa a tener en cuenta: abrí la app de WhatsApp Business en el celular al
                menos una vez cada 14 días (aunque sea para mirarla un segundo). Si nadie la abre
                en todo ese tiempo, WhatsApp pausa el asistente hasta que alguien la vuelva a
                abrir.
              </p>
            </div>
          )}

          {type === 'MANUAL' && (
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#e6e6e6]">
              <p>
                El número que conectaste quedó dedicado 100% al asistente — no tiene la app de
                WhatsApp instalada en ningún celular, así que vos no vas a ver esas charlas en tu
                teléfono. Para eso está la sección <strong>"Mensajes"</strong> del menú de la
                izquierda: ahí podés leer, cuando quieras, todo lo que el asistente conversó con
                cada paciente.
              </p>
            </div>
          )}

          {!type && (
            <p className="mt-3 text-sm text-[#8b949e]">
              Andá a la sección "WhatsApp" del menú para conectar tu número — ahí te explicamos
              paso a paso cómo hacerlo.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <MessagesSquare size={17} className="text-[#F8B500]" />
            <h2 className="text-base font-bold text-white">¿Cómo veo lo que habló el asistente?</h2>
          </div>
          <div className="mt-4 space-y-4">
            {type === 'COEXISTENCE' ? (
              <Step n="1" title="Abrí WhatsApp Business en tu celular">
                Las charlas están ahí mismo, mezcladas con las que atendiste vos — no hace falta
                entrar a ningún otro lado.
              </Step>
            ) : (
              <>
                <Step n="1" title='Entrá a "Mensajes" en el menú de la izquierda'>
                  Vas a ver una lista con cada paciente que le escribió al asistente, ordenada por
                  el más reciente arriba.
                </Step>
                <Step n="2" title="Elegí una charla para leerla completa">
                  Se abre a la derecha, con los mensajes del paciente de un lado y las respuestas
                  del asistente del otro — como cualquier chat de WhatsApp.
                </Step>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Headset size={17} className="text-[#F8B500]" />
            <h2 className="text-base font-bold text-white">¿Y si un paciente necesita hablar con una persona?</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#8b949e]">
            Esto es igual sin importar cómo conectaste tu número. Si el asistente detecta que el
            paciente necesita hablar con alguien del laboratorio, avisa en la sección{' '}
            <strong>"Atención humana"</strong> del menú — ahí aparece esa charla esperando a que
            alguien del equipo la tome y responda personalmente.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <CircleHelp size={17} className="text-[#F8B500]" />
            <h2 className="text-base font-bold text-white">¿Algo no funciona como esperabas?</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#8b949e]">
            No hace falta que sepas nada de tecnología para pedir ayuda: escribinos a{' '}
            <a href="mailto:zeroautoapp@gmail.com" className="text-[#F8B500] underline">
              zeroautoapp@gmail.com
            </a>{' '}
            contando qué esperabas que pasara y qué pasó en cambio, y te ayudamos a resolverlo.
          </p>
        </Card>
      </div>
    </LabLayout>
  )
}
