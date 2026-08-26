import { mockDelay } from './client.js'

const USE_MOCKS = true // flip to false once POST /api/lab/ai/improve-message exists

// POST /api/lab/ai/improve-message { text } -> { text }
// Backend implementation (per el doc de arquitectura): inyecta el texto en un
// prompt de sistema pidiendo a OpenAI corregir ortografía, prolijar el tono y
// mantener el significado. Acá solo simulamos ese resultado.
export async function improveMessage(text) {
  const trimmed = text.trim().replace(/\s+/g, ' ')
  if (!trimmed) return mockDelay({ text: trimmed })

  if (!USE_MOCKS) {
    const { apiFetch } = await import('./client.js')
    return apiFetch('/lab/ai/improve-message', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
  }

  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
  const withPunctuation = /[.!?¡¿]$/.test(capitalized) ? capitalized : `${capitalized}.`
  return mockDelay({ text: withPunctuation }, 700)
}
