export default function Switch({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border transition-colors duration-200 ${
        checked
          ? 'border-[var(--accent)] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)]'
          : 'border-[var(--border)] bg-[var(--bg)]'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
