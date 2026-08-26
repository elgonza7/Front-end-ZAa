// Helpers para navegar/editar el árbol de conversación por "path": un array
// de option ids que va desde la raíz hasta el nodo (path = [] es la raíz).
// Se usan desde FlowBuilder/FlowNodePanel para saber qué nodo está
// seleccionado en el mapa y para escribir cambios sin mutar el árbol.

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
