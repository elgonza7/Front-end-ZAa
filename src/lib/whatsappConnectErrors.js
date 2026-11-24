// Traduce los errores de la conexión con Meta (Embedded Signup) a algo que
// entienda alguien que no es de sistemas: qué pasó y qué hacer. Los textos
// salen de casos reales que nos pasaron conectando números (nov 2026).
const RULES = [
  {
    match: /cancelaste|cerraste la ventana|no autorizó/i,
    title: 'La ventana de Facebook se cerró antes de terminar',
    steps: [
      'No pasó nada malo: no se conectó ni se cambió nada.',
      'Volvé a tocar "Conectar con Facebook" y seguí los pasos hasta que la ventana se cierre sola.',
      'Si la ventana no aparece, revisá que el navegador no esté bloqueando ventanas emergentes.',
    ],
  },
  {
    match: /a tiempo/i,
    title: 'La conexión tardó demasiado',
    steps: [
      'Puede que la conexión igual se haya completado del lado de Meta.',
      'Recargá esta página: si dice "Conectado", ya está.',
      'Si no, volvé a intentarlo una sola vez, sin pausas largas entre pantalla y pantalla.',
    ],
  },
  {
    match: /2655121|restring|restrict|no se puede compartir|can't be shared|locked|bloquead/i,
    title: 'Meta tiene restringida la cuenta de este número',
    steps: [
      'Es un bloqueo de Meta, no un error tuyo ni de ZeroAutoapp.',
      'No vuelvas a intentar varias veces seguidas: los reintentos pueden alargar el bloqueo.',
      'Entrá a business.facebook.com → Calidad de la cuenta, y si aparece "Solicitar revisión", pedila una sola vez.',
      'Escribinos y te ayudamos con el reclamo a Meta.',
    ],
  },
  {
    match: /ya está conectado a otra cuenta/i,
    title: 'Ese número ya está conectado en otra cuenta de ZeroAutoapp',
    steps: [
      'Un mismo número no puede estar en dos cuentas a la vez.',
      'Si lo conectaste antes con otro usuario, desvinculalo desde esa cuenta primero.',
      'Si no sabés de qué cuenta se trata, escribinos.',
    ],
  },
  {
    match: /SDK de Facebook/i,
    title: 'No se pudo abrir la ventana de Facebook',
    steps: [
      'Revisá tu conexión a internet.',
      'Si usás un bloqueador de publicidad o de rastreo, desactivalo para este sitio.',
      'Probá desde otro navegador (Chrome o Edge funcionan bien).',
    ],
  },
]

export function explainConnectError(message) {
  const rule = RULES.find((candidate) => candidate.match.test(message ?? ''))
  if (rule) return { title: rule.title, steps: rule.steps }
  return {
    title: 'No se pudo completar la conexión',
    steps: [
      'Volvé a intentarlo una sola vez.',
      'Si vuelve a fallar, escribinos contándonos en qué pantalla se cortó (si podés, mandanos una captura).',
    ],
  }
}
