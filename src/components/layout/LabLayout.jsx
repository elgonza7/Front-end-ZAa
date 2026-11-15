import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from './DashboardLayout.jsx'
import { LAB_NAV_ITEMS } from '../../config/nav.js'
import { getHandoffQueue } from '../../api/handoffService.js'
import { getAuthLabId } from '../../api/client.js'
import { useVisiblePolling } from '../../lib/useVisiblePolling.js'

// Cada cuánto se vuelve a pedir la cola de atención humana. 45 s: un paciente
// que pidió hablar con una persona no espera minutos sin que nadie se entere,
// y no se castiga a la API (solo corre con la pestaña visible).
const HANDOFF_POLL_MS = 45_000
const BASE_TITLE = 'ZeroAutoapp'

export default function LabLayout({
  title,
  subtitle,
  // Si la página que renderiza el layout todavía no cargó el perfil del
  // laboratorio (ej. getLabProfile()), no mostramos un nombre de laboratorio
  // fijo que no corresponde a la sesión real — mostramos el labId de la
  // sesión persistida como placeholder mínimo.
  userLabel = getAuthLabId() ?? 'Laboratorio',
  headerActions,
  children,
}) {
  const [handoffCount, setHandoffCount] = useState(0)

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
      userLabel={userLabel}
      headerActions={headerActions}
    >
      {children}
    </DashboardLayout>
  )
}
