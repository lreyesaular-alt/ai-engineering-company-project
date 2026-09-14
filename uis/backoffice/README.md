# Brasaland Backoffice

Aplicacion interna estatica para consultar un resumen operativo de Brasaland. Es independiente de `uis/website` y de `uis/talent-pipeline-tracker`.

## Ejecutar

Abre `index.html` directamente en el navegador o sirve `uis/` con un servidor estatico. La ruta de entrada de esta aplicacion es `/backoffice/` cuando el servidor publica `uis/` como raiz.

## Contenido actual

La vista muestra datos del contexto de Brasaland: 14 restaurantes propios, 10 en Colombia, 4 en Florida, aproximadamente 115 personas y los tres pilares de la marca. No conecta con una API; es una vista inicial de referencia.

## Archivos

- `index.html`: vista de entrada y layout propio del backoffice.
- `styles.css`: estilos, layout responsive y apariencia del panel.
