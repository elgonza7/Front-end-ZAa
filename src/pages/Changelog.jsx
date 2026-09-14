import { useEffect, useState } from 'react'
import { Rocket } from 'lucide-react'
import LandingNavbar from '../components/layout/LandingNavbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import { getChangelog } from '../api/contentService.js'

export default function Changelog() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getChangelog().then((data) => {
      setEntries(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <LandingNavbar />

      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center">
        <h1 className="text-3xl font-extrabold text-[var(--text-strong)] sm:text-4xl">Actualizaciones</h1>
        <p className="mt-4 text-base text-[var(--muted)]">
          Todo lo que vamos mejorando en ZeroAutoapp, versión por versión.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        {loading && <p className="text-center text-sm text-[var(--muted)]">Cargando…</p>}

        <div className="space-y-5">
          {entries.map((entry) => (
            <Card key={entry.version} className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)]">
                  <Rocket size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="gold">v{entry.version}</Badge>
                    <span className="text-xs text-[var(--muted)]">{entry.date}</span>
                  </div>
                </div>
              </div>
              <ul className="mt-4 space-y-2 pl-1">
                {entry.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[var(--text)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
