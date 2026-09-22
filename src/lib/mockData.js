// Centralized fake data so every page renders fully without a live backend.
// Shapes here are meant to mirror the real API payloads described in
// Arquitectura_SaaS_WhatsApp_IA.pdf, so swapping mocks for fetch calls later
// shouldn't require changing component props.
import { PLAN_PRICING } from './pricing.js'

export const mockLabProfile = {
  id: 'lab_ameghino',
  name: 'Laboratorio Ameghino',
  ownerName: 'Miguel Ángel Gómez Flores',
  businessName: 'Laboratorio Ameghino',
  logoUrl: null,
  bannerUrl: null,
  botActive: true,
  welcomeMessage:
    '¡Hola! Soy el asistente virtual de Laboratorio Ameghino. Puedo ayudarte con horarios de atención, requisitos de ayuno y turnos. ¿En qué puedo ayudarte hoy?',
  paymentStatus: 'PAID',
  nextDueDate: '2026-09-15',
  tokensUsed: 980000,
  tokensLimit: 2200000,
  overagePricePer1kTokensUSD: 0.05,
  averageTokensPerInteraction: 4300,
  clientsAttended: 1235,
  // Toggles that reshape the conversation flow — not every lab offers turnos,
  // and result delivery varies a lot from cliente a cliente (ver ASISTENTE VIRTUAL.pdf).
  handlesAppointments: true,
  handlesHumanHandoff: true,
  handoffNotifyEmail: true,
  handoffNotifyEmailAddress: 'contacto@laboratorioameghino.com.ar',
  resultsDeliveryMethod: 'PORTAL', // 'PORTAL' | 'PDF' | 'MANUAL'
  resultsPortalUrl: 'https://ameghino.labim.app',
  address: 'Av. Libertador Gral. San Martín 1456, J5400 ASO, San Juan, Argentina',
  contactPhone: '+54 9 264 524 2909',
}

export const mockKnowledgeDocs = [
  { id: 1, name: 'Cartilla_Obras_Sociales_2026.pdf', size: '1.4 MB', uploadedAt: '2026-08-02' },
  { id: 2, name: 'Requisitos_Ayuno.pdf', size: '320 KB', uploadedAt: '2026-07-18' },
  { id: 3, name: 'Horarios_Sucursales.pdf', size: '210 KB', uploadedAt: '2026-06-30' },
]

export const mockTokenUsageHistory = [
  { day: 'Lun', tokens: 32000 },
  { day: 'Mar', tokens: 41000 },
  { day: 'Mié', tokens: 26000 },
  { day: 'Jue', tokens: 47000 },
  { day: 'Vie', tokens: 59000 },
  { day: 'Sáb', tokens: 22000 },
  { day: 'Dom', tokens: 14000 },
]

export const mockFaqRanking = [
  { question: 'Obras Sociales aceptadas', count: 342 },
  { question: 'Ayuno requerido para análisis', count: 268 },
  { question: 'Horarios de atención', count: 201 },
  { question: 'Resultados en línea', count: 154 },
  { question: 'Dirección de sucursales', count: 97 },
]

export const mockAdminLabs = [
  {
    id: 'lab_ameghino',
    name: 'Laboratorio Ameghino',
    botActive: true,
    lastPayment: '2026-08-15',
    status: 'PAID',
    tokensConsumed: 4580,
  },
  {
    id: 'lab_sanmartin',
    name: 'Laboratorio San Martín',
    botActive: true,
    lastPayment: '2026-08-10',
    status: 'PAID',
    tokensConsumed: 7920,
  },
  {
    id: 'lab_belgrano',
    name: 'Laboratorio Belgrano',
    botActive: false,
    lastPayment: '2026-06-22',
    status: 'OVERDUE',
    tokensConsumed: 1200,
  },
  {
    id: 'lab_delnorte',
    name: 'Laboratorio Del Norte',
    botActive: true,
    lastPayment: '2026-08-01',
    status: 'PAID',
    tokensConsumed: 3110,
  },
  {
    id: 'lab_centralsjuan',
    name: 'Laboratorio Central San Juan',
    botActive: false,
    lastPayment: '2026-07-02',
    status: 'PENDING',
    tokensConsumed: 540,
  },
]

export const mockGlobalMetrics = {
  totalLabs: mockAdminLabs.length,
  activeLabs: mockAdminLabs.filter((lab) => lab.botActive).length,
  totalTokensConsumed: mockAdminLabs.reduce((sum, lab) => sum + lab.tokensConsumed, 0),
  monthlyRevenueUSD: 1240,
}

