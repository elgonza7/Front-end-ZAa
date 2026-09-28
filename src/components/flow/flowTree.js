// Helpers para navegar/editar el árbol de conversación por "path": un array
// de option ids que va desde la raíz hasta el nodo (path = [] es la raíz).
// Se usan desde FlowBuilder/FlowNodePanel para saber qué nodo está
// seleccionado en el mapa y para escribir cambios sin mutar el árbol.

// Ramas "atajo": no llevan a un nodo del árbol (node: null, sin isHandoff)
// sino a otra pantalla del panel — ej. la lista real de obras sociales vive
// en Configuración, no acá, para no duplicar esos textos y gastar tokens de
// más (ver LabSettings.jsx y WhatsAppMessageProcessingService en el backend).
// Es solo una señal visual para quien edita el flujo, así no parece que
// "falta" contenido: el bot igual tiene y usa esa info en la conversación.
export const FLOW_LINK_TARGETS = {
  'obras-sociales': {
    path: '/dashboard/configuracion#obras-sociales',
    shortLabel: 'Ir a Configuración',
    description:
      'Lleva a Configuración → Obras sociales, donde se activan y se personalizan los requisitos de cada una. No es una rama real de la conversación: el asistente ya usa esa información aunque no esté dibujada acá.',
  },
}

export function getNodeAtPath(tree, path) {
  let node = tree
  for (const optionId of path) {
    const option = node.options.find((opt) => opt.id === optionId)
    if (!option?.node) return null
    node = option.node
  }
  return node
}

// Label del botón que lleva a este nodo (undefined para la raíz, que no
// tiene botón propio — su "label" es el mensaje de bienvenida).
export function getOptionLabelAtPath(tree, path) {
  if (path.length === 0) return undefined
  let node = tree
  let label
  for (const optionId of path) {
    const option = node.options.find((opt) => opt.id === optionId)
    label = option?.label
    node = option?.node
  }
  return label
}

export function updateNodeAtPath(tree, path, updater) {
  if (path.length === 0) return updater(tree)
  const [optionId, ...rest] = path
  return {
    ...tree,
    options: tree.options.map((option) =>
      option.id === optionId ? { ...option, node: updateNodeAtPath(option.node, rest, updater) } : option,
    ),
  }
}

// Cambia el label del botón que lleva al nodo en path (no del mensaje del
// nodo en sí — eso vive en el padre). No hace nada si path es la raíz: la
// raíz no tiene un botón propio que renombrar.
export function renameOptionAtPath(tree, path, newLabel) {
  if (path.length === 0) return tree
  const parentPath = path.slice(0, -1)
  const optionId = path[path.length - 1]
  return updateNodeAtPath(tree, parentPath, (parentNode) => ({
    ...parentNode,
    options: parentNode.options.map((option) => (option.id === optionId ? { ...option, label: newLabel } : option)),
  }))
}

// Borra el botón (y toda la sub-rama que cuelga de él) del nodo padre. No
// hace nada si path es la raíz: la raíz no se puede borrar a sí misma.
export function deleteOptionAtPath(tree, path) {
  if (path.length === 0) return tree
  const parentPath = path.slice(0, -1)
  const optionId = path[path.length - 1]
  return updateNodeAtPath(tree, parentPath, (parentNode) => ({
    ...parentNode,
    options: parentNode.options.filter((option) => option.id !== optionId),
  }))
}
