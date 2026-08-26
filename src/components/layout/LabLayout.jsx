import { useEffect, useState } from 'react'
import DashboardLayout from './DashboardLayout.jsx'
import { LAB_NAV_ITEMS } from '../../config/nav.js'
import { getHandoffQueue } from '../../api/handoffService.js'
import { getAuthLabId } from '../../api/client.js'

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

  useEffect(() => {
    getHandoffQueue().then((queue) => setHandoffCount(queue.length))
  }, [])

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