// --- Métricas globales (serie histórica para AdminMetrics) ---
export const mockPlatformTokenHistory = [
  { month: 'Marzo', tokens: 5200 },
  { month: 'Abril', tokens: 1600 },
  { month: 'Mayo', tokens: 4300 },
  { month: 'Junio', tokens: 6900 },
  { month: 'Julio', tokens: 8700 },
  { month: 'Agosto', tokens: 5600 },
  { month: 'Septiembre', tokens: 4900 },
  { month: 'Octubre', tokens: 9500 },
]

export const mockPlatformResponseCount = 5200

export const mockRevenueHistory = [
  { month: 'Marzo', revenue: 860 },
  { month: 'Abril', revenue: 910 },
  { month: 'Mayo', revenue: 980 },
  { month: 'Junio', revenue: 1050 },
  { month: 'Julio', revenue: 1120 },
  { month: 'Agosto', revenue: 1180 },
  { month: 'Septiembre', revenue: 1205 },
  { month: 'Octubre', revenue: 1240 },
]

export const mockPlanDistribution = [
  { plan: 'Básico', count: 2 },
  { plan: 'Profesional', count: 2 },
  { plan: 'Premium', count: 1 },
]

// --- Inquilinos (vista administrativa extendida) ---
// usageHistory: tokens consumidos por mes (últimos 6 meses) — permite mostrar
// tendencia (creciendo / estable / en baja) en el panel de administración.
export const mockAdminTenants = [
  {
    ...mockAdminLabs[0],
    email: 'contacto@laboratorioameghino.com.ar',
    phone: '+54 9 264 524 2909',
    plan: 'Profesional',
    createdAt: '2025-11-04',
    lastActivityAt: '2026-08-25T08:10:00',
    usageHistory: [
      { month: 'Mayo', tokens: 3200 },
      { month: 'Junio', tokens: 3550 },
      { month: 'Julio', tokens: 3800 },
      { month: 'Agosto', tokens: 4100 },
      { month: 'Septiembre', tokens: 4350 },
      { month: 'Octubre', tokens: 4580 },
    ],
  },
  {
    ...mockAdminLabs[1],
    email: 'admin@labsanmartin.com.ar',
    phone: '+54 9 264 555 1122',
    plan: 'Premium',
    createdAt: '2025-09-18',
    lastActivityAt: '2026-08-25T09:40:00',
    usageHistory: [
      { month: 'Mayo', tokens: 4200 },
      { month: 'Junio', tokens: 4900 },
      { month: 'Julio', tokens: 5600 },
      { month: 'Agosto', tokens: 6400 },
      { month: 'Septiembre', tokens: 7100 },
      { month: 'Octubre', tokens: 7920 },
    ],
  },
  {
    ...mockAdminLabs[2],
    email: 'contacto@labbelgrano.com.ar',
    phone: '+54 9 264 555 3344',
    plan: 'Básico',
    createdAt: '2026-01-22',
    lastActivityAt: '2026-08-10T11:20:00',
    // Reportó una transferencia desde su panel de Facturación — visible para
    // el admin sin depender de que alguien vea un aviso por WhatsApp/mail.
    pendingTransfer: { reference: 'OP-88213456', reportedAt: '2026-08-25T16:40:00' },
    usageHistory: [
      { month: 'Mayo', tokens: 3100 },
      { month: 'Junio', tokens: 2700 },
      { month: 'Julio', tokens: 2200 },
      { month: 'Agosto', tokens: 1800 },
      { month: 'Septiembre', tokens: 1400 },
      { month: 'Octubre', tokens: 1200 },
    ],
  },
  {
    ...mockAdminLabs[3],
    email: 'info@labdelnorte.com.ar',
    phone: '+54 9 264 555 5566',
    plan: 'Profesional',
    createdAt: '2025-12-10',
    lastActivityAt: '2026-08-24T16:05:00',
    usageHistory: [
      { month: 'Mayo', tokens: 3000 },
      { month: 'Junio', tokens: 2950 },
      { month: 'Julio', tokens: 3080 },
      { month: 'Agosto', tokens: 3020 },
      { month: 'Septiembre', tokens: 3150 },
      { month: 'Octubre', tokens: 3110 },
    ],
  },
  {
    ...mockAdminLabs[4],
    email: 'central@labsanjuan.com.ar',
    phone: '+54 9 264 555 7788',
    plan: 'Básico',
    createdAt: '2026-03-02',
    lastActivityAt: '2026-07-28T10:00:00',
    usageHistory: [
      { month: 'Mayo', tokens: 1800 },
      { month: 'Junio', tokens: 1500 },
      { month: 'Julio', tokens: 1100 },
      { month: 'Agosto', tokens: 900 },
      { month: 'Septiembre', tokens: 700 },
      { month: 'Octubre', tokens: 540 },
    ],
  },
]

