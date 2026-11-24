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

El botón se **oculta solo** (`EMBEDDED_SIGNUP_AVAILABLE`) si faltan `VITE_META_APP_ID` / `VITE_META_WHATSAPP_CONFIG_ID` en el `.env`.

Desde el 12 oct 2026 el formulario manual de credenciales (Phone Number ID / WABA ID / Access Token / Verify Token) **se sacó de la UI** — la única forma de conectar desde el panel es "Conectar con Facebook". El endpoint `PUT /api/lab/whatsapp` del backend sigue existiendo (las conexiones manuales viejas siguen funcionando), solo que el frontend ya no lo llama.

**Gotcha — CSP en `vercel.json`:** la Content-Security-Policy es estricta (`script-src 'self'`, etc.). Cualquier script/iframe/API externo nuevo que se agregue al frontend hay que habilitarlo ahí también, o falla en silencio en producción (funciona en `npm run dev` porque Vite no aplica esos headers). Así se rompió el SDK de Facebook la primera vez ("No se pudo cargar el SDK de Facebook"): hoy está habilitado `connect.facebook.net` en script-src y `*.facebook.com` en frame-src/connect-src/img-src.

**Estado (4 oct 2026): ya configurado y pusheado.** `VITE_META_APP_ID`/`VITE_META_WHATSAPP_CONFIG_ID` están cargadas en Vercel (Production). Si el botón no aparece en producción, lo primero a chequear es si hubo un **redeploy** después de cargar esas variables — Vite las compila adentro del bundle en build time, cargarlas en el dashboard no alcanza si no se re-buildea. Configuration ID de Embedded Signup en uso: `1108009258296748` (creada después de ser Tech Provider; la vieja `1453899306638942` no ofrecía Coexistence). Ver `Zero/CLAUDE.md` para el resto (webhook central, gotcha de nombres de env vars en Render). Falta probar el flujo completo con un número real — todavía nadie conectó un WhatsApp por este camino, solo se verificó que el webhook responde.

## Piezas compartidas de UX (nov 2026, no reinventar)

- **Avisos**: `useToast()` (`lib/toastContext.js`, provider en `components/ui/Toast.jsx`, montado en `main.jsx`) → `toast.success(msg)` / `toast.error(msg)`. Usarlo en cualquier guardado/acción en vez de estados inline o `alert()`.
- **Confirmaciones**: `components/ui/ConfirmDialog.jsx` (sobre `Modal`) en lugar de `window.confirm`.
- **Errores de carga**: `components/ui/ErrorState.jsx` con botón "Reintentar". Patrón de pantalla: `fetchX()` sin setState síncrono para el `useEffect` inicial + `retryX()` que resetea `loading/error` y vuelve a pedir (así no salta el lint `set-state-in-effect`).
- **Refresco automático**: `lib/useVisiblePolling.js` (solo con la pestaña visible). `LabLayout` lo usa para el contador de "Atención humana" (45 s) y lo muestra en el título de la pestaña.
- **Accesibilidad**: cada `<label>` de un campo lleva `htmlFor` + `id` en el campo (ver `Login.jsx`); `Modal` tiene `role="dialog"` y cierra con Esc; `index.css` define `:focus-visible` global para teclado. Textos mínimos `text-xs` (13px), no usar `text-[11px]`.
- **Carga por pantalla**: `App.jsx` usa `React.lazy` + `Suspense` para todas las páginas salvo `Landing` y `Login` (el bundle inicial bajó de ~912 KB a ~207 KB). Una pantalla nueva debería seguir ese patrón.

## Guía de conexión de WhatsApp (nov 2026)

`components/whatsapp/ConnectPanel.jsx` (lista previa + botón + errores claros) y `ConnectGuide.jsx` (paso a paso con "pantallas" dibujadas — NO son capturas reales de Meta, son esquemas — y "Si algo sale mal"). Se usan en `WhatsAppConnect.jsx`, en su modal de ayuda / `LabTutorials` (`WhatsappTutorial`) y como **paso 4 del onboarding** (`LabOnboarding.jsx`: la config se guarda al pasar del paso 3 al 4, así "Lo hago después" no pierde nada). Textos y datos en `lib/whatsappConnectInfo.js`; traducción de errores de Meta a lenguaje simple en `lib/whatsappConnectErrors.js`. Todo sale de conexiones reales: si Meta cambia el flujo, actualizar los pasos ahí.

## UX / diseño

Se hizo una revisión completa contra investigación de UX actual (Nielsen Norman, comparativas de ManyChat/Landbot/Typebot/Gallabox, guías de dashboards SaaS) el 28 sep 2026: la conclusión fue que la app **ya sigue bien la mayoría de las buenas prácticas** (semáforo de estado con CTA accionable en el Panel, ayuda progresiva detrás de botones "?", estados vacíos en todos los gráficos, un solo color de acento, grillas responsive). No hacer un rediseño visual grande sin que el dueño dé una dirección concreta (paleta, layout, qué pantalla puntual) — no hay pedido pendiente de eso, ya se le avisó y no pidió más por ahora.

Gaps puntuales que sí se arreglaron: checklist de Obras Sociales (arriba) y un ejemplo desactualizado en `FlowTutorial` (`FlowBuilder.jsx`) que mencionaba ramas de PAMI/OSDE/DAMSU que ya no existen.
