import { ImagePlus, Trash2 } from 'lucide-react'

// Upload control with an adaptive preview frame: whatever aspect ratio the
// source image has (square, tall, ultra-wide banner...), it's letterboxed
// with object-fit: contain inside a fixed-size box so the lab can see how it
// will actually render in the chat bubble, instead of a stretched thumbnail.
export default function ImageDrop({ value, onSelect, onRemove, label, height = 140, uploading = false }) {
  function handleChange(event) {
    const file = event.target.files?.[0]
    if (file) onSelect(file)
    event.target.value = ''
  }

  return (
    <div>
      {label && <p className="mb-1.5 text-xs font-medium text-[#8b949e]">{label}</p>}
      <div
        className="relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#30363d] bg-[#0d1117]"
        style={{ height }}
      >
        {value ? (
          <img src={value} alt={label || 'Imagen adjunta'} className="h-full w-full object-contain" />
        ) : (
          <span className="text-xs text-[#8b949e]">{uploading ? 'Subiendo…' : 'Sin imagen'}</span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#30363d] px-3 py-1.5 text-xs text-[#8b949e] transition-colors hover:border-[#F8B500] hover:text-[#F8B500]">
          <ImagePlus size={14} />
          {value ? 'Cambiar' : 'Subir imagen'}
          <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
        </label>
        {value && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 rounded-lg border border-[#30363d] px-3 py-1.5 text-xs text-[#8b949e] transition-colors hover:border-red-500/40 hover:text-red-400"
          >
            <Trash2 size={14} />
            Quitar
          </button>
        )}
      </div>
    </div>
  )
}
