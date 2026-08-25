import { useState } from 'react'
import { CircleHelp } from 'lucide-react'
import Modal from './Modal.jsx'

export default function HelpButton({ title, children, label = 'Tutorial' }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#30363d] px-3 py-1.5 text-xs font-medium text-[#e3c065] transition-colors hover:border-[#F8B500] hover:text-[#F8B500]"
      >
        <CircleHelp size={14} />
        {label}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1 text-sm text-[#e6e6e6]">
          {children}
        </div>
      </Modal>
    </>
  )
}
