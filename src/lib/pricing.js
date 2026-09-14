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
export const PLAN_PRICING = {
  Básico: { setupFeeUSD: 70, priceUSD: 35, tokensLimit: 2_200_000 },
  Profesional: { setupFeeUSD: 100, priceUSD: 65, tokensLimit: 4_100_000 },
  Premium: { setupFeeUSD: 125, priceUSD: 90, tokensLimit: 9_500_000 },
}
