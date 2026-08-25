import { useEffect, useState } from 'react'
import DashboardLayout from './DashboardLayout.jsx'
import { LAB_NAV_ITEMS } from '../../config/nav.js'
import { getHandoffQueue } from '../../api/handoffService.js'

export default function LabLayout({
  title,
  subtitle,
  userLabel = 'Laboratorio Ameghino',
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
