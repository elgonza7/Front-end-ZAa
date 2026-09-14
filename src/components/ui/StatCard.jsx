import Card from './Card.jsx'

export default function StatCard({ icon: Icon, label, value, hint, accent = false }) {
  return (
    <Card className="p-5 flex items-start gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          accent ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-soft)] text-black' : 'bg-[var(--bg)] text-[var(--accent)] border border-[var(--border)]'
        }`}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{label}</p>
        <p className="mt-1 truncate text-xl font-bold text-[var(--text-strong)]">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-[var(--muted)]">{hint}</p>}
      </div>
    </Card>
  )
}
