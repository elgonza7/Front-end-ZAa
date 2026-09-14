// SVG inline (no <img>) para poder recolorear las partes blancas del
// isologo ("Z" y "a") según el tema — en modo claro pasan a negro con el
// mismo trazo, si no, quedarían invisibles sobre fondo claro. Los anillos y
// el degradé dorado son de marca y no cambian con el tema.
export default function Logo({ size = 36, withText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 500 500" width={size} height={size} aria-label="ZeroAutoapp">
        <defs>
          <linearGradient id="zeroautoapp-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCEABB" />
            <stop offset="40%" stopColor="#F8B500" />
            <stop offset="100%" stopColor="#B67B03" />
          </linearGradient>
        </defs>

        <circle cx="250" cy="250" r="235" fill="none" stroke="url(#zeroautoapp-gold)" strokeWidth="6" />
        <circle cx="250" cy="250" r="222" fill="none" stroke="url(#zeroautoapp-gold)" strokeWidth="2" />

        <path d="M 225 120 L 275 120 L 355 340 L 290 340 L 250 215 L 210 340 L 145 340 Z" fill="url(#zeroautoapp-gold)" />

        <path
          d="M 90 165 L 205 165 L 95 340 L 240 340"
          fill="none"
          stroke="var(--logo-mark)"
          strokeWidth="12"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <path d="M 130 280 C 190 230, 240 290, 330 220" fill="none" stroke="url(#zeroautoapp-gold)" strokeWidth="14" strokeLinecap="round" />
        <path d="M 125 300 C 185 250, 245 310, 335 240" fill="none" stroke="url(#zeroautoapp-gold)" strokeWidth="3" strokeLinecap="round" />

        <text
          x="345"
          y="345"
          fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="160"
          fill="var(--logo-mark)"
        >
          a
        </text>
      </svg>
      {withText && (
        <span className="text-lg font-bold tracking-tight text-[var(--text-strong)]">
          Zero<span className="text-[var(--accent)]">Autoapp</span>
        </span>
      )}
    </div>
  )
}
