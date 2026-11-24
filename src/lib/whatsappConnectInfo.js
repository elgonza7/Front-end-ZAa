// Datos compartidos por la guía de conexión de WhatsApp (ConnectGuide /
// ConnectPanel / WhatsAppConnect). Separados para no romper Fast Refresh.

export const SUPPORT_MAILTO =
  'mailto:zeroautoapp@gmail.com?subject=Ayuda%20para%20conectar%20mi%20WhatsApp&body=Hola%2C%20quiero%20conectar%20el%20n%C3%BAmero%3A%20%5Btu%20n%C3%BAmero%20de%20WhatsApp%20ac%C3%A1%5D%0A%0AEsto%20es%20lo%20que%20pas%C3%B3%3A%20'

export const PREFLIGHT_ITEMS = [
  {
    id: 'business-app',
    title: 'El número está en la app WhatsApp Business (no en el WhatsApp común)',
    help: 'Es la app con una "B" en el ícono. Si tu número está en el WhatsApp común, primero instalá WhatsApp Business en el mismo celular: te ofrece usar el mismo número y pasar los chats.',
  },
  {
    id: 'updated',
    title: 'La app está actualizada',
    help: 'Entrá a Play Store (Android) o App Store (iPhone), buscá "WhatsApp Business" y tocá "Actualizar" si aparece.',
  },
  {
    id: 'in-use',
    title: 'El número ya se usa hace algunos días',
    help: 'Con mensajes reales con pacientes. Un número recién creado y sin uso puede quedar "en revisión" por WhatsApp durante la conexión.',
  },
  {
    id: 'phone-at-hand',
    title: 'Tenés el celular de ese número en la mano',
    help: 'Vas a tener que escanear un código QR desde la app de WhatsApp Business.',
  },
  {
    id: 'facebook',
    title: 'Tenés la cuenta de Facebook del dueño o encargado del laboratorio',
    help: 'Si tu laboratorio ya tiene una cuenta comercial de Meta (la que se usa para publicidad de Facebook o Instagram), conviene usar esa.',
  },
  {
    id: 'time',
    title: 'Tenés unos 15 minutos sin apuro y buena conexión a internet',
    help: 'No cierres la ventana de Facebook a la mitad: algunos pasos tardan un poco.',
  },
]
