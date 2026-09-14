# Estado actual

## Funcionalidades implementadas

Según el README del tracker y el código actual, la aplicación incluye:

- Listado paginado con límite de 20 registros por página.
- Búsqueda por nombre o email.
- Filtros de pipeline: todos, pendiente, recibido, en proceso, seleccionado y descartado.
- Formulario para crear candidaturas mediante la API.
- Panel de detalle de una candidatura.
- Edición de datos de la candidatura.
- Cambio de estado del pipeline.
- Carga, creación y eliminación de notas.
- Mensajes de carga, éxito y error.
- Sincronización de la candidatura modificada en la lista, el detalle y la caché de búsqueda.

## Comportamiento de búsqueda

La navegación normal usa `getRecordsPage(page, limit)`. Cuando hay texto de búsqueda, la página carga el conjunto completo mediante `getRecords()`, lo conserva en `allCandidatesCache` y aplica localmente la búsqueda y el filtro de estado. Al vaciar la búsqueda vuelve a usar el modo paginado.

## Control de solicitudes

`app/page.tsx` usa referencias de solicitud para ignorar respuestas obsoletas de la lista, el detalle y la carga completa de candidatos.

## Documentación del Hito 3

El README del tracker contiene resúmenes de los prompts usados para construir y corregir estas funcionalidades, incluida la integración con datos reales, paginación, edición, notas y búsqueda global.
