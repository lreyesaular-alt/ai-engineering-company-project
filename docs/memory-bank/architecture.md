# Arquitectura actual

## Stack

El `package.json` del tracker declara:

- Next.js `16.3.3`.
- React `19.2.8` y `react-dom` `19.2.8`.
- TypeScript `^5`.
- Tailwind CSS `^4` con `@tailwindcss/postcss`.
- ESLint `^9` y `eslint-config-next` `16.3.3`.

Scripts disponibles: `npm run dev`, `npm run build`, `npm run start` y `npm run lint`.

## Responsabilidades

- `app/page.tsx`: componente cliente que coordina carga paginada, búsqueda global, filtros, selección, detalle, edición, estados, notas y feedback de carga/error.
- `lib/api.ts`: cliente HTTP y funciones de acceso a la API.
- `types/candidates.ts`: tipos de candidaturas, notas, respuestas y payloads.
- `components/dashboard/CandidateList.tsx`: renderiza la lista de candidaturas.
- `components/dashboard/CandidateDetail.tsx`: muestra el detalle, edición, cambio de estado y notas.
- `components/dashboard/NewCandidateForm.tsx`: crea nuevas candidaturas y valida el formulario en cliente.
- `components/dashboard/StatusFilter.tsx`: filtro por estado del pipeline.
- `components/dashboard/SearchBar.tsx`: búsqueda por nombre o email.

## Configuración

El cliente HTTP requiere la variable `NEXT_PUBLIC_API_URL`.

## Regla local

`uis/talent-pipeline-tracker/AGENTS.md` indica que, antes de escribir código relacionado con Next.js, deben consultarse las guías relevantes instaladas en `node_modules/next/dist/docs/`.
