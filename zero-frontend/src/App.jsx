import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
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
import AdminPanel from './pages/AdminPanel.jsx'
import AdminTenants from './pages/AdminTenants.jsx'
import AdminMetrics from './pages/AdminMetrics.jsx'
import AdminFeedback from './pages/AdminFeedback.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/caracteristicas" element={<Features />} />
      <Route path="/precios" element={<Pricing />} />
      <Route path="/actualizaciones" element={<Changelog />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/ayuda" element={<HelpCenterPublic />} />
      <Route path="/estado" element={<SystemStatus />} />

      <Route path="/dashboard" element={<LabDashboard />} />
      <Route path="/dashboard/whatsapp" element={<WhatsAppConnect />} />
      <Route path="/dashboard/flujo" element={<FlowBuilder />} />
      <Route path="/dashboard/configuracion" element={<LabSettings />} />
      <Route path="/dashboard/conversaciones" element={<HandoffInbox />} />
      <Route path="/dashboard/facturacion" element={<LabBilling />} />
      <Route path="/dashboard/ayuda" element={<LabHelpCenter />} />

      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/inquilinos" element={<AdminTenants />} />
      <Route path="/admin/metricas" element={<AdminMetrics />} />
      <Route path="/admin/soporte" element={<AdminFeedback />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
