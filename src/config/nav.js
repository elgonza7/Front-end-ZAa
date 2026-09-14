import {
  LayoutDashboard,
  MessageCircle,
  GitBranch,
  Settings,
  Headset,
  Building2,
  Coins,
  CreditCard,
  LifeBuoy,
  MessagesSquare,
  GraduationCap,
} from 'lucide-react'

export const LAB_NAV_ITEMS = [
  { label: 'Panel', to: '/dashboard', icon: LayoutDashboard },
  { label: 'WhatsApp', to: '/dashboard/whatsapp', icon: MessageCircle },
  { label: 'Tutoriales', to: '/dashboard/tutoriales', icon: GraduationCap },
  { label: 'Mensajes', to: '/dashboard/mensajes', icon: MessagesSquare },
  { label: 'Flujo de conversación', to: '/dashboard/flujo', icon: GitBranch },
  { label: 'Configuración', to: '/dashboard/configuracion', icon: Settings },
  { label: 'Atención humana', to: '/dashboard/conversaciones', icon: Headset, badgeKey: 'handoff' },
  { label: 'Facturación', to: '/dashboard/facturacion', icon: CreditCard },
  { label: 'Centro de Ayuda', to: '/dashboard/ayuda', icon: LifeBuoy },
]

export const ADMIN_NAV_ITEMS = [
  { label: 'Resumen', to: '/admin', icon: LayoutDashboard },
  { label: 'Inquilinos', to: '/admin/inquilinos', icon: Building2 },
  { label: 'Métricas', to: '/admin/metricas', icon: Coins },
  { label: 'Soporte', to: '/admin/soporte', icon: MessagesSquare, badgeKey: 'feedback' },
]
