// Compartido entre LabSettings.jsx y LabOnboarding.jsx: cómo el bot le
// explica al paciente que va a recibir el resultado de su estudio.
export const DELIVERY_METHODS = [
  { value: 'PORTAL', label: 'Portal web (el paciente ingresa con DNI y contraseña)' },
  { value: 'PDF', label: 'PDF por WhatsApp (el laboratorio lo envía manualmente)' },
  { value: 'MANUAL', label: 'Manual (sin sistema — se avisa que el equipo lo enviará)' },
]
