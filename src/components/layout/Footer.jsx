import { Link } from 'react-router-dom'
import Logo from '../ui/Logo.jsx'

const SUPPORT_EMAIL = 'zeroautoapp@gmail.com'

const COLUMNS = [
  {
    title: 'Producto / Plataforma',
    links: [
      { label: 'Características', to: '/caracteristicas' },
      { label: 'Planes y Precios', to: '/precios' },
      { label: 'Actualizaciones', to: '/actualizaciones' },
    ],
  },
  {
    title: 'Soporte al Cliente',
    links: [
      { label: 'Centro de Ayuda / Tutoriales', to: '/ayuda' },
      { label: 'Estado del Sistema', to: '/estado' },
      { label: 'Contacto Técnico', href: `mailto:${SUPPORT_EMAIL}` },
    ],
  },
  {
    title: 'Legal y Privacidad',
    links: [
      { label: 'Términos y Condiciones de Uso', to: '/legal#terminos' },
      { label: 'Política de Privacidad', to: '/legal#privacidad' },
      { label: 'Protección de Datos de Pacientes', to: '/legal#datos' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#30363d] bg-[#0d1117]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-[#F8B500]">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a href={link.href} className="text-sm text-[#8b949e] transition-colors hover:text-white">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} className="text-sm text-[#8b949e] transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#30363d] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs text-[#8b949e]">
            "Automatización inteligente y gestión centralizada de WhatsApp para laboratorios
            clínicos. Optimiza la atención de tus pacientes 24/7."
          </p>
          <p className="text-xs text-[#8b949e]">Desarrollado en San Juan, Argentina.</p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 border-t border-[#30363d] pt-6 sm:flex-row sm:justify-between">
          <Logo size={24} />
          <p className="text-xs text-[#8b949e]">
            © {new Date().getFullYear()} ZeroAutoapp. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
