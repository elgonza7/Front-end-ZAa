export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
