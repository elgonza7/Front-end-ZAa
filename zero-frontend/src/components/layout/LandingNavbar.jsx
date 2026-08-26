import { Link } from 'react-router-dom'
import { UserCircle2 } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import Button from '../ui/Button.jsx'

const NAV_LINKS = [
  { label: 'Características', to: '/caracteristicas' },
  { label: 'Planes y Precios', to: '/precios' },
]

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#30363d] bg-[#0d1117]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-[#8b949e] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button as={Link} to="/login" variant="outline" className="!px-3.5">
          <UserCircle2 size={18} />
          Sign In
        </Button>
      </nav>
    </header>
  )
}
