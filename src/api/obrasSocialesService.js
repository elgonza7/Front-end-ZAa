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
