import logo from '../../assets/ZeroAutoapp_Logo.svg'

export default function Logo({ size = 36, withText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src={logo} alt="ZeroAutoapp" style={{ width: size, height: size }} />
      {withText && (
        <span className="text-lg font-bold tracking-tight text-white">
          Zero<span className="text-[#F8B500]">Autoapp</span>
        </span>
      )}
    </div>
  )
}
