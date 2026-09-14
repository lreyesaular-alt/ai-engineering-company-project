# Reglas de trabajo

Estas reglas se derivan de la estructura y el código actuales.

- Leer `project-context.md`, `architecture.md`, `api-contract.md` y `current-state.md` antes de modificar el tracker.
- Consultar `uis/talent-pipeline-tracker/AGENTS.md` y las guías instaladas de Next.js antes de cambios relacionados con Next.js.
- Mantener las llamadas HTTP en `lib/api.ts`, los modelos en `types/candidates.ts`, la coordinación de estado en `app/page.tsx` y la presentación en `components/dashboard/`.
- Usar la API real configurada mediante `NEXT_PUBLIC_API_URL`; no inventar endpoints ni cambiar los contratos comprobados.
- Tratar los IDs de candidaturas y notas como strings.
- Verificar por separado `status` y `stage`, especialmente para el estado `pending`.
- Conservar los estados de carga, error y éxito que forman parte del comportamiento actual.
- Al modificar una candidatura, mantener sincronizados lista, detalle y caché de búsqueda cuando corresponda.
- Ejecutar `npm run lint` y, cuando el cambio lo requiera, `npm run build` desde `uis/talent-pipeline-tracker/`.
- No guardar secretos, credenciales ni datos reales de candidatos en esta memoria.
- Mantener separado el contexto Brasaland de `CONTEXT.md` del contexto funcional específico del tracker.
