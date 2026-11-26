import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from './DashboardLayout.jsx'
import { LAB_NAV_ITEMS } from '../../config/nav.js'
import { getHandoffQueue } from '../../api/handoffService.js'
import { getLabProfile } from '../../api/labService.js'
import { getAuthLabId } from '../../api/client.js'
import { useVisiblePolling } from '../../lib/useVisiblePolling.js'

// Cada cuánto se vuelve a pedir la cola de atención humana. 45 s: un paciente
// que pidió hablar con una persona no espera minutos sin que nadie se entere,
// y no se castiga a la API (solo corre con la pestaña visible).
const HANDOFF_POLL_MS = 45_000
const BASE_TITLE = 'ZeroAutoapp'
const LOADING_LABELS = new Set(['Cargando…', 'Error'])

// Nombre del laboratorio por sesión (labId): se pide una sola vez y se
// reusa en todas las pantallas. Antes, mientras cada pantalla cargaba, el
// encabezado mostraba el id interno (un código largo) en vez del nombre.
const labNameCache = new Map()

function loadLabName(labId) {
  if (!labNameCache.has(labId)) {
    labNameCache.set(
      labId,
      getLabProfile()
        .then((profile) => profile.businessName || profile.name || null)
        .catch(() => {
          labNameCache.delete(labId)
          return null
        }),
    )
  }
  return labNameCache.get(labId)
}

export default function LabLayout({
  title,
  subtitle,
  userLabel,
  headerActions,
  children,
}) {
  const [handoffCount, setHandoffCount] = useState(0)
  const [labName, setLabName] = useState(null)

  useEffect(() => {
    const labId = getAuthLabId()
    if (!labId) return undefined
    let active = true
    loadLabName(labId).then((name) => {
      if (active) setLabName(name)
    })
    return () => {
      active = false
    }
  }, [])

  const headerLabel = labName || (userLabel && !LOADING_LABELS.has(userLabel) ? userLabel : 'Mi laboratorio')

  // Si falla (red caída, API reiniciando) se conserva el último número en
  // vez de romper la pantalla ni mostrar un error por un simple contador.
  const refreshHandoffCount = useCallback(() => {
    getHandoffQueue()
      .then((queue) => setHandoffCount(queue.length))
      .catch(() => {})
  }, [])

  useEffect(() => {
    refreshHandoffCount()
  }, [refreshHandoffCount])

  useVisiblePolling(refreshHandoffCount, HANDOFF_POLL_MS)

  // Con la pestaña en segundo plano, "(2) ZeroAutoapp" avisa que hay
  // pacientes esperando sin tener que mirar el panel.
  useEffect(() => {
    document.title = handoffCount > 0 ? `(${handoffCount}) ${title} · ${BASE_TITLE}` : `${title} · ${BASE_TITLE}`
    return () => {
      document.title = BASE_TITLE
    }
  }, [handoffCount, title])

  const navItems = LAB_NAV_ITEMS.map((item) =>
    item.badgeKey === 'handoff' ? { ...item, badge: handoffCount } : item,
  )

  return (
    <DashboardLayout
      navItems={navItems}
      title={title}
      subtitle={subtitle}
      userLabel={headerLabel}
      headerActions={headerActions}
    >
      {children}
    </DashboardLayout>
  )
}
