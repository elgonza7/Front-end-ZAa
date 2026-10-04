# zero-frontend — contexto para retomar sesiones

Ver también `../CLAUDE.md` (mapa de los 3 repos).

## Stack y estructura

React + Vite, Tailwind (variables de tema `var(--accent)`, `var(--bg)`, etc. — soporta claro/oscuro), `react-router-dom`. Rutas en `src/App.jsx`, nav lateral en `src/config/nav.js`. Servicios de API en `src/api/*.js`, todos con un flag `USE_MOCKS` (actualmente `false` en todos — el backend real ya está andando, no hay que reactivar mocks salvo pedido explícito).

Auth: JWT en `sessionStorage` (NO localStorage) — a propósito, así pestañas distintas del navegador pueden tener sesiones de laboratorios distintos sin pisarse (ver comentario largo en `src/api/client.js`). `RequireAuth.jsx` es el gate central de rutas (rol, `mustChangePassword`, `onboardingCompleted`, en ese orden).

## Cosas agregadas en la sesión del 28 sep 2026 (no reinventar)

- **WhatsAppConnect.jsx**: ya no tiene selector Manual/Coexistence — el panel solo ofrece Coexistence. El tutorial (`WhatsappTutorial`, exportado y reusado en `LabTutorials.jsx`) está reescrito para ese flujo únicamente.
- **LabSettings.jsx → sección "Obras sociales"**: checklist de las 24 coberturas del catálogo (buscador + botones Todas/Ninguna porque son demasiados ítems para escanear de un vistazo — ver investigación de UX citada abajo), con un ✏️ por cada una que abre `components/settings/ObraSocialEditModal.jsx` para escribir texto propio (con "Mejorar con IA" por campo, mismo patrón que `FlowNodeEditor`). Se llega ahí también desde el Flow Builder con `#obras-sociales` en la URL (scroll automático).
- **Flow Builder (`components/flow/`)**: soporta opciones "atajo" que no abren un nodo sino que navegan a otra pantalla del panel — `option.linkTo` + `FLOW_LINK_TARGETS` en `flowTree.js`. Se ven con ícono de enlace y color distinto en `FlowMap`, `FlowNodeEditor` y `FlowNodePreview`. Usado hoy solo para "Ver todas las obras sociales" dentro del nodo de autorización de estudios.
- **Modal.jsx**: ahora acepta `size="lg"` (por defecto sigue siendo el tamaño chico de siempre) y tiene scroll interno con `max-h-[85vh]` — usarlo en vez de agrandar un modal a mano si hace falta más espacio.

## Embedded Signup (~4 oct 2026)

`WhatsAppConnect.jsx` tiene un botón "Conectar con Facebook" (arriba del formulario manual, que se mantiene como fallback) que dispara `src/lib/metaEmbeddedSignup.js`: carga el SDK de Facebook, llama `FB.login()` con un `config_id` de WhatsApp Embedded Signup, y combina el `code` (viene del callback de login) con `waba_id`/`phone_number_id` (vienen aparte, por `postMessage` del popup de Meta — pueden llegar en cualquier orden). El resultado se manda a `POST /api/lab/whatsapp/embedded-signup`.

El botón se **oculta solo** (`EMBEDDED_SIGNUP_AVAILABLE`) si faltan `VITE_META_APP_ID` / `VITE_META_WHATSAPP_CONFIG_ID` en el `.env` — esos dos salen de una "Configuración" que hay que crear a mano en el panel de Meta for Developers (producto "Facebook Login for Business" de la App central), no son algo que yo pueda generar. Ver `Zero/CLAUDE.md` para el resto de la configuración pendiente (webhook central, App ID/Secret del lado del backend). No se pudo probar contra la Graph API real todavía.

## UX / diseño

Se hizo una revisión completa contra investigación de UX actual (Nielsen Norman, comparativas de ManyChat/Landbot/Typebot/Gallabox, guías de dashboards SaaS) el 28 sep 2026: la conclusión fue que la app **ya sigue bien la mayoría de las buenas prácticas** (semáforo de estado con CTA accionable en el Panel, ayuda progresiva detrás de botones "?", estados vacíos en todos los gráficos, un solo color de acento, grillas responsive). No hacer un rediseño visual grande sin que el dueño dé una dirección concreta (paleta, layout, qué pantalla puntual) — no hay pedido pendiente de eso, ya se le avisó y no pidió más por ahora.

Gaps puntuales que sí se arreglaron: checklist de Obras Sociales (arriba) y un ejemplo desactualizado en `FlowTutorial` (`FlowBuilder.jsx`) que mencionaba ramas de PAMI/OSDE/DAMSU que ya no existen.
