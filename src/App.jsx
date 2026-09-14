import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import RequireAuth from './components/auth/RequireAuth.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import Features from './pages/Features.jsx'
import Pricing from './pages/Pricing.jsx'
import Changelog from './pages/Changelog.jsx'
import Legal from './pages/Legal.jsx'
import HelpCenterPublic from './pages/HelpCenterPublic.jsx'
import SystemStatus from './pages/SystemStatus.jsx'
import LabDashboard from './pages/LabDashboard.jsx'
import WhatsAppConnect from './pages/WhatsAppConnect.jsx'
import FlowBuilder from './pages/FlowBuilder.jsx'
import LabSettings from './pages/LabSettings.jsx'
import HandoffInbox from './pages/HandoffInbox.jsx'
import LabBilling from './pages/LabBilling.jsx'
import LabHelpCenter from './pages/LabHelpCenter.jsx'
import LabTutorials from './pages/LabTutorials.jsx'
import LabConversations from './pages/LabConversations.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import AdminTenants from './pages/AdminTenants.jsx'
import AdminMetrics from './pages/AdminMetrics.jsx'
import AdminFeedback from './pages/AdminFeedback.jsx'

export default function App() {
  const location = useLocation()

  return (
    // key={pathname}: remonta el árbol en cada navegación para que dispare de
    // nuevo la animación CSS ".page-transition" (@keyframes page-enter) — sin
    // esto, entre páginas del mismo layout no habría transición visible.
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/olvide-password" element={<ForgotPassword />} />
        <Route path="/restablecer-password" element={<ResetPassword />} />
        <Route path="/cambiar-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
        <Route path="/caracteristicas" element={<Features />} />
        <Route path="/precios" element={<Pricing />} />
        <Route path="/actualizaciones" element={<Changelog />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/ayuda" element={<HelpCenterPublic />} />
        <Route path="/estado" element={<SystemStatus />} />

        <Route path="/dashboard" element={<RequireAuth role="lab"><LabDashboard /></RequireAuth>} />
        <Route path="/dashboard/whatsapp" element={<RequireAuth role="lab"><WhatsAppConnect /></RequireAuth>} />
        <Route path="/dashboard/tutoriales" element={<RequireAuth role="lab"><LabTutorials /></RequireAuth>} />
        <Route path="/dashboard/mensajes" element={<RequireAuth role="lab"><LabConversations /></RequireAuth>} />
        <Route path="/dashboard/flujo" element={<RequireAuth role="lab"><FlowBuilder /></RequireAuth>} />
        <Route path="/dashboard/configuracion" element={<RequireAuth role="lab"><LabSettings /></RequireAuth>} />
        <Route path="/dashboard/conversaciones" element={<RequireAuth role="lab"><HandoffInbox /></RequireAuth>} />
        <Route path="/dashboard/facturacion" element={<RequireAuth role="lab"><LabBilling /></RequireAuth>} />
        <Route path="/dashboard/ayuda" element={<RequireAuth role="lab"><LabHelpCenter /></RequireAuth>} />

        <Route path="/admin" element={<RequireAuth role="admin"><AdminPanel /></RequireAuth>} />
        <Route path="/admin/inquilinos" element={<RequireAuth role="admin"><AdminTenants /></RequireAuth>} />
        <Route path="/admin/metricas" element={<RequireAuth role="admin"><AdminMetrics /></RequireAuth>} />
        <Route path="/admin/soporte" element={<RequireAuth role="admin"><AdminFeedback /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