// --- Conexión de WhatsApp (Meta Cloud API) ---
export const mockWhatsappConnection = {
  connected: true,
  displayPhoneNumber: '+54 9 264 524 2909',
  verifiedName: 'Laboratorio Ameghino',
  phoneNumberId: '109876543210987',
  wabaId: '123456789012345',
  webhookVerifyToken: 'zero-webhook-verify-8842',
  qualityRating: 'GREEN',
  lastSyncedAt: '2026-08-25T09:12:00',
}

// --- Árbol de conversación (seed basado en ASISTENTE VIRTUAL.pdf) ---
// Cada nodo: { id, text, image, options: [{ id, label, isHandoff?, node }] }
// A propósito viene bien completo: la idea es que el laboratorio solo revise,
// edite lo que le falte adaptar y borre las ramas que no apliquen a su
// operación — no que arme el árbol desde cero.
function leaf(id, text) {
  return { id, text, image: null, options: [] }
}

export const mockFlowTree = {
  id: 'root',
  text: '¡Hola! Soy el asistente virtual de Laboratorio Ameghino 🧪 ¿En qué puedo ayudarte hoy?',
  image: null,
  options: [
    {
      id: 'opt_turno',
      label: '📅 Sacar turno',
      node: {
        id: 'node_turno',
        text: 'Contanos qué estudio necesitás y te confirmamos el mejor horario disponible. ¿Preferís la mañana o la tarde?',
        image: null,
        options: [
          {
            id: 'opt_turno_manana',
            label: '🌅 Turno mañana',
            node: leaf(
              'node_turno_manana',
              'Nuestro horario de extracción por la mañana es de Lunes a Viernes de 7:30 a 10:00 hs y Sábados de 8:30 a 10:00 hs.',
            ),
          },
          {
            id: 'opt_turno_tarde',
            label: '🌙 Turno tarde',
            node: leaf(
              'node_turno_tarde',
              'La atención general también incluye horario de tarde de 17:30 a 19:00 hs (Lunes a Viernes) — las extracciones de sangre solo se realizan por la mañana.',
            ),
          },
        ],
      },
    },
    {
      id: 'opt_horarios',
      label: '🕐 Horarios de atención',
      node: {
        id: 'node_horarios',
        text: 'Atención general: Miércoles a Lunes 07:30 - 12:00 hs (y 17:30 - 19:00 hs de Lunes a Viernes) · Sábados 08:30 - 10:00 hs · Domingo cerrado. Si un fin de semana largo cae sábado, permanecemos cerrados.',
        image: null,
        options: [
          {
            id: 'opt_horarios_extraccion',
            label: 'Horarios de extracción de sangre',
            node: leaf(
              'node_horarios_extraccion',
              'Las extracciones se realizan de Lunes a Viernes de 7:30 a 10:00 hs y Sábados de 8:30 a 10:00 hs.',
            ),
          },
        ],
      },
    },
    {
      id: 'opt_resultados',
      label: '📄 Ver resultados',
      node: {
        id: 'node_resultados',
        text: 'Podés ver tus resultados ingresando a https://ameghino.labim.app con tu DNI y la contraseña que te enviamos el día de la extracción.',
        image: null,
        options: [
          {
            id: 'opt_resultados_estado',
            label: '¿Cómo entiendo si ya está completo?',
            node: leaf(
              'node_resultados_estado',
              'Si el PDF indica "1 o 2" o figuran estudios "pendientes", tu análisis todavía está en proceso. Cuando ya no queda ningún pendiente, el estudio está completo — igual podés ver los que ya estén listos mientras tanto.',
            ),
          },
          {
            id: 'opt_resultados_pdf_mail',
            label: 'Quiero que me lo envíen por PDF o mail',
            node: leaf(
              'node_resultados_pdf_mail',
              'Podemos enviarte los resultados por PDF o mail, aunque puede demorar un poco más que consultarlos en el sistema web. Pasanos tu DNI y el correo al que te lo enviamos.',
            ),
          },
          {
            id: 'opt_resultados_hematologia',
            label: 'Resultados de Hematología',
            node: leaf(
              'node_resultados_hematologia',
              'Los resultados de Hematología no los entrega el laboratorio, ya que nuestro servicio es solo de extracción — te los brinda tu médica/o en la consulta. Nosotros solo informamos los estudios de análisis clínicos.',
            ),
          },
        ],
      },
    },
    {
      id: 'opt_obras_sociales',
      label: '🏥 Obras Sociales',
      node: {
        id: 'node_obras_sociales',
        text: 'Escribinos el nombre de tu obra social y te contamos cómo autorizamos tus estudios.',
        image: null,
        options: [
          {
            id: 'opt_os_provincia',
            label: 'Obra Social Provincia',
            node: leaf(
              'node_os_provincia',
              'Para cadenas libres livianas debés ir a la obra social luego de la extracción para que autoricen el estudio. Si tenés pedido para control de anemia, enviá foto del último hemograma; si es para Vitamina D, enviá foto de la última densitometría ósea.',
            ),
          },
          {
            id: 'opt_os_osde',
            label: 'OSDE',
            node: leaf(
              'node_os_osde',
              'Para OSDE podés compartirnos tu credencial digital o el token de autorización junto con el DNI del titular (podés usar el DNI 12.345.678 si preferís no compartir el propio).',
            ),
          },
          {
            id: 'opt_os_pami',
            label: 'PAMI',
            node: leaf(
              'node_os_pami',
              'Para autorizar tus análisis necesitamos que traigas DNI, Carnet de PAMI y una orden médica válida: Orden Médica Electrónica (OME) de tu médico de cabecera, receta en papel de médico especialista con sello y especialidad bien claros, o receta con membrete del Sanatorio Santa Clara o de la Asociación de Médicos de Cabecera (AMC). Importante: si la receta es de un médico clínico, solo la puede emitir tu médico de cabecera — PAMI no acepta órdenes de otro médico clínico particular. Revisá que tenga nombre, N° de afiliado, fecha de emisión clara y firma/sello original.',
            ),
          },
          {
            id: 'opt_os_damsu',
            label: 'DAMSU',
            node: leaf(
              'node_os_damsu',
              'DAMSU exige receta en papel físico (no acepta receta electrónica) con fecha de emisión, diagnóstico y firma/aclaración del afiliado. La Vitamina D (código 9913) no está incluida en la autorización automática: si querés hacértela, se abona de forma particular en el laboratorio. Para prácticas con código inhabilitado, te cobramos y te damos factura para que gestiones el reintegro.',
            ),
          },
          {
            id: 'opt_os_udap_colmed',
            label: 'UDAP y COLMED',
            node: leaf(
              'node_os_udap_colmed',
              'El convenio con UDAP y COLMED está fuera de servicio por el momento. Te hacemos la factura correspondiente para que puedas pedir el reintegro directamente con tu obra social.',
            ),
          },
          {
            id: 'opt_os_acto_bioquimico',
            label: 'Acto bioquímico (OSDEPYM / VEM-Galeno)',
            node: leaf(
              'node_os_acto_bioquimico',
              'Algunas obras sociales, como OSDEPYM y VEM (por ejemplo Galeno), requieren que se abone el acto bioquímico de forma particular al momento de la atención.',
            ),
          },
          {
            id: 'opt_os_token',
            label: 'Enviar token de mi obra social',
            node: leaf(
              'node_os_token',
              'Si tu obra social no tiene fecha de vencimiento para el token, mandanoslo igual así lo dejamos cargado en el sistema para ir autorizando tus órdenes.',
            ),
          },
        ],
      },
    },
    {
      id: 'opt_estudios',
      label: '🧪 Indicaciones para tu estudio',
      node: {
        id: 'node_estudios',
        text: 'Contanos qué estudio te vas a realizar y te paso la preparación exacta que necesitás seguir.',
        image: null,
        options: [
          {
            id: 'opt_estudio_ayuno',
            label: 'Ayuno general',
            node: leaf(
              'node_estudio_ayuno',
              'Ayuno de 8 horas para análisis de rutina (hemograma, glucemia, uremia); 12 horas si incluye perfil lipídico. Podés tomar agua en cantidad normal. Evitá fumar, mascar chicle, caramelos, café, té o mate durante el ayuno. Evitá ejercicio intenso las 24-48 hs previas. Tomá tu medicación habitual salvo indicación médica contraria, y avisale al bioquímico qué tomás — si te miden T4 o TSH, extraete sangre antes de tomar la pastilla del día.',
            ),
          },
          {
            id: 'opt_estudio_parasitologico',
            label: 'Parasitológico Seriado',
            node: leaf(
              'node_estudio_parasitologico',
              'Comprá en la farmacia un frasco con FORMOL al 5% (es tóxico, tomá recaudos). Si te hiciste una radiografía con líquido de contraste, esperá 3 días antes de empezar. Durante 6 días consecutivos, recolectá una cucharadita de materia fecal de cada deposición (máximo hasta la mitad del formol); si no evacuás todos los días, juntá al menos 4 muestras de días distintos. Conservá en la heladera desde la primera muestra y entregá bien cerrado, rotulado con nombre y DNI.',
            ),
          },
          {
            id: 'opt_estudio_graham',
            label: 'Test de Graham (escobillado anal)',
            node: leaf(
              'node_estudio_graham',
              'Comprá frasco estéril, gasas y solución fisiológica. La noche anterior no apliques talcos ni cremas en la zona. Durante 4 días seguidos, apenas te despiertes y antes de higienizarte, limpiá los pliegues anales con una gasa embebida en solución fisiológica y guardala en el frasco (una gasa distinta cada día). Entregá el frasco bien cerrado, rotulado con nombre y DNI.',
            ),
          },
          {
            id: 'opt_estudio_micologico',
            label: 'Micológico (hongos)',
            node: leaf(
              'node_estudio_micologico',
              'Suspendé tratamientos con óvulos, cremas, gotas o sprays antimicóticos al menos 10 días antes (pastillas orales, 3 semanas antes, con tu médico). Si es en uñas: no te las cortes ni uses esmalte 7 días antes; los últimos 3 días cepillalas con jabón blanco y hacé baños con agua tibia y sal; el día del estudio vení con medias y calzado cerrado. Si es en piel o cuero cabelludo: no uses cremas, talcos ni perfumes 48 hs antes, higienizá solo con agua y jabón blanco, y no requiere ayuno.',
            ),
          },
          {
            id: 'opt_estudio_urocultivo',
            label: 'Urocultivo',
            node: leaf(
              'node_estudio_urocultivo',
              'No tomes antibióticos salvo indicación médica. Comprá un frasco estéril y no lo abras hasta usarlo. Se hace con la primera orina de la mañana (o retención de al menos 4 hs). Lavate las manos, higienizá la zona íntima con agua y jabón neutro, y sin tocar el interior del frasco, descartá el primer chorro, recolectá el chorro medio hasta la mitad y cerrá el frasco con fuerza. Entregalo dentro de las 2 horas de haberlo juntado.',
            ),
          },
          {
            id: 'opt_estudio_orina_completa',
            label: 'Orina completa',
            node: leaf(
              'node_estudio_orina_completa',
              'Comprá un frasco limpio (no hace falta que sea estéril) y usá la primera orina de la mañana, bien concentrada. Lavate las manos e higienizá la zona genital con agua y jabón. Descartá el primer chorro, recolectá el chorro medio (al menos hasta la mitad del frasco) y cerralo con fuerza inmediatamente. Llevalo al laboratorio lo antes posible por la mañana.',
            ),
          },
          {
            id: 'opt_estudio_orina_24hs',
            label: 'Orina de 24 hs',
            node: leaf(
              'node_estudio_orina_24hs',
              'Usá un bidón o botellas de agua mineral bien limpias y secas (nunca de gaseosa, jugo o alcohol). Ejemplo si llevás la muestra el lunes 8:00 am: el domingo a las 8:00 am descartá la primera orina (esa es tu hora de inicio) y a partir de ahí juntá TODAS las orinas del día y la noche; el lunes a las 8:00 am hacé la última orina dentro del bidón. Guardalo en la heladera (no en el congelador) durante todo el proceso. Si te olvidás de guardar una sola orina, hay que empezar de nuevo al día siguiente. Entregalo rotulado con nombre, apellido y DNI.',
            ),
          },
          {
            id: 'opt_estudio_sangre_oculta',
            label: 'Sangre oculta en materia fecal (Dieta Blanca)',
            node: leaf(
              'node_estudio_sangre_oculta',
              'Durante los 3 días previos hacé Dieta Blanca: evitá carnes rojas, pollo, verduras de hoja, remolacha, tomate, zanahoria y frutas con cáscara o de color. Podés comer pescado blanco, arroz, fideos, papas, huevo cocido, lácteos y pan blanco. No te cepilles los dientes en ese período (reemplazá por enjuague bucal) y no tomes aspirinas, diuréticos ni suplementos de hierro o vitamina C. El día 4, evacuá en una palangana limpia sin que toque agua ni orina, tomá una cucharadita con la cucharita del frasco estéril y entregalo de inmediato (o en la heladera si vas a demorar). Este estudio paga diferencia por ser más complejo.',
            ),
          },
          {
            id: 'opt_estudio_curva',
            label: 'Curva de azúcar (P75)',
            node: leaf(
              'node_estudio_curva',
              'Ayuno absoluto de 8 hs (solo agua mineral). Vení entre 7:30 y 8:00 hs como máximo, en lo posible acompañado/a. Se te harán 2 extracciones: una al llegar en ayunas, luego tomás un líquido con glucosa en 5 minutos, y 2 horas después la segunda extracción. Durante esas 2 horas está prohibido caminar o salir del laboratorio, fumar, comer o tomar algo que no sea un sorbo de agua. Te recomendamos traer un libro o algo para entretenerte durante la espera.',
            ),
          },
          {
            id: 'opt_estudio_psa',
            label: 'PSA (antígeno prostático)',
            node: leaf(
              'node_estudio_psa',
              'Ayuno de 8 hs (podés tomar agua mineral moderada) y cena liviana sin alcohol la noche anterior. Durante las 48 hs previas evitá relaciones sexuales o masturbación, andar en bicicleta/moto/caballo y actividad física intensa. Si te hiciste tacto rectal o ecografía transrectal, esperá 7 días; si fue biopsia de próstata, esperá de 2 a 3 semanas.',
            ),
          },
          {
            id: 'opt_estudio_prolactina',
            label: 'Prolactina',
            node: leaf(
              'node_estudio_prolactina',
              'Ayuno de 8 hs. Regla de las 2 horas: tenés que estar despierto/a al menos 2 hs antes de la extracción (ej: si te sacás sangre a las 8 am, levantate a las 6 am, ni antes ni después). Durante las 48 hs previas evitá relaciones sexuales, actividad física intensa y estimulación mamaria (corpiños ajustados, cremas, masajes, agua muy caliente). El día del estudio evitá el estrés y quedate 10-15 minutos en reposo en la sala de espera antes de la extracción. Mujeres: salvo indicación médica, extraerse entre el día 3 y 5 del ciclo menstrual. Avisá si tomás antidepresivos, ansiolíticos, protectores gástricos o anticonceptivos.',
            ),
          },
          {
            id: 'opt_estudio_hisopados',
            label: 'Hisopados',
            node: {
              id: 'node_estudio_hisopados',
              text: 'Contanos qué tipo de hisopado necesitás:',
              image: null,
              options: [
                {
                  id: 'opt_hisopado_general',
                  label: 'Inguinal, axilar o nasal',
                  node: leaf(
                    'node_hisopado_general',
                    'Para estos hisopados solo tenés que venir bañado/a; no requieren ayuno ni preparación especial.',
                  ),
                },
                {
                  id: 'opt_hisopado_ana_vaginal',
                  label: 'ANA y vaginal',
                  node: leaf(
                    'node_hisopado_ana_vaginal',
                    'Este estudio demora aproximadamente una semana. Tenés que venir al laboratorio a retirar el material, y la toma de muestra la debe realizar tu médico/a.',
                  ),
                },
                {
                  id: 'opt_hisopado_its',
                  label: 'Mycoplasma / Ureaplasma / Chlamydia',
                  node: leaf(
                    'node_hisopado_its',
                    'Tenés que pasar por el laboratorio a buscar el material para la muestra: la extracción la realiza tu ginecólogo/a, quien luego trae la muestra al laboratorio en nuestro horario de atención. Te recomendamos consultar con el profesional del laboratorio para que te explique cómo se realiza el estudio.',
                  ),
                },
              ],
            },
          },
        ],
      },
    },
    {
      id: 'opt_pagos',
      label: '💳 Pagos y facturación',
      node: {
        id: 'node_pagos',
        text: '¿En qué te podemos ayudar con tu pago?',
        image: null,
        options: [
          {
            id: 'opt_pago_alias',
            label: 'Cómo pagar (alias / transferencia)',
            node: leaf(
              'node_pago_alias',
              'Podés abonar por Mercado Pago o transferencia. Alias: laboratorioameghino · Titular: Miguel Ángel Gómez Flores · CUIT: 20-33766844-6. Pagando en efectivo tenés un 15% de descuento. Una vez realizado el pago, avisanos por este medio (o enviá el comprobante) para cargarlo en el sistema.',
            ),
          },
          {
            id: 'opt_pago_deuda',
            label: 'Tengo una deuda pendiente',
            node: leaf(
              'node_pago_deuda',
              'Registrás una deuda pendiente de pago con Laboratorio Ameghino. Podés abonarla por Mercado Pago o transferencia al alias laboratorioameghino (CUIT 20-33766844-6) y reenviarnos el comprobante para registrarlo. Si ya pagaste en las últimas horas o notás un error, escribinos para revisarlo.',
            ),
          },
          {
            id: 'opt_pago_rechazo',
            label: 'Me rechazaron una práctica',
            node: leaf(
              'node_pago_rechazo',
              'Tu obra social autorizó tus análisis a excepción de algunas prácticas rechazadas, que tienen un costo particular. Podés abonarlas por transferencia o Mercado Pago al alias laboratorioameghino y reenviarnos el comprobante para procesar la totalidad de tus estudios. Si preferís no hacerte esas prácticas, avisanos para avanzar solo con lo ya autorizado.',
            ),
          },
        ],
      },
    },
    {
      id: 'opt_domicilio',
      label: '🏠 Extracción a domicilio',
      node: leaf(
        'node_domicilio',
        'Sí, hacemos extracciones a domicilio. Coordinamos día y horario con la técnica — contactanos directo por acá: https://wa.me/5492645242909',
      ),
    },
    {
      id: 'opt_especiales',
      label: '👶 ¿Necesitás venir acompañado/a?',
      node: leaf(
        'node_especiales',
        'Los pacientes pediátricos siempre deben venir acompañados. Los pacientes mayores, en lo posible, también. Para la curva de azúcar recomendamos venir acompañado/a, sobre todo si tomás alguna medicación previa.',
      ),
    },
    {
      id: 'opt_autorizacion',
      label: '📝 Autorizar mis estudios (anticipado)',
      node: leaf(
        'node_autorizacion',
        'Para gestionar la autorización con anticipación necesitamos: si ya estás registrado, tu número de DNI; si es tu primera vez, DNI, apellido y nombre, fecha de nacimiento, domicilio, teléfono, correo y obra social. Además: fecha probable de extracción, foto completa y legible de la orden médica (frente y dorso si tiene anotaciones), y el token o credencial de tu obra social si la cobertura lo requiere (OSDE: podés usar el DNI 12.345.678). Quedamos a la espera de tus datos para iniciar la gestión.',
      ),
    },
    {
      id: 'opt_direccion',
      label: '📍 Dirección',
      node: leaf(
        'node_direccion',
        'Nos encontramos en Av. Libertador Gral. San Martín 1456, J5400 ASO, San Juan, Argentina.',
      ),
    },
    {
      id: 'opt_humano',
      label: '🙋 Hablar con un humano',
      isHandoff: true,
      node: null,
    },
  ],
}

