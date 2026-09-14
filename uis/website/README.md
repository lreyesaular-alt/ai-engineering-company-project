# Brasaland Website

Sitio web publico estatico de Brasaland. Presenta la marca, sus ubicaciones en Colombia y Estados Unidos y el programa de fidelizacion Brasa Points.

## Tecnologia

- HTML estatico.
- Tailwind CSS cargado desde CDN en `index.html`.
- JavaScript del navegador en `validation.js` para validar el formulario de registro.
- Sin servidor de aplicacion ni dependencias locales declaradas.

## Estructura

- `index.html`: landing page publica con navegacion, hero, historia, propuesta de valor, ubicaciones, menu, Brasa Points, contacto y footer.
- `application.html`: formulario de registro de Brasa Points.
- `validation.js`: validaciones del formulario, campos dependientes de pais/ciudad y mensaje de registro exitoso.

## Ejecucion

Puede abrirse directamente `index.html` en un navegador. Para servirlo localmente desde `uis/`, ejecuta:

```bash
python3 -m http.server 8000 --directory uis
```

Despues abre `http://127.0.0.1:8000/website/`.

El formulario de `application.html` simula el envio en el navegador y no conecta con una API.
