# Seguridad · Prácticas y preguntas oficiales

Web estática para repasar las ocho prácticas de **Seguridad** (Ing. Informática): banco de
preguntas de verdadero o falso con el motivo de cada respuesta, banco de preguntas oficiales
y simulacro de examen contra reloj.

No hay build, ni dependencias, ni servidor propio: son cuatro archivos de texto y un poco de CSS.

## Contenido

| Archivo | Qué lleva |
|---|---|
| `index.html` | Estructura de la página y textos |
| `styles.css` | Todo el diseño (claro y oscuro) |
| `app.js` | Motor de los tests, pestañas y reloj del simulacro |
| `preguntas-practicas-1.js` | Banco de las prácticas 1 a 4 |
| `preguntas-practicas-2.js` | Banco de las prácticas 5 a 8 |
| `preguntas-oficiales.js` | 154 preguntas oficiales, agrupadas |
| `favicon.svg` | Icono de la pestaña |

- **571** preguntas de banco (8 prácticas) · **154** oficiales · simulacro de **40** preguntas en **30 minutos**.
- En el simulacro, **cada 4 fallos restan 1 acierto**.

## Verlo en local

```bash
python3 -m http.server 8765
```

Y abrir `http://localhost:8765/index.html`. (Abriendo el archivo con doble clic también funciona.)

## Subirlo a GitHub Pages (gratis)

1. Crear el repositorio:
   - Entrar en <https://github.com/new>.
   - Nombre: `seguridad-practicas` (o el que quieras).
   - Marcar **Public**.
   - **No** marcar "Add a README" (ya llevas los tuyos).
   - **Create repository**.
2. Subir los archivos:
   - En la página del repositorio nuevo: **Add file → Upload files**.
   - Arrastrar todos los archivos de esta carpeta.
   - **Commit changes**.
3. Activar Pages:
   - **Settings → Pages**.
   - En *Source* elegir **Deploy from a branch**.
   - Rama: `main`, carpeta: `/ (root)`.
   - **Save**.
4. En un minuto la web queda en:
   `https://TU-USUARIO.github.io/seguridad-practicas/`

   (Aparecerá también en tu GitHub: en la pestaña **Pages** del repositorio y en tu perfil.)

## Cambiar cosas después

- **Desde el navegador**: abrir el archivo en GitHub → lápiz ✏️ **Edit** → cambiar →
  **Commit changes**. Se vuelve a publicar solo en ~1 minuto.
- **Desde aquí**: editar los archivos y volver a subirlos (o hacer `git push`).

Los textos están todos en `index.html`. Las preguntas están en los tres archivos
`preguntas-*.js`, con el formato:

```js
{ p: "Enunciado de la pregunta", r: true, m: "Motivo que se muestra al responder" }
```