// --- Cola de atención humana ---
export const mockHandoffQueue = [
  {
    id: 'conv_1',
    patientName: 'Marcela Suárez',
    phone: '+54 9 264 512 3456',
    lastMessage: 'Necesito hablar con alguien, mi obra social rechazó una práctica.',
    waitingSince: '2026-08-25T08:40:00',
  },
  {
    id: 'conv_2',
    patientName: 'Roberto Díaz',
    phone: '+54 9 264 598 7654',
    lastMessage: 'El sistema no me deja ver mis resultados, dice contraseña incorrecta.',
    waitingSince: '2026-08-25T09:05:00',
  },
]

// --- Facturación (pago de laboratorios a ZeroAutoapp) ---
// PLAN_PRICING vive en ./pricing.js (single source of truth); se re-exporta
// acá para no romper el resto de los imports existentes en el proyecto.
export { PLAN_PRICING }

// Dueño de ZeroAutoapp — cuentas donde los laboratorios pagan su suscripción.
export const mockPlatformBilling = {
  ownerName: 'ZeroAutoapp',
  ars: { alias: 'gonza.zt.mp', cvu: '0000003100017824879534' },
  usd: { alias: 'rorro.cable.desperte', cbu: '3220001888063040160011' },
  multiLabDiscount: [
    { tier: '1° laboratorio (particular)', discountPct: 0 },
    { tier: '2° laboratorio del mismo dueño', discountPct: 15 },
    { tier: '3° laboratorio o más del mismo dueño', discountPct: 25 },
  ],
}

