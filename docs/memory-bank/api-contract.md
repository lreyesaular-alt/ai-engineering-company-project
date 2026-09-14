# Contrato de API comprobado

El contrato descrito aquí proviene de `uis/talent-pipeline-tracker/lib/api.ts` y `types/candidates.ts`. No se añaden endpoints que no aparezcan allí.

## Base y errores

- La base de todas las solicitudes es `NEXT_PUBLIC_API_URL`.
- Si la variable no existe, el cliente lanza un error.
- Las respuestas HTTP no exitosas se convierten en `ApiError`; se intenta leer `error` o `message` del JSON de error y, si no existe, se usa el estado HTTP.

## Endpoints usados

- `GET /records`: obtiene una página con `{ total, page, limit, data }`. `getRecords()` usa esa información para solicitar las páginas restantes y devolver todos los registros sin duplicar IDs.
- `GET /records?page={page}&limit={limit}`: obtiene una página para la navegación paginada.
- `GET /records/{id}`: obtiene una candidatura por ID.
- `POST /records`: crea una candidatura.
- `PUT /records/{id}`: actualiza una candidatura.
- `PATCH /records/{id}`: actualiza parcialmente el estado o la etapa.
- `GET /records/{id}/notes`: obtiene `{ data, meta? }` con las notas de la candidatura.
- `POST /records/{id}/notes`: crea una nota con `{ content }`. El cliente acepta una nota directa o una respuesta `{ data }`.
- `DELETE /records/{id}/notes/{noteId}`: elimina una nota.

## Tipos comprobados

`CandidateRecord` contiene `id`, `full_name`, `email`, `phone`, `position`, `linkedin_url`, `cv_url`, `status`, `stage` opcional, `experience_years`, `notes_count` opcional, `applied_at` y `updated_at`.

`CandidateNote` contiene `id`, `record_id`, `content` y `created_at`.

Los payloads de creación y actualización incluyen nombre, email, teléfono, posición, estado y años de experiencia; etapa, LinkedIn y CV son opcionales en el tipo. El payload de cambio parcial admite `status` y `stage`.

## Estados

El tipo permite `pending`, `received`, `in_progress`, `selected`, `discarded` y otros valores string. La memoria del repositorio registra como observados en la API `in_progress`, `received` y `discarded`; la UI también contempla `pending` y `selected`.

En la UI, `pending` se obtiene cuando `stage === "pending"`. Al cambiar a `pending`, `page.tsx` envía `status: "received"` y `stage: "pending"`; para los demás estados envía el estado elegido y `stage: "review"`.

Los IDs se tratan como strings y no deben sustituirse por IDs numéricos.
