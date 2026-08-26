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
    <div className="min-h-screen bg-[#0d1117]">
      <LandingNavbar />

      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Actualizaciones</h1>
        <p className="mt-4 text-base text-[#8b949e]">
          Todo lo que vamos mejorando en ZeroAutoapp, versión por versión.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        {loading && <p className="text-center text-sm text-[#8b949e]">Cargando…</p>}

        <div className="space-y-5">
          {entries.map((entry) => (
            <Card key={entry.version} className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#30363d] bg-[#0d1117] text-[#F8B500]">
                  <Rocket size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="gold">v{entry.version}</Badge>
                    <span className="text-xs text-[#8b949e]">{entry.date}</span>
                  </div>
                </div>
              </div>
              <ul className="mt-4 space-y-2 pl-1">
                {entry.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#e6e6e6]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F8B500]" />
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