// GET /api/lab/billing — estado de facturación de ESTE laboratorio.
export const mockLabBilling = {
  plan: 'Profesional',
  billingType: 'PARTICULAR', // 'PARTICULAR' | 'SEGUNDO_LAB' | 'TERCER_LAB_O_MAS'
  basePriceUSD: PLAN_PRICING.Profesional.priceUSD,
  discountPct: 0,
  status: 'PAID',
  nextDueDate: '2026-09-15',
  paymentMethod: 'TRANSFERENCIA_ARS', // 'TRANSFERENCIA_ARS' | 'TRANSFERENCIA_USD' | 'MERCADOPAGO'
  setupFeeStatus: 'PAID', // cuota única de habilitación, ya abonada al contratar
  setupFeePaidAt: '2025-11-04',
  // Cobro automático: si autoRenew es true, se cobra solo el próximo período
  // salvo que se cancele antes de renewalCutoffDate. cancelAtPeriodEnd=true
  // significa "ya cancelado, pero sigue activo hasta nextDueDate" — sin corte
  // de servicio a mitad de período.
  autoRenew: true,
  cancelAtPeriodEnd: false,
  renewalCutoffDate: '2026-09-12',
  // Transferencia manual reportada desde la app (en vez de depender de un
  // aviso por WhatsApp/mail que se puede perder) — null si no hay ninguna
  // pendiente de verificar.
  pendingTransfer: null,
  history: [
    { id: 'inv_2026_08', period: 'Agosto 2026', amountUSD: 45, status: 'PAID', paidAt: '2026-08-15' },
    { id: 'inv_2026_07', period: 'Julio 2026', amountUSD: 45, status: 'PAID', paidAt: '2026-07-14' },
    { id: 'inv_2026_06', period: 'Junio 2026', amountUSD: 45, status: 'PAID', paidAt: '2026-06-16' },
    {
      id: 'inv_setup',
      period: 'Habilitación (pago único)',
      amountUSD: PLAN_PRICING.Profesional.setupFeeUSD,
      status: 'PAID',
      paidAt: '2025-11-04',
    },
  ],
}

