export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-2xl border border-[#30363d] bg-[#161b22] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
