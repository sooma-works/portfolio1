# Portfolio 1 — Inés Varela, fotógrafa

Portfolio **de ejemplo** que Sooma (soomaworks.com) va a mostrar en su web como
muestra de lo que puede hacer. La fotógrafa y todo el contenido son ficticios.
El objetivo no es "un portfolio prolijo": es una pieza que haga decir "wow" a
quien la abra y que no se parezca a nada hecho con IA o con plantilla.

Antes de diseñar o escribir UI, cargá la skill `frontend-design`.

---

## 1. El personaje

- **Nombre:** Inés Varela.
- **Base:** Rosario, Argentina. Trabaja en todo el país.
- **Qué hace:** retrato, fotografía documental y editorial (revistas, marcas).
- **Firma de estilo:** analógica en el espíritu, aunque trabaje en digital.
  Mucho blanco y negro, luz natural, grano visible.
- **Bio (tono):** primera persona, corta, cálida y sin clichés ("capturo
  momentos únicos" está prohibido). Algo como: "Empecé revelando en el baño de
  casa con una ampliadora prestada. Sigo trabajando igual: despacio, mirando
  mucho antes de disparar."
- Textos en castellano rioplatense (voseo), concretos y breves.

## 2. Concepto de diseño: "Cuarto oscuro"

Todo el sitio es un **laboratorio de revelado**. La interfaz se comporta como
papel fotográfico, película y hoja de contactos. Cada interacción tiene que
remitir a ese mundo. Es la idea rectora: si algo no encaja con el cuarto
oscuro, no va.

### Paleta

| Token           | Valor     | Uso                                                |
| --------------- | --------- | -------------------------------------------------- |
| `--ink`         | `#0d0c0b` | Fondo principal (negro cálido, nunca `#000`)       |
| `--paper`       | `#efe9df` | Texto y superficies "papel fotográfico"            |
| `--safelight`   | `#c4231b` | Acento: la luz roja de seguridad del laboratorio   |
| `--fixer`       | `#8a8378` | Texto secundario, metadatos                        |

El rojo se usa con mucha restricción: estados activos, el cursor, un momento
puntual del hero. Nunca en bloques grandes salvo en la intro.

### Tipografía

- **Display:** `Bodoni Moda` (Google Fonts), en tamaños enormes, a veces en
  itálica, con interletrado ajustado. Los títulos de las series pueden ocupar
  el ancho de la pantalla.
- **Técnica/metadatos:** `IBM Plex Mono`, en mayúsculas chicas, para todo lo
  que imita la película: números de fotograma, datos EXIF, fechas, rótulos.
- Prohibido: Inter, Roboto, Poppins, Playfair Display, Space Grotesk, Montserrat.

### Textura

- Grano de película sobre todo el sitio: un overlay SVG con `feTurbulence`,
  animado con un desplazamiento leve (2–3 cuadros por segundo, que "hierva"
  sin marear). Opacidad baja, `pointer-events: none`.
- Bordes de película y perforaciones dibujados en SVG, no con imágenes.

## 3. Ideas "locas" (todas obligatorias)

1. **Intro: el revelado.** Al cargar, la pantalla está bañada en rojo de
   seguridad. Aparece un "papel" en blanco que, en 2–3 s, revela la foto del
   hero como en la cubeta: de blanco puro a imagen, con contraste que sube
   (`filter: brightness() contrast()` + una máscara que avanza en manchas
   irregulares, no en un fade lineal). Después la luz roja se apaga y queda
   el sitio en negro. Se puede saltear con clic/tecla, y solo se muestra
   completa la primera visita (guardalo en `sessionStorage` con try/catch).
2. **Cursor lupa.** En desktop, el cursor es un círculo con borde rojo. Sobre
   las fotos se convierte en una lupa de cuentahílos que amplía x2 la zona de
   abajo (con un `background-image` de la misma foto, posicionado según el
   mouse). En mobile no existe.
3. **Hoja de contactos como índice.** La sección de trabajos es una hoja de
   contactos: tiras de película con fotos chicas, números de fotograma
   (`12A`, `13`, `13A`…) y un texto de borde de película inventado
   (`VARELA 400 · SAFETY FILM`). Al pasar el mouse sobre una foto, un trazo
   de lápiz graso rojo la rodea dibujándose en vivo (SVG con
   `stroke-dasharray`, trazo irregular como hecho a mano). Clic → abre la serie.
4. **Película horizontal.** Dentro de cada serie, las fotos corren en una tira
   horizontal fijada con GSAP ScrollTrigger (scroll vertical mueve la tira).
   Las perforaciones se mueven a otra velocidad (parallax sutil). En mobile
   pasa a scroll vertical normal con fotos a todo el ancho.
5. **Datos EXIF como pie.** Cada foto lleva su "receta" en mono:
   `f/2.8 · 1/125 · ISO 400 · 35mm`, más lugar y año. Inventados pero
   verosímiles.
6. **Transición entre páginas:** un "obturador". Dos láminas negras que se
   cierran desde arriba y abajo y vuelven a abrirse (150–250 ms cada mitad).
7. **Contacto como sobre de laboratorio.** El bloque de contacto imita el
   sobre donde se entregaban los negativos: campos que parecen escritos a
   mano en un formulario impreso ("Nombre", "Tipo de trabajo", "Fecha").

Si se te ocurre algo mejor que encaje en el concepto, proponelo, pero no
reemplaces estas ideas por versiones más tímidas.

## 4. Estructura

Usá `react-router-dom` (instalarlo):

- `/`: intro de revelado → hero (foto + nombre gigante) → hoja de contactos
  con las series → "Sobre mí" → "Encargos" → contacto → footer.
- `/series/:slug`: página de serie con la tira de película, el texto de la
  serie y un link a la siguiente serie.
- Netlify: agregar a `netlify.toml` el redirect SPA
  (`/*` → `/index.html` 200), igual que en `~/dev/optica-amen`.

### Series (4)

| Slug               | Título              | Tipo        | Tratamiento        |
| ------------------ | ------------------- | ----------- | ------------------ |
| `rio-marron`       | Río marrón          | Documental: el Paraná, pescadores, islas | B/N |
| `oficios`          | Oficios             | Retratos de gente trabajando (zapatero, panadera, luthier) | B/N |
| `domingo`          | Domingo             | Escenas de barrio, sobremesas, clubes | Color cálido y apagado |
| `editorial`        | Encargos editoriales| Moda y marcas | Color |

6 a 10 fotos por serie, más una de portada. Cada serie tiene un texto de
2–3 párrafos cortos.

### Encargos

Tres tipos de trabajo (Retrato, Editorial y marcas, Documental), cada uno con
dos líneas de descripción. Sin precios.

## 5. Imágenes (Unsplash)

- Solo de **unsplash.com** (licencia Unsplash: uso libre, sin atribución
  obligatoria). Nada de Unsplash+ (las pagas).
- **Descargarlas** a `public/img/<serie>/NN.jpg`; nunca linkear al CDN de
  Unsplash. Bajarlas a 2000 px de lado mayor (para el hero, 2400) y generar
  además una versión de 800 px para la hoja de contactos. Formato JPG o WebP,
  calidad ~80. Usar `srcset`, `loading="lazy"` y `width`/`height` en todas.
- Coherencia: cada serie tiene que parecer hecha por la misma persona.
  Elegí fotos con luz y estilo parecidos. Para las series B/N, convertilas a
  blanco y negro al procesarlas (no con CSS) para que la grilla sea pareja.
- Evitar caras de personas famosas, logos de marcas y lugares que se
  reconozcan como de otro país (tiene que poder pasar por Argentina).
- Registrar cada foto en `src/data/credits.js` (autor, URL de Unsplash) y
  mostrar los créditos en una línea discreta del footer o en una página
  `/creditos`.
- El retrato de Inés para "Sobre mí": una mujer con cámara, sin que se vea la
  marca de la cámara si se puede.

## 6. Footer: firma de Sooma (obligatoria)

El footer lleva la firma animada de Sooma, el logo que se transforma en
"Hecho por sooma." en loop. El original está en `~/dev/sooma-signature`.

1. Copiar `Signature.jsx`, `Signature.css` y
   `assets/sooma-tile-sobre-oscuro-ocre-tinta.svg` a
   `src/components/sooma-signature/`.
2. Reemplazar el `<Link to="/">` por
   `<a href="https://soomaworks.com" target="_blank" rel="noreferrer">`, igual
   que en `~/dev/optica-amen/src/components/SoomaSignature.jsx`.
3. Cargar la fuente `Bricolage Grotesque` (600) en `index.html`.
4. Sobre el fondo negro va la variante `color` (la original). Si en el footer
   la paleta pide otra, usar `white`. No cambiar la animación ni los tiempos.

Al lado de la firma, en chico y en mono: `Proyecto demo · contenido ficticio`.

## 7. Calidad (definición de terminado)

- **Mobile primero de verdad:** cada idea tiene su versión táctil, no solo
  "se achica". Probar en 375 px.
- **`prefers-reduced-motion`:** sin intro, sin grano animado, sin tira
  fijada; todo funciona con transiciones mínimas.
- **Accesibilidad:** `alt` descriptivos (lo que se ve en la foto), foco
  visible, navegación por teclado, contraste AA en textos.
- **Performance:** Lighthouse ≥ 90 en Performance en mobile. La foto del
  hero precargada (`<link rel="preload">`). GSAP solo donde haga falta.
- **SEO/compartir:** `title`, `description`, `og:image` (la foto del hero),
  `lang="es"`, favicon propio (un monograma "IV" o un fotograma).
- `npm run lint` y `npm run build` sin errores.
- Verificar en el navegador (preview) desktop y mobile antes de dar algo por
  terminado.

## 8. Stack y convenciones

- Vite 8 + React 19 + Tailwind 4 (`@theme` en `src/index.css` con los tokens
  de arriba) + oxlint. Ya están `framer-motion` y `lucide-react`.
- Sumar `gsap` (con ScrollTrigger) y `react-router-dom`. Opcional: `lenis`
  para scroll suave. No sumar librerías de componentes (shadcn, MUI, etc.).
- Dev server en el puerto **5181** (`server.port` en `vite.config.js`), así
  no choca con el portfolio 2.
- Estructura: `src/components/`, `src/pages/`, `src/data/` (series, textos,
  créditos como datos, no hardcodeados en el JSX).
- Commits chicos, mensaje en castellano en infinitivo, como en el resto de
  los repos de Sooma ("Sumar la hoja de contactos", "Ajustar el revelado en
  mobile").
