export default function ProgressBar({ value, max, className = '' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const isHigh = pct >= 90

  return (
    <div className={className}>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg)] border border-[var(--border)]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isHigh ? 'bg-red-500' : 'bg-gradient-to-r from-[var(--accent)] to-[#FCEABB]'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
