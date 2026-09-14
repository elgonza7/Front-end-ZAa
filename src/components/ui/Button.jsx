const VARIANTS = {
  // Borde sutil (10% de --text-strong: casi invisible en oscuro, marca bien
  // el contorno en claro donde el botón dorado flota sobre fondo blanco) que
  // se nota más al pasar el mouse.
  primary:
    'bg-gradient-to-r from-[var(--accent)] to-[#FCEABB] text-black font-semibold border border-[var(--text-strong)]/10 hover:border-[var(--text-strong)]/25 hover:brightness-105',
  outline:
    'border border-[var(--border)] text-[var(--text-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] bg-transparent',
  ghost: 'text-[var(--muted)] hover:text-[var(--text-strong)] bg-transparent',
  danger: 'bg-red-500/15 text-[var(--text-strong)] border border-red-500/40 hover:bg-red-500/25',
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
