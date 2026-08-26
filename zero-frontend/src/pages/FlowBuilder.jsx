import { useEffect, useState } from 'react'
import { Save, Info } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import HelpButton from '../components/ui/HelpButton.jsx'
import FlowNodeEditor from '../components/flow/FlowNodeEditor.jsx'
import { getFlow, saveFlow } from '../api/flowService.js'
import { getLabProfile } from '../api/labService.js'

function FlowTutorial() {
  return (
    <>
      <p>
        Esto es el <strong>árbol de conversación</strong> de tu asistente: cada tarjeta es un
        mensaje que el bot puede enviar, y cada rama debajo es un botón que el paciente puede
        tocar para avanzar a la siguiente respuesta.
      </p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          <strong>Mensaje de bienvenida:</strong> es lo primero que ve cualquier paciente que le
          escribe al número. Editalo desde el cuadro de texto de la tarjeta superior.
        </li>
        <li>
          <strong>Ramas:</strong> cada botón ("Sacar turno", "Obras Sociales"...) tiene su propio
          mensaje de respuesta, y ese mensaje puede tener sus propias sub-ramas — así podés armar
          conversaciones con varios niveles, como Obras Sociales → PAMI → instrucciones puntuales.
        </li>
        <li>
          <strong>Ya viene precargado</strong> con las indicaciones típicas de un laboratorio de
          análisis clínicos. Revisalo, editá lo que no coincida con tu forma de trabajar, y borrá
          (ícono de tacho) las ramas que no uses.
        </li>
        <li>
          <strong>Imagen adjunta:</strong> es opcional. Si la agregás, se adapta automáticamente al
          espacio disponible sin deformarse, sin importar el tamaño original.
        </li>
        <li>
          <strong>Mejorar con IA:</strong> corrige ortografía y prolija la redacción del mensaje sin
          cambiar su significado.
        </li>
        <li>
          <strong>"Hablar con un humano":</strong> es una rama especial (no tiene mensaje propio).
          Cuando un paciente la elige, el bot deja de responderle automáticamente y la conversación
          aparece en "Atención humana" para que alguien del laboratorio la tome.
        </li>
      </ol>
      <p>No te olvides de tocar <strong>Guardar flujo</strong> al terminar.</p>
    </>
  )
}

export default function FlowBuilder() {
  const [tree, setTree] = useState(null)
  const [allowHandoff, setAllowHandoff] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)

  useEffect(() => {
    Promise.all([getFlow(), getLabProfile()]).then(([flow, profile]) => {
      setTree(flow)
      setAllowHandoff(profile.handlesHumanHandoff)
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    const saved = await saveFlow(tree)
    setTree(saved)
    setSavedAt(new Date())
    setSaving(false)
  }

  if (loading || !tree) {
    return (
      <LabLayout title="Flujo de conversación" userLabel="Cargando…">
        <div className="flex h-64 items-center justify-center text-sm text-[#8b949e]">Cargando flujo…</div>
      </LabLayout>
    )
  }

  return (
    <LabLayout
      title="Flujo de conversación"
      subtitle="Armá el árbol de respuestas del bot: cada rama es una opción que el paciente puede elegir"
      headerActions={
        <HelpButton title="Cómo funciona el flujo de conversación">
          <FlowTutorial />
        </HelpButton>
      }
    >
      <div className="space-y-5">
        <Card className="flex items-start gap-3 p-4">
          <Info size={16} className="mt-0.5 shrink-0 text-[#F8B500]" />
          <p className="text-xs text-[#8b949e]">
            El primer mensaje es el saludo inicial. Cada rama que agregues se muestra como una
            opción para el paciente; podés anidar tantos niveles como necesites (por ejemplo Obras
            Sociales → Obra Social Provincia → instrucciones puntuales). Agregá una imagen si el
            paso lo requiere — se adapta automáticamente al tamaño del mensaje. La rama especial
            "Hablar con un humano" pausa las respuestas automáticas de esa conversación y la suma a
            la bandeja de Atención humana.
          </p>
        </Card>

        <FlowNodeEditor
          node={tree}
          onChange={setTree}
          allowHandoff={allowHandoff}
          label="Mensaje de bienvenida"
        />

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} className="px-4 py-2.5 text-sm">
            <Save size={16} />
            {saving ? 'Guardando…' : 'Guardar flujo'}
          </Button>
          {savedAt && !saving && (
            <span className="text-xs text-[#8b949e]">Guardado a las {savedAt.toLocaleTimeString()}</span>
          )}
        </div>
      </div>
    </LabLayout>
  )
}
