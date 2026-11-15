import Modal from './Modal.jsx'
import Button from './Button.jsx'

// Reemplazo de window.confirm: mismo estilo que el resto del panel y deja
// explicar qué va a pasar exactamente antes de confirmar.
export default function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  children,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={loading ? () => {} : onCancel} title={title}>
      <div className="text-sm text-[var(--text)]">{children}</div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={loading}>
          {loading ? 'Procesando…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
