const VARIANTS = {
  primary:
    'bg-gradient-to-r from-[var(--accent)] to-[#FCEABB] text-black font-semibold hover:brightness-105',
  outline:
    'border border-[var(--border)] text-[var(--text-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] bg-transparent',
  ghost: 'text-[var(--muted)] hover:text-[var(--text-strong)] bg-transparent',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  as: Component = 'button',
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
