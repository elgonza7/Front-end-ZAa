const VARIANTS = {
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  danger: 'bg-red-500/15 text-red-400 border-red-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  gold: 'bg-[#F8B500]/15 text-[#F8B500] border-[#F8B500]/30',
  neutral: 'bg-[#30363d]/40 text-[#8b949e] border-[#30363d]',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
