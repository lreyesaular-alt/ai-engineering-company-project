# Carpeta `uis`

Esta carpeta contiene **todos los proyectos con interfaz de usuario** para el proyecto transversal de AI Engineering de la compañía — por ejemplo: un sitio web público, un frontend de panel de administración, una interfaz de ecommerce, portales para clientes, aplicaciones Streamlit/Gradio u otras herramientas sólo-frontend.

Las aplicaciones de interfaz que existen actualmente son:

- **`website`** — sitio web público estático de Brasaland. Presenta la marca, las ubicaciones en Colombia y Estados Unidos y el registro de Brasa Points. Se ejecuta abriendo `index.html` o sirviendo `uis/` con `python3 -m http.server 8000 --directory uis`. Ver [`website/README.md`](./website/README.md).
- **`backoffice`** — panel interno estático de referencia para Brasaland Digital. Muestra un resumen operativo con 14 restaurantes, distribución por país, aproximadamente 115 personas y los pilares de la marca. Se ejecuta abriendo `backoffice/index.html` o sirviendo `uis/` con `python3 -m http.server 8000 --directory uis`, y entrando en `/backoffice/`. Ver [`backoffice/README.md`](./backoffice/README.md).
- **`talent-pipeline-tracker`** — dashboard interno Next.js para gestionar candidaturas, con búsqueda, filtros, creación, edición, estados y notas. Desde `uis/talent-pipeline-tracker/`, ejecuta `npm install` y `npm run dev`. También dispone de `npm run lint`, `npm run build` y `npm run start`. Ver [`talent-pipeline-tracker/README.md`](./talent-pipeline-tracker/README.md).

Organiza `uis/` por **distintas áreas de la compañía** — cada subcarpeta agrupa un ámbito diferente (por ejemplo, web pública frente a operaciones internas) e incluye su propia documentación técnica y funcional. Actualmente, `website` y `backoffice` son aplicaciones estáticas independientes, mientras que `talent-pipeline-tracker` es una aplicación Next.js con su propio proyecto y dependencias.

- **Propósito principal**: centralizar en un único lugar todas las aplicaciones frontend que dan soporte a los casos de uso de la compañía.
- **Recomendación**: documenta en este archivo (o en sub-READMEs) las aplicaciones que vayas añadiendo, su objetivo, tecnología usada y cómo ejecutarlas.

> _These instructions are also available in [English](./README.md)._
