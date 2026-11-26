import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import RequireAuth from './components/auth/RequireAuth.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'))
const ChangePassword = lazy(() => import('./pages/ChangePassword.jsx'))
const LabOnboarding = lazy(() => import('./pages/LabOnboarding.jsx'))
const Features = lazy(() => import('./pages/Features.jsx'))
const Pricing = lazy(() => import('./pages/Pricing.jsx'))
const Changelog = lazy(() => import('./pages/Changelog.jsx'))
const Legal = lazy(() => import('./pages/Legal.jsx'))
const HelpCenterPublic = lazy(() => import('./pages/HelpCenterPublic.jsx'))
const SystemStatus = lazy(() => import('./pages/SystemStatus.jsx'))
const LabDashboard = lazy(() => import('./pages/LabDashboard.jsx'))
const LabHistory = lazy(() => import('./pages/LabHistory.jsx'))
const WhatsAppConnect = lazy(() => import('./pages/WhatsAppConnect.jsx'))
const FlowBuilder = lazy(() => import('./pages/FlowBuilder.jsx'))
const LabSettings = lazy(() => import('./pages/LabSettings.jsx'))
const HandoffInbox = lazy(() => import('./pages/HandoffInbox.jsx'))
const LabBilling = lazy(() => import('./pages/LabBilling.jsx'))
const LabHelpCenter = lazy(() => import('./pages/LabHelpCenter.jsx'))
const LabTutorials = lazy(() => import('./pages/LabTutorials.jsx'))
const LabObrasSociales = lazy(() => import('./pages/LabObrasSociales.jsx'))
const AdminPanel = lazy(() => import('./pages/AdminPanel.jsx'))
const AdminTenants = lazy(() => import('./pages/AdminTenants.jsx'))
const AdminMetrics = lazy(() => import('./pages/AdminMetrics.jsx'))
const AdminFeedback = lazy(() => import('./pages/AdminFeedback.jsx'))

// Mientras baja el código de la pantalla (se carga recién al entrar).
function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--muted)]" role="status">
      Cargando…
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    // key={pathname}: remonta el árbol en cada navegación para que dispare de
    // nuevo la animación CSS ".page-transition" (@keyframes page-enter) — sin
    // esto, entre páginas del mismo layout no habría transición visible.
    <div key={location.pathname} className="page-transition">
      <Suspense fallback={<PageFallback />}>
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/olvide-password" element={<ForgotPassword />} />
        <Route path="/restablecer-password" element={<ResetPassword />} />
        <Route path="/cambiar-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
        <Route path="/configuracion-inicial" element={<RequireAuth role="lab"><LabOnboarding /></RequireAuth>} />
        <Route path="/caracteristicas" element={<Features />} />
        <Route path="/precios" element={<Pricing />} />
        <Route path="/actualizaciones" element={<Changelog />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/ayuda" element={<HelpCenterPublic />} />
        <Route path="/estado" element={<SystemStatus />} />

        <Route path="/dashboard" element={<RequireAuth role="lab"><LabDashboard /></RequireAuth>} />
        <Route path="/dashboard/historial" element={<RequireAuth role="lab"><LabHistory /></RequireAuth>} />
        <Route path="/dashboard/whatsapp" element={<RequireAuth role="lab"><WhatsAppConnect /></RequireAuth>} />
        <Route path="/dashboard/tutoriales" element={<RequireAuth role="lab"><LabTutorials /></RequireAuth>} />
        <Route path="/dashboard/obras-sociales" element={<RequireAuth role="lab"><LabObrasSociales /></RequireAuth>} />
        <Route path="/dashboard/mensajes" element={<Navigate to="/dashboard" replace />} />
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
      </Suspense>
    </div>
  )
}
