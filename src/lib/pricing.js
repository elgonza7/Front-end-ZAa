// Única fuente de verdad para precios y cupos de tokens. Tocar solo acá para
// cambiar planes — Pricing.jsx, LabBilling.jsx y mockData.js importan de aquí.
//
// setupFeeUSD: habilitación única (se cobra una sola vez, al contratar).
// priceUSD: cuota mensual recurrente (cubre el uso de las dos IA del
// asistente: el motor conversacional y la corrección de texto "Mejorar con IA").
// tokensLimit: cupo de tokens de IA incluido por mes.
// tokensLimit recalculado en base al consumo real del backend: cada
// respuesta del bot reenvía el prompt de sistema + últimos 12 mensajes de
// historial (ver WhatsAppMessageProcessingService), ~1.500 tokens por
// turno en promedio, y una conversación completa promedia ~5 turnos
// (~7.500 tokens/conversación). Con precio de Gemini 3.6 Flash (~$2.10 por
// millón de tokens, tarifa post-2027) el costo real por conversación es de
// ~1,6 centavos de dólar — el margen sigue siendo amplio con estos cupos.
// Cupos ajustados con la calculadora de rentabilidad (margen ~75-85% sobre
// el costo real de Gemini, cupo lleno, antes de infraestructura) —
// devolvemos el margen extra como más cupo en vez de bajar precios.
//
// Nov 2026: el dueño pidió presentar los planes por interacciones POR DÍA
// (~400 / 800 / 1.600) y sacar el cobro de excedente. Cupo mensual = por día
// × 30 × AVG_TOKENS_PER_INTERACTION_ESTIMATE. Mismos números en
// Zero/src/Zero.Infrastructure/Data/DbSeeder.cs (la fuente real del backend).
export const PLAN_PRICING = {
  Básico: { setupFeeUSD: 25, priceUSD: 35, tokensLimit: 60_000_000 },
  Profesional: { setupFeeUSD: 35, priceUSD: 65, tokensLimit: 120_000_000 },
  Premium: { setupFeeUSD: 45, priceUSD: 90, tokensLimit: 240_000_000 },
}

// Cuánto gasta en promedio UNA interacción (un mensaje de respuesta del
// asistente a un paciente) — un token no le dice nada a un dueño de
// laboratorio, así que en la UI pública se muestra "≈ N interacciones" como
// número principal y el total de tokens como aclaración entre paréntesis.
// Es una estimación general para marketing; dentro del panel de un
// laboratorio ya conectado se usa su propio promedio real
// (profile.averageTokensPerInteraction) en vez de este número fijo.
export const AVG_TOKENS_PER_INTERACTION_ESTIMATE = 5000

// Un paciente promedio intercambia unos 4 mensajes con el asistente.
export const INTERACTIONS_PER_PATIENT_ESTIMATE = 4

export function interactionsPerDay(tokensLimit, tokensPerInteraction = AVG_TOKENS_PER_INTERACTION_ESTIMATE) {
  return Math.round(tokensLimit / tokensPerInteraction / 30)
}

export function patientsPerDay(tokensLimit, tokensPerInteraction = AVG_TOKENS_PER_INTERACTION_ESTIMATE) {
  return Math.round(interactionsPerDay(tokensLimit, tokensPerInteraction) / INTERACTIONS_PER_PATIENT_ESTIMATE)
}
