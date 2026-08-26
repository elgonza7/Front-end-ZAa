// Única fuente de verdad para precios y cupos de tokens. Tocar solo acá para
// cambiar planes — Pricing.jsx, LabBilling.jsx y mockData.js importan de aquí.
//
// setupFeeUSD: habilitación única (se cobra una sola vez, al contratar).
// priceUSD: cuota mensual recurrente (cubre el uso de las dos IA del
// asistente: el motor conversacional y la corrección de texto "Mejorar con IA").
// tokensLimit: cupo de tokens de IA incluido por mes.
export const PLAN_PRICING = {
  Básico: { setupFeeUSD: 70, priceUSD: 35, tokensLimit: 7500 },
  Profesional: { setupFeeUSD: 100, priceUSD: 65, tokensLimit: 15000 },
  Premium: { setupFeeUSD: 125, priceUSD: 90, tokensLimit: 30000 },
}
