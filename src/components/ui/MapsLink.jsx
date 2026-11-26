import { MapPin } from 'lucide-react'

// Link a Google Maps armado con la dirección escrita (búsqueda pública, sin
// API key). Es el mismo link que la IA le manda al paciente cuando pregunta
// cómo llegar — ver GoogleMapsLink en WhatsAppMessageProcessingService.cs.
function googleMapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`
}

export default function MapsLink({ address }) {
  if (!address?.trim()) {
    return (
      <p className="mt-1.5 text-xs text-[var(--muted)]">
        Con la dirección completa (calle, número y ciudad), el asistente le manda al paciente el link de Google Maps.
      </p>
    )
  }

  return (
    <a
      href={googleMapsUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
    >
      <MapPin size={13} /> Ver en Google Maps (así le llega al paciente)
    </a>
  )
}
