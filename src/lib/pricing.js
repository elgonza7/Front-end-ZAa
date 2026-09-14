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
// Premium: 8.5M en vez de 4.8M por el mismo precio — decisión consciente de
// devolver el margen extra (a costo real, servir a un cliente con el cupo
// lleno sale ~USD 18/mes contra los USD 90 que paga, ~80% de margen) como
// más cupo en vez de bajar el precio.
export const PLAN_PRICING = {
  Básico: { setupFeeUSD: 70, priceUSD: 35, tokensLimit: 1_200_000 },
  Profesional: { setupFeeUSD: 100, priceUSD: 65, tokensLimit: 2_800_000 },
  Premium: { setupFeeUSD: 125, priceUSD: 90, tokensLimit: 8_500_000 },
}
