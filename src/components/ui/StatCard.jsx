import Card from './Card.jsx'

export default function StatCard({ icon: Icon, label, value, hint, accent = false }) {
  return (
    <Card className="p-5 flex items-start gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          accent ? 'bg-gradient-to-br from-[#F8B500] to-[#e3c065] text-black' : 'bg-[#0d1117] text-[#F8B500] border border-[#30363d]'
        }`}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-[#8b949e]">{label}</p>
        <p className="mt-1 truncate text-xl font-bold text-white">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-[#8b949e]">{hint}</p>}
      </div>
    </Card>
  )
}
