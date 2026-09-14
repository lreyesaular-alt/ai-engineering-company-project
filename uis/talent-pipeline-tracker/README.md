# Talent Pipeline Tracker

Dashboard interno para gestionar candidaturas: listado, filtros, busqueda, detalle, creacion, edicion, cambios de estado y notas.

## Requisitos

- Node.js y npm.
- Una API compatible con los endpoints usados por `lib/api.ts`.

## Configuracion

El cliente HTTP usa la variable `NEXT_PUBLIC_API_URL`. Crea un archivo `.env.local` en esta carpeta y configura la URL de la API:

```env
NEXT_PUBLIC_API_URL=<URL_DE_LA_API>
```

Si la variable no esta configurada, las solicitudes muestran un error de configuracion.

## Ejecucion

Desde `uis/talent-pipeline-tracker/`:

```bash
npm install
npm run dev
```

Otros scripts disponibles:

```bash
npm run lint
npm run build
npm run start
```

## Estructura funcional

- `app/page.tsx`: coordina la carga, busqueda, filtros, seleccion, detalle, edicion, estados y notas.
- `lib/api.ts`: cliente HTTP y funciones para acceder a la API.
- `types/candidates.ts`: tipos de candidaturas, notas, respuestas y payloads.
- `components/dashboard/CandidateList.tsx`: lista de candidaturas.
- `components/dashboard/CandidateDetail.tsx`: detalle, edicion, cambio de estado y notas.
- `components/dashboard/NewCandidateForm.tsx`: formulario de nuevas candidaturas y validacion en cliente.
- `components/dashboard/StatusFilter.tsx`: filtros del pipeline.
- `components/dashboard/SearchBar.tsx`: busqueda por nombre o email.

## Endpoints utilizados

Todos los endpoints se combinan con `NEXT_PUBLIC_API_URL`:

| Metodo | Ruta | Uso |
| --- | --- | --- |
| `GET` | `/records` | Carga registros y metadatos de paginacion. |
| `GET` | `/records?page={page}&limit={limit}` | Carga una pagina concreta. |
| `GET` | `/records/{id}` | Obtiene el detalle de una candidatura. |
| `POST` | `/records` | Crea una candidatura. |
| `PUT` | `/records/{id}` | Actualiza una candidatura. |
| `PATCH` | `/records/{id}` | Actualiza parcialmente estado o etapa. |
| `GET` | `/records/{id}/notes` | Obtiene las notas de una candidatura. |
| `POST` | `/records/{id}/notes` | Crea una nota con `content`. |
| `DELETE` | `/records/{id}/notes/{noteId}` | Elimina una nota. |

La respuesta paginada de registros tiene la forma `{ total, page, limit, data }`. Los IDs se manejan como strings.

## `status` y `stage`

- `status` representa el estado de la candidatura y puede incluir `received`, `in_progress`, `selected` o `discarded`, entre otros valores string.
- `stage` representa la etapa del pipeline. En la interfaz, una candidatura es `pending` cuando `stage === "pending"`.
- Al actualizar a `pending`, la interfaz envia `status: "received"` y `stage: "pending"`.
- Para los demas estados, envia el estado elegido y `stage: "review"`.

La tarjeta y el selector muestran `pending` a partir de la etapa para mantener consistente la representacion con el resto del pipeline.

## Busqueda y paginacion

- La navegacion normal usa paginas de 20 registros mediante `GET /records?page={page}&limit={limit}`.
- Al escribir una busqueda, la aplicacion obtiene el conjunto completo con `getRecords()`, que consulta las paginas necesarias y evita duplicados por ID.
- La busqueda se aplica localmente sobre `full_name` y `email`, junto con el filtro de estado activo.
- El conjunto completo se conserva en cache mientras la busqueda esta activa.
- Al vaciar la busqueda, la aplicacion vuelve al modo paginado.