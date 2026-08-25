import { useEffect, useState } from 'react'
import DashboardLayout from './DashboardLayout.jsx'
import { ADMIN_NAV_ITEMS } from '../../config/nav.js'
import { getFeedback } from '../../api/feedbackService.js'

export default function AdminLayout({ title, subtitle, userLabel = 'Administrador', headerActions, children }) {
  const [openFeedbackCount, setOpenFeedbackCount] = useState(0)

  useEffect(() => {
    getFeedback().then((items) => setOpenFeedbackCount(items.filter((item) => item.status === 'OPEN').length))
  }, [])

  const navItems = ADMIN_NAV_ITEMS.map((item) =>
    item.badgeKey === 'feedback' ? { ...item, badge: openFeedbackCount } : item,
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
