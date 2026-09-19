import { useEffect, useRef, useState } from 'react'
import { Save, Info } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import HelpButton from '../components/ui/HelpButton.jsx'
import FlowMap from '../components/flow/FlowMap.jsx'
import FlowNodePanel from '../components/flow/FlowNodePanel.jsx'
import { getNodeAtPath, getOptionLabelAtPath, updateNodeAtPath, renameOptionAtPath, deleteOptionAtPath } from '../components/flow/flowTree.js'
import { getFlow, saveFlow } from '../api/flowService.js'
import { getLabProfile } from '../api/labService.js'

export function FlowTutorial() {
  return (
    <>
      <p>
        Esto es el <strong>árbol de conversación</strong> de tu asistente, como un mapa: cada caja
        es un mensaje que el bot puede enviar, y las líneas conectan cada botón con la respuesta
        que dispara.
      </p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          <strong>Pasá el mouse</strong> sobre una caja para ver un preview del mensaje sin
          abrirla.
        </li>
        <li>
          <strong>Hacé click</strong> en una caja para verla en un panel de solo lectura — tocá
          "Editar" (arriba a la derecha) recién ahí para poder modificarla. Desde ahí también podés
          pasar a pantalla completa, y volver con "← Volver".
        </li>
        <li>
          <strong>Ramas:</strong> cada botón ("Sacar turno", "Obras Sociales"...) tiene su propio
          mensaje de respuesta, y podés seguir agregando sub-ramas con "Agregar rama" — así se arma
          el árbol completo, como Obras Sociales → PAMI → instrucciones puntuales.
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
          cambiar su significado (tocá el ícono "i" al lado del botón para más detalle).
        </li>
        <li>
          <strong>"Hablar con un humano":</strong> es una rama especial (no tiene mensaje propio,
          se ve en el mapa con ícono de auricular). Cuando un paciente la elige, el bot deja de
          responderle automáticamente y la conversación aparece en "Atención humana" para que
          alguien del laboratorio la tome.
        </li>
      </ol>
      <p>
        Los cambios se <strong>guardan solos</strong> un rato y medio después de la última edición
        — no hace falta acordarse de tocar "Guardar flujo", aunque también podés hacerlo para
        confirmar al toque.
      </p>
    </>
  )
}

// Cuánto esperar sin más cambios antes de guardar solo — ni tan corto que
// dispare una request por cada tecla, ni tan largo que se sienta que "no
// guardó". Se resetea con cada cambio nuevo (debounce), no dispara una vez
// por cambio.
const AUTOSAVE_DELAY_MS = 1500

export default function FlowBuilder() {
  const [tree, setTree] = useState(null)
  const [allowHandoff, setAllowHandoff] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [selectedPath, setSelectedPath] = useState(null)

  // Arranca en true para no disparar un guardado apenas termina de cargar el
  // flujo inicial (ese setTree no es una edición del usuario) — se consume
  // una sola vez, en el primer cambio de "tree" que ya no sea null.
  const skipNextAutosave = useRef(true)

  useEffect(() => {
    Promise.all([getFlow(), getLabProfile()]).then(([flow, profile]) => {
      setTree(flow)
      setAllowHandoff(profile.handlesHumanHandoff)
      setLoading(false)
    })
  }, [])

  // Guardado automático: para que un cambio nunca se pierda por olvidarse de
  // tocar "Guardar flujo" (algo que pasaba seguido) — no reemplaza el botón,
  // que sigue sirviendo para confirmar al toque antes de salir.
  useEffect(() => {
    if (!tree) return
    if (skipNextAutosave.current) {
      skipNextAutosave.current = false
      return
    }

    const timeoutId = setTimeout(async () => {
      setAutoSaving(true)
      try {
        // No se pisa "tree" con la respuesta acá: el árbol local ya es la
        // fuente de verdad mientras se edita, y reasignarlo dispararía este
        // mismo efecto de nuevo con una referencia nueva (loop infinito).
        await saveFlow(tree)
        setSavedAt(new Date())
      } finally {
        setAutoSaving(false)
      }
    }, AUTOSAVE_DELAY_MS)

    return () => clearTimeout(timeoutId)
  }, [tree])

  async function handleSave() {
    setSaving(true)
    const saved = await saveFlow(tree)
    // Ya se guardó recién — que el efecto de autosave no dispare otro guardado
    // redundante solo porque "tree" cambió de referencia al reasignarlo.
    skipNextAutosave.current = true
    setTree(saved)
    setSavedAt(new Date())
    setSaving(false)
  }

  function handleChangeSelectedNode(patchedNode) {
    setTree((prev) => updateNodeAtPath(prev, selectedPath, () => patchedNode))
  }

  function handleRenameSelected(newLabel) {
    setTree((prev) => renameOptionAtPath(prev, selectedPath, newLabel))
  }

  function handleDeleteSelected() {
    setTree((prev) => deleteOptionAtPath(prev, selectedPath))
    setSelectedPath(null)
  }

  if (loading || !tree) {
    return (
      <LabLayout title="Flujo de conversación" userLabel="Cargando…">
        <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">Cargando flujo…</div>
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
          <Info size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
          <p className="text-xs text-[var(--muted)]">
            Pasá el mouse sobre una caja para ver un preview del mensaje y hacé click para
            editarla. Podés anidar tantos niveles como necesites (por ejemplo Obras Sociales →
            Obra Social Provincia → instrucciones puntuales). La rama especial "Hablar con un
            humano" (ícono de auricular) pausa las respuestas automáticas de esa conversación y la
            suma a la bandeja de Atención humana.
          </p>
        </Card>

        <FlowMap tree={tree} selectedPath={selectedPath} onSelect={setSelectedPath} />

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} className="px-4 py-2.5 text-sm">
            <Save size={16} />
            {saving ? 'Guardando…' : 'Guardar flujo'}
          </Button>
          {autoSaving && !saving && (
            <span className="text-xs text-[var(--muted)]">Guardando automáticamente…</span>
          )}
          {savedAt && !saving && !autoSaving && (
            <span className="text-xs text-[var(--muted)]">Guardado a las {savedAt.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      {selectedPath && (
        <FlowNodePanel
          node={getNodeAtPath(tree, selectedPath)}
          label={selectedPath.length === 0 ? 'Mensaje de bienvenida' : getOptionLabelAtPath(tree, selectedPath)}
          allowHandoff={allowHandoff}
          onChange={handleChangeSelectedNode}
          onOpenChild={(optionId) => setSelectedPath([...selectedPath, optionId])}
          onClose={() => setSelectedPath(null)}
          currentLabel={selectedPath.length === 0 ? undefined : getOptionLabelAtPath(tree, selectedPath)}
          onRenameSelf={selectedPath.length === 0 ? undefined : handleRenameSelected}
          onDeleteSelf={selectedPath.length === 0 ? undefined : handleDeleteSelected}
        />
      )}
    </LabLayout>
  )
}
