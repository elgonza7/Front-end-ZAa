import { useEffect, useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import LandingNavbar from '../components/layout/LandingNavbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import { getSystemStatus } from '../api/contentService.js'

const STATUS_META = {
  OPERATIONAL: { text: 'Operativo', variant: 'success', icon: CheckCircle2 },
  DEGRADED: { text: 'Degradado', variant: 'warning', icon: AlertTriangle },
  DOWN: { text: 'Caído', variant: 'danger', icon: XCircle },
}

export default function SystemStatus() {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    getSystemStatus().then(setStatus)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <LandingNavbar />

      <section className="mx-auto max-w-2xl px-6 pb-24 pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-[var(--text-strong)] sm:text-4xl">Estado del sistema</h1>
          {status && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--muted)]">
              {(() => {
                const meta = STATUS_META[status.overall]
                const Icon = meta.icon
                return (
                  <>
                    <Icon size={16} className={meta.variant === 'success' ? 'text-emerald-400' : 'text-amber-400'} />
                    Todos los sistemas {meta.text.toLowerCase()}
                  </>
                )
              })()}
            </p>
          )}
        </div>

        {status && (
          <Card className="mt-8 divide-y divide-[var(--border)] overflow-hidden">
            {status.components.map((component) => {
              const meta = STATUS_META[component.status]
              return (
                <div key={component.name} className="flex items-center justify-between px-5 py-4">
                  <p className="text-sm text-[var(--text-strong)]">{component.name}</p>
                  <Badge variant={meta.variant}>{meta.text}</Badge>
                </div>
              )
            })}
          </Card>
        )}

        {status && (
          <p className="mt-4 text-center text-xs text-[var(--muted)]">
            Última actualización: {new Date(status.updatedAt).toLocaleString('es-AR')}
          </p>
        )}
      </section>

      <Footer />
    </div>
  )
}
