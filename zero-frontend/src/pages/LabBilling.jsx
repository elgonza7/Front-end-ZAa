import { useEffect, useState } from 'react'
import { Copy, Check, ExternalLink, Receipt } from 'lucide-react'
import LabLayout from '../components/layout/LabLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { PLAN_PRICING } from '../lib/mockData.js'
import { getLabBilling, getPlatformBillingDestination, startCheckout } from '../api/billingService.js'

const STATUS_LABEL = {
  PAID: { text: 'Pagado', variant: 'success' },
  OVERDUE: { text: 'Vencido', variant: 'danger' },
  PENDING: { text: 'Pendiente', variant: 'warning' },
}

const BILLING_TYPE_LABEL = {
  PARTICULAR: '1° laboratorio (particular)',
  SEGUNDO_LAB: '2° laboratorio del mismo dueño',
  TERCER_LAB_O_MAS: '3° laboratorio o más del mismo dueño',
}

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // navegador sin permiso de portapapeles — el valor sigue visible para copiar a mano
    }
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] text-[#8b949e]">{label}</p>
        <p className="truncate text-sm text-white">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="ml-3 shrink-0 text-[#8b949e] hover:text-[#F8B500]"
        aria-label={`Copiar ${label}`}
      >
        {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
      </button>
    </div>
  )
}

export default function LabBilling() {
  const [billing, setBilling] = useState(null)
  const [destination, setDestination] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    Promise.all([getLabBilling(), getPlatformBillingDestination()]).then(([billingData, destinationData]) => {
      setBilling(billingData)
      setDestination(destinationData)
    })
  }, [])

  async function handleCheckout() {
    setCheckingOut(true)
    const { checkoutUrl } = await startCheckout()
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
    setCheckingOut(false)
  }

  if (!billing || !destination) {
    return (
      <LabLayout title="Facturación" userLabel="Cargando…">
        <div className="flex h-64 items-center justify-center text-sm text-[#8b949e]">Cargando…</div>
      </LabLayout>
    )
  }

  const status = STATUS_LABEL[billing.status] ?? STATUS_LABEL.PENDING
  const finalAmount = Math.round(billing.basePriceUSD * (1 - billing.discountPct / 100))

  return (
    <LabLayout title="Facturación" subtitle="Tu suscripción a ZeroAutoapp: plan, vencimiento y forma de pago">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm font-semibold text-white">Tu plan</p>
            <p className="mt-2 text-xl font-bold text-white">{billing.plan}</p>
            <p className="mt-1 text-xs text-[#8b949e]">{BILLING_TYPE_LABEL[billing.billingType]}</p>
            {billing.discountPct > 0 && (
              <Badge variant="gold" className="mt-2">
                {billing.discountPct}% de descuento aplicado
              </Badge>
            )}
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-white">Monto a pagar</p>
            <p className="mt-2 text-xl font-bold text-white">
              ${finalAmount}
              <span className="text-sm font-normal text-[#8b949e]"> USD / mes</span>
            </p>
            {billing.discountPct > 0 && (
              <p className="mt-1 text-xs text-[#8b949e] line-through">${billing.basePriceUSD} USD</p>
            )}
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-white">Estado</p>
            <div className="mt-2">
              <Badge variant={status.variant}>{status.text}</Badge>
            </div>
            <p className="mt-2 text-xs text-[#8b949e]">
              Próximo vencimiento: <span className="text-white">{billing.nextDueDate}</span>
            </p>
          </Card>
        </div>

        <Card className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-white">Cuota de habilitación (pago único)</p>
            <p className="text-xs text-[#8b949e]">Activó tu cuenta y tu número de WhatsApp al contratar.</p>
          </div>
          <Badge variant={billing.setupFeeStatus === 'PAID' ? 'success' : 'warning'}>
            {billing.setupFeeStatus === 'PAID' ? `Pagada · ${billing.setupFeePaidAt}` : 'Pendiente'}
          </Badge>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-white">Cómo pagar</h2>
          <p className="mt-1 text-xs text-[#8b949e]">
            Pagá con Mercado Pago (débito automático) o por transferencia a las cuentas de ZeroAutoapp.
          </p>

          <div className="mt-4">
            <Button onClick={handleCheckout} disabled={checkingOut} className="px-4 py-2.5 text-sm">
              <ExternalLink size={16} />
              {checkingOut ? 'Abriendo…' : 'Pagar con Mercado Pago'}
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium text-[#8b949e]">Transferencia en pesos (ARS)</p>
              <div className="space-y-2">
                <CopyField label="Alias" value={destination.ars.alias} />
                <CopyField label="CVU" value={destination.ars.cvu} />
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-[#8b949e]">Transferencia en dólares (USD)</p>
              <div className="space-y-2">
                <CopyField label="Alias" value={destination.usd.alias} />
                <CopyField label="CBU" value={destination.usd.cbu} />
              </div>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[#8b949e]">
            Después de transferir, enviá el comprobante para que acreditemos el pago en tu cuenta.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-white">Planes y precios</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Object.entries(PLAN_PRICING).map(([planName, plan]) => (
              <div
                key={planName}
                className={`rounded-xl border px-4 py-4 ${
                  planName === billing.plan ? 'border-[#F8B500]/40 bg-[#F8B500]/5' : 'border-[#30363d] bg-[#0d1117]'
                }`}
              >
                <p className="text-sm font-semibold text-white">{planName}</p>
                <p className="mt-1 text-lg font-bold text-white">
                  ${plan.priceUSD} <span className="text-xs font-normal text-[#8b949e]">USD/mes</span>
                </p>
                <p className="mt-1 text-xs text-[#8b949e]">{plan.tokensLimit.toLocaleString()} tokens/mes</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 border-t border-[#30363d] pt-4">
            <p className="text-xs font-medium text-[#8b949e]">Descuento por laboratorio adicional del mismo dueño:</p>
            {destination.multiLabDiscount.map((tier) => (
              <p key={tier.tier} className="text-xs text-[#e6e6e6]">
                {tier.tier}: <span className="text-[#F8B500]">{tier.discountPct}% off</span>
              </p>
            ))}
            <p className="pt-1 text-[11px] text-[#8b949e]">
              ¿Tenés más de un laboratorio? Escribinos para que apliquemos el descuento correspondiente.
            </p>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#30363d] px-6 py-4">
            <Receipt size={16} className="text-[#F8B500]" />
            <h2 className="text-sm font-semibold text-white">Historial de pagos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#30363d] text-xs uppercase tracking-wide text-[#8b949e]">
                  <th className="px-6 py-3 font-medium">Período</th>
                  <th className="px-6 py-3 font-medium">Monto</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Fecha de pago</th>
                </tr>
              </thead>
              <tbody>
                {billing.history.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-[#30363d]/60 last:border-0">
                    <td className="px-6 py-3 text-white">{invoice.period}</td>
                    <td className="px-6 py-3 text-[#e6e6e6]">${invoice.amountUSD} USD</td>
                    <td className="px-6 py-3">
                      <Badge variant={STATUS_LABEL[invoice.status]?.variant ?? 'neutral'}>
                        {STATUS_LABEL[invoice.status]?.text ?? invoice.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-[#e6e6e6]">{invoice.paidAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </LabLayout>
  )
}