// --- Changelog público (footer > Actualizaciones) ---
export const mockChangelog = [
  {
    version: '3.5.0',
    date: '2026-08-26',
    items: [
      'Nuevo mapa visual del flujo de conversación: pasá el mouse sobre un nodo para ver un preview y hacé click para editarlo en un panel lateral o pantalla completa.',
      'El asistente ahora corrige texto con una segunda IA (Gemini) además del motor conversacional — planes y cupos de tokens actualizados.',
      'Pago automático de la suscripción con cancelación en cualquier momento; la transferencia manual ahora se reporta desde la app.',
    ],
  },
  {
    version: '3.4.0',
    date: '2026-08-20',
    items: [
      'Nuevo editor de flujo de conversación con ramas anidadas ilimitadas.',
      'Botón "Mejorar con IA" para prolijar cualquier mensaje del bot.',
      'Bandeja de Atención humana con reclamo de conversaciones.',
    ],
  },
  {
    version: '3.3.0',
    date: '2026-07-28',
    items: [
      'Panel de Facturación con historial de pagos y métodos de transferencia.',
      'Descuentos automáticos por laboratorio adicional del mismo dueño.',
    ],
  },
  {
    version: '3.2.0',
    date: '2026-06-15',
    items: [
      'Métricas globales para administradores: consumo de tokens, ingresos y distribución de planes.',
      'Tendencia de uso (creciendo / estable / en baja) por laboratorio.',
    ],
  },
  {
    version: '3.1.0',
    date: '2026-05-02',
    items: [
      'Conexión directa con WhatsApp Cloud API desde el panel del laboratorio.',
      'Base de conocimiento: subida de cartillas médicas en PDF.',
    ],
  },
  {
    version: '3.0.0',
    date: '2026-03-10',
    items: ['Lanzamiento del panel multi-laboratorio con autenticación por rol (laboratorio / administrador).'],
  },
]

