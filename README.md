# ZeroAutoapp — Frontend

Panel web para ZeroAutoapp (SaaS de asistentes de WhatsApp con IA para
laboratorios clínicos). React + Vite + Tailwind CSS, pensado para consumir la
API de `Zero` (ASP.NET Core Minimal APIs) ubicada en `../Zero`.

## Stack

- React 19 (Vite)
- Tailwind CSS v4
- react-router-dom
- recharts (gráfico de consumo de tokens)
- lucide-react (íconos)

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
```

En desarrollo, `vite.config.js` redirige `/api/*` a `http://localhost:5041`
(el puerto HTTP del backend `Zero`, ver `Zero/Properties/launchSettings.json`).
Levantá ambos proyectos en paralelo y las llamadas a `/api/...` desde el
frontend llegarán al backend sin configurar CORS en desarrollo.

En producción, seteá `VITE_API_BASE_URL` (ver `.env.example`) con la URL
pública de la API si el frontend no se sirve desde el mismo dominio.

## Estructura

```
src/
  api/            # capa HTTP: un archivo por dominio (auth, lab, admin,
                  # whatsapp, flow, handoff, ai)
  components/
    layout/       # Sidebar, DashboardLayout, LabLayout/AdminLayout,
                  # Navbar/Footer de la landing
    ui/           # primitivos: Card, Badge, Switch, ProgressBar, Button,
                  # Modal, ImageDrop...
    flow/         # FlowNodeEditor: editor recursivo del árbol de conversación
  config/nav.js   # ítems de navegación del sidebar por rol (lab / admin)
  lib/mockData.js # datos falsos usados mientras USE_MOCKS = true
  pages/          # Landing, Login, LabDashboard, WhatsAppConnect,
                  # FlowBuilder, LabSettings, HandoffInbox, AdminPanel,
                  # AdminTenants, AdminMetrics
```

### Rutas

| Ruta | Página | Rol |
| --- | --- | --- |
| `/` | Landing | — |
| `/login` | Login | — |
| `/dashboard` | Panel (KPIs + analítica) | Laboratorio |
| `/dashboard/whatsapp` | Conexión con WhatsApp Cloud API | Laboratorio |
| `/dashboard/flujo` | Editor del árbol de conversación | Laboratorio |
| `/dashboard/configuracion` | Marca, reglas del asistente, base de conocimiento | Laboratorio |
| `/dashboard/conversaciones` | Bandeja de atención humana | Laboratorio |
| `/dashboard/facturacion` | Suscripción, medios de pago e historial | Laboratorio |
| `/dashboard/ayuda` | Centro de Ayuda + formulario de feedback | Laboratorio |
| `/admin` | Resumen de la plataforma | Admin |
| `/admin/inquilinos` | Alta/baja/edición de laboratorios + tendencia de uso | Admin |
| `/admin/metricas` | Consumo, ingresos y planes de toda la plataforma | Admin |
| `/admin/soporte` | Reclamos y sugerencias enviados por los laboratorios | Admin |
| `/caracteristicas` | Landing — qué hace la plataforma (con mockups) | — |
| `/precios` | Landing — planes, habilitación + cuota mensual | — |
| `/actualizaciones` | Landing — changelog por versión | — |
| `/legal` | Términos, Condiciones y Privacidad (de `Términos_Condiciones_ZeroAutoapp_V3.pdf`) | — |
| `/ayuda` | Centro de Ayuda público (mailto, sin formulario) | — |
| `/estado` | Estado del sistema por componente | — |

Las páginas de **WhatsApp** y **Flujo de conversación** tienen un botón
"Tutorial" en el header (`HelpButton` + `Modal`, ver `src/components/ui/`) con
instrucciones paso a paso. El `Modal` se renderiza con un `createPortal` a
`document.body` — es necesario porque el header del dashboard usa
`backdrop-blur`, y un `filter`/`backdrop-filter` en un ancestro convierte a
los descendientes `position: fixed` en relativos a ese ancestro en vez del
viewport.

## Cómo conectar con el backend (Zero)

Toda llamada a la API pasa por `src/api/client.js` (`apiFetch`), que ya
adjunta el header `Authorization: Bearer <token>` leyendo el JWT guardado en
`localStorage` por `authService.login()`. Los archivos de servicio en
`src/api/` (`authService`, `labService`, `adminService`, `whatsappService`,
`flowService`, `handoffService`, `aiService`, `billingService`) son el único
lugar que necesita cambiar para pasar de mocks a la API real:

1. En cada función de esos archivos, poné `USE_MOCKS = false`.
2. Cada función ya tiene comentado el endpoint REST esperado, por ejemplo:
   - `POST /api/auth/login` → `{ token, role, labId }`
   - `GET /api/lab/me` → perfil del laboratorio autenticado (filtrado por
     `LaboratorioId` vía Global Query Filters de EF Core, según el doc de
     arquitectura)
   - `PATCH /api/lab/bot` → togglea `IsBotActive`
   - `PUT /api/lab/settings` → branding, `handlesAppointments`,
     `handlesHumanHandoff`, método de entrega de resultados
   - `POST /api/lab/knowledge` (multipart, campo `file`) → sube PDFs a
     Spaces/S3/Blob Storage
   - `GET /api/lab/whatsapp` / `PUT /api/lab/whatsapp` → estado y
     credenciales de la Cloud API (phone number ID, WABA ID, access token,
     webhook verify token)
   - `GET /api/lab/flow` / `PUT /api/lab/flow` → árbol de conversación
     completo (JSON), se usa para armar el System Prompt dinámico de OpenAI
   - `GET /api/lab/handoff` / `POST /api/lab/handoff/{id}/claim` → cola de
     conversaciones que pidieron "hablar con un humano"
   - `POST /api/lab/ai/improve-message` → corrección/mejora de texto con IA
   - `GET /api/lab/billing` → plan, precio con descuento, vencimiento e
     historial de pagos de ESTE laboratorio
   - `GET /api/platform/billing-destination` → cuentas de ZeroAutoapp (alias
     + CVU en ARS, alias + CBU en USD) donde los laboratorios pagan su
     suscripción — hoy vive hardcodeada en `mockData.js`
     (`mockPlatformBilling`); en producción debería salir de configuración de
     backend, no del bundle del frontend
   - `GET /api/admin/labs`, `POST /api/admin/labs`,
     `GET /api/admin/labs/{id}` (incluye `usageHistory` para calcular
     tendencia), `PATCH /api/admin/labs/{id}/suspend` — endpoints de
     administrador, protegidos por rol
   - `POST /api/lab/feedback` → queja/sugerencia de un laboratorio;
     `GET /api/admin/feedback` / `PATCH /api/admin/feedback/{id}` → bandeja
     de soporte del admin (`feedbackService.js`)
   - `GET /api/public/changelog`, `GET /api/public/status` → páginas públicas
     de Actualizaciones y Estado del sistema (`contentService.js`), no
     requieren autenticación

Ningún componente de página llama a `fetch` directamente: siempre pasan por
esta capa de servicios, así que el swap mock → real no toca `pages/` ni
`components/`.

## El árbol de conversación (FlowBuilder)

`src/pages/FlowBuilder.jsx` edita un árbol recursivo (`src/components/flow/FlowNodeEditor.jsx`)
con esta forma:

```js
{
  id, text, image,           // mensaje del bot en este paso
  options: [
    { id, label, node },     // rama normal: label = texto del botón, node = sub-árbol
    { id, label, isHandoff: true, node: null }, // rama especial "hablar con humano"
  ],
}
```

El seed en `mockData.js` (`mockFlowTree`) está armado a partir de
`ASISTENTE VIRTUAL.pdf` (indicaciones reales de un laboratorio). Al guardar
(`PUT /api/lab/flow`), el backend debería serializar este JSON tal cual en
Postgres (columna `jsonb`) e inyectarlo en el System Prompt dinámico de
OpenAI descrito en el doc de arquitectura.

## Seguridad: todo el contenido de usuario se renderiza como texto

Mensajes del flujo de conversación, nombres de laboratorio, feedback enviado
al admin, etc. son texto ingresado por el Cliente y se muestran siempre vía
interpolación JSX (`{texto}`), que React escapa automáticamente — nunca se
usa `dangerouslySetInnerHTML`, `innerHTML` ni `eval` en ningún componente
(podés verificarlo: no aparece ninguna de esas tres cadenas en `src/`). Esto
evita inyección de HTML/script desde el panel de un laboratorio, desde el
panel de admin, o desde cualquier campo de texto de la app.

Esto es una garantía del lado del cliente, no una garantía del sistema: el
backend real debe revalidar/sanitizar todo el contenido igual, porque un
cliente HTTP que no sea este frontend (curl, Postman, un bot) puede mandar
cualquier payload directo a la API sin pasar por React.

## Roles

No hay guard de rutas todavía (los mocks aceptan cualquier email/contraseña;
un email que contiene "admin" simula el rol admin). Cuando el backend emita
JWTs con un claim de rol, agregar un `RequireAuth`/`RequireRole` wrapper en
`App.jsx` alrededor de `/dashboard` y `/admin` es el siguiente paso natural.
#   F r o n t - e n d - Z A a  
 