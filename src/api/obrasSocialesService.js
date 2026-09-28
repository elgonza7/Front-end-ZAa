import { apiFetch } from './client.js'

// GET /api/lab/obras-sociales -> catálogo completo + cuáles acepta este laboratorio
export async function getObrasSociales() {
  return apiFetch('/lab/obras-sociales')
}

// PUT /api/lab/obras-sociales { obraSocialIds: string[] } -> reemplaza el conjunto aceptado
export async function updateObrasSociales(obraSocialIds) {
  return apiFetch('/lab/obras-sociales', {
    method: 'PUT',
    body: JSON.stringify({ obraSocialIds }),
  })
}

// PUT /api/lab/obras-sociales/{id}/texto { requisitosRegistro, requisitosEstudio, notas }
// -> texto propio de este laboratorio para esa obra social, en vez del genérico del catálogo
export async function updateObraSocialTexto(obraSocialId, texto) {
  return apiFetch(`/lab/obras-sociales/${obraSocialId}/texto`, {
    method: 'PUT',
    body: JSON.stringify(texto),
  })
}

// DELETE /api/lab/obras-sociales/{id}/texto -> vuelve a usar el texto del catálogo
export async function resetObraSocialTexto(obraSocialId) {
  return apiFetch(`/lab/obras-sociales/${obraSocialId}/texto`, { method: 'DELETE' })
}