// --- Estado del sistema (footer > Estado del Sistema) ---
export const mockSystemStatus = {
  overall: 'OPERATIONAL', // 'OPERATIONAL' | 'DEGRADED' | 'DOWN'
  updatedAt: '2026-08-25T09:00:00',
  components: [
    { name: 'API / Panel de control', status: 'OPERATIONAL' },
    { name: 'Webhooks de WhatsApp', status: 'OPERATIONAL' },
    { name: 'Motor de IA conversacional (OpenAI)', status: 'OPERATIONAL' },
    { name: 'Corrección de texto con IA (Gemini)', status: 'OPERATIONAL' },
    { name: 'Pagos (Mercado Pago)', status: 'OPERATIONAL' },
  ],
}

// --- Centro de Ayuda del laboratorio: quejas / feedback visibles para el admin ---
export const mockFeedback = [
  {
    id: 'fb_1',
    labName: 'Laboratorio San Martín',
    category: 'BUG',
    subject: 'El botón de guardar flujo tarda mucho',
    message: 'A veces tarda más de 10 segundos en guardar los cambios del árbol de conversación.',
    status: 'OPEN',
    createdAt: '2026-08-24T14:20:00',
  },
  {
    id: 'fb_2',
    labName: 'Laboratorio Del Norte',
    category: 'SUGERENCIA',
    subject: 'Poder duplicar una rama',
    message: 'Estaría bueno poder duplicar una rama del flujo en vez de armarla de cero cada vez.',
    status: 'OPEN',
    createdAt: '2026-08-23T10:05:00',
  },
]
