# Clínica Dental Anre - Notas del Proyecto

## Estilo y Diseño
- **Estilo**: Clínico, de alta gama, limpio y elegante. Fondo blanco/negro de lujo.
- **Tipografía**: Letras altamente legibles, limpias y profesionales.
- **Imágenes**: Formato horizontal (16:9) para secciones hero o fondos grandes. Formato cuadrado o vertical para tarjetas de servicios.

## Estructura del Sitio Local
El sitio web está compuesto por los siguientes archivos HTML:
- `index.html` (Página principal)
- `servicios.html` (**índice** de tratamientos, no compite por término suelto)
- `galeria.html`
- `contacto.html` (incluye las preguntas frecuentes)
- `sobre-nosotros.html`
- `aviso-de-privacidad.html`
- `404.html`

Páginas por tratamiento, cada una con su `MedicalWebPage`, su `FAQPage` y
migas de tres niveles:
- `implantes-dentales.html`
- `ortodoncia.html`
- `diseno-de-sonrisa.html`
- `blanqueamiento-dental.html`

Las cuatro tarjetas correspondientes de `servicios.html` enlazan a su página
desde el `<h3>` y desde un `a.card-link`. **Si se añade una página nueva de
tratamiento hay que enlazarla desde ahí y meterla en `sitemap.xml`**, si no
queda huérfana y no la indexa nadie.

## Reglas para Claude
- Lee siempre este archivo antes de proponer cambios de código.
- Mantén consistencia en los colores y fuentes en todas las páginas.
- No alteres las rutas de las carpetas `css/`, `images/` o `js/`.

## Contenido médico: qué se puede afirmar y qué no

Google aplica a este sitio el criterio **YMYL**, el más estricto que tiene,
porque es salud. La regla que gobierna todo el contenido clínico:

**Prohibido, sin excepciones:** precios, rangos o financiación; porcentajes,
tasas de éxito o cualquier estadística; promesas de resultado ("sin dolor",
"para siempre", "garantizado", "el mejor", "indoloro"); plazos presentados
como certeza; comparaciones con otras clínicas; testimonios o antes y después;
y cualquier dato del centro que el sitio no afirme ya (premios, marcas de
implantes, convenios, seguros, número de pacientes).

**Permitido:** odontología general de manual, correcta y no controvertida, y
los hechos que el sitio ya sostiene del centro (24+ años, UFM y Universidad
Andrés Bello, tomografía 3D propia, escáner intraoral, laboratorio de
esterilización con autoclave y cabina UV, sedación consciente con óxido
nitroso, sistema Beyond Polus Ultra). Al tocar plazos o etapas, siempre en
general: "suele", "por lo general", "varía según el caso", y remate en que se
valora en consulta.

Ya se retiraron dos veces afirmaciones de este tipo ("elimina el 99.9% de los
riesgos", "100% bioseguridad", "sin dolor", una garantía de que el
blanqueamiento no toca el esmalte). **No las reintroduzcas por otra puerta.**

La pregunta del costo sí se responde, en las cuatro páginas de tratamiento,
explicando de qué depende y remitiendo a la consulta de valoración, **sin una
sola cifra y sin teléfonos dentro del `FAQPage`**.

Cada página de tratamiento lleva un `div.content-meta` con el responsable del
contenido y la fecha de revisión, y eso se refleja en el JSON-LD con
`reviewedBy`, `lastReviewed` y `dateModified`.

**Ortodoncia es un caso aparte.** El Dr. Hazbun es especialista en implantes,
rehabilitación y estética, no en ortodoncia. Esa página dice "el ortodoncista
que lleve su caso", nunca "su ortodoncista", y su `content-meta` explica que el
tratamiento lo realiza un profesional de esa especialidad integrado al caso.

## Trampa del FAQPage

El texto de las preguntas frecuentes está **duplicado**: una vez en los
`details.faq-item` visibles y otra dentro del bloque `FAQPage` del JSON-LD.
**Tienen que coincidir carácter por carácter.** Si tocas una respuesta y
olvidas la otra, Google puede tratar el marcado como engañoso. Es el fallo más
fácil de cometer en este sitio: compruébalo con un script antes de dar por
buena cualquier edición de preguntas.

## Redacción
- Todo el texto del sitio se dirige al paciente de **usted**, nunca de tú ("su salud dental", "agende su cita", "conozca su trayectoria"). No uses tú/tu/te/ti ni conjugaciones informales.
- No uses guiones largos (—) ni `&mdash;` para separar ideas dentro de una oración, usa comas. El cliente pidió específicamente quitarlos porque "hace que se note mucho que es IA".

## Despliegue (ya en producción)
- El sitio está publicado en **https://andrewhazbun.com** (dominio propio, HTTPS activo).
- Hosting: **GitHub Pages**, repo `jalejandromarroquin2-lgtm/andrew-hazbun-web` en GitHub, rama `main`, se publica automáticamente con cada `git push`.
- DNS y dominio: comprado y administrado en **Cloudflare Registrar** (cuenta del cliente). Los registros A/CNAME apuntan a GitHub Pages con el proxy de Cloudflare **desactivado** (DNS only), es necesario para que el certificado HTTPS de GitHub funcione.
- Archivo `CNAME` en la raíz del repo mantiene el dominio personalizado, no lo borres.
- Para publicar cambios: commitear y `git push` a `main`, GitHub Pages reconstruye solo en 1-2 minutos.
- SEO ya configurado: `sitemap.xml`, `robots.txt`, datos estructurados (JSON-LD tipo Dentist) en `index.html`, etiquetas Open Graph/Twitter Card y `rel=canonical` en las 5 páginas, imagen social en `images/og-preview.jpg`. El sitio ya está verificado en Google Search Console (propiedad de dominio) y el sitemap fue aceptado.

## Imágenes: formato y atributos (obligatorio para imágenes nuevas)
- Todas las imágenes que se muestran van en **WebP** (máx. 1600 px de ancho, calidad 82). Los JPG originales se conservan en `images/` como respaldo, no se sirven.
- **Excepciones que siguen en PNG/JPG a propósito**: `og-preview.jpg`, porque varios rastreadores sociales (WhatsApp entre ellos) no renderizan WebP en la vista previa del enlace; y los `favicon-*.png`, porque iOS no acepta `apple-touch-icon` en WebP.
- Cada `<img>` lleva `loading="lazy"`, `decoding="async"` y sus `width`/`height` reales. Sin las dimensiones, la página salta mientras carga. La única imagen sin `lazy` es el logo del encabezado, por estar sobre el pliegue.
- El fondo del hero de cada página se precarga con `<link rel="preload" as="image">` en su `<head>`. Si se cambia ese fondo en el CSS, hay que cambiar también el preload.
- **Trampa con `width`/`height`:** si una imagen lleva esos atributos y además le fijás **solo una** dimensión por CSS (por ejemplo `style="height:52px"`), el navegador usa el atributo `width` como ancho y la aplasta. Siempre acompañá con `width:auto` (o `height:auto`, según cuál fijes). Así pasó con el logo del pie.
- Las imágenes que se muestran en rejilla (galería, tríptico de servicios) llevan `srcset` con una variante `-900.webp` y un `sizes` que describe la rejilla real. Si cambian las columnas en el CSS, hay que actualizar el `sizes` o el navegador elegirá mal el archivo.

## Manejo de imágenes (lecciones aprendidas)
- Las fotos del celular del cliente suelen traer una etiqueta EXIF de orientación que `sips -g orientation` no reporta bien. Usar `PIL.ImageOps.exif_transpose()` o `sips --resampleHeightWidthMax` directo sobre el original, nunca rotar manualmente con `sips -r` y luego redimensionar, eso causa doble rotación.
- Si una imagen ya procesada aparece de lado en el navegador pero se ve bien con el visor local, revisar con `python3 -c "from PIL import Image; print(Image.open('...').getexif().get(274))"`, si hay un tag de orientación viejo, hay que limpiarlo (recomprimir sin EXIF) sin rotar los píxeles de nuevo.
- Evitar cutouts PNG con fondo removido si se puede usar una foto real igual de buena, los recortes con IA casi siempre dejan artefactos blancos difíciles de limpiar del todo.

## Pendientes / contexto de negocio
- Google Business Profile: en proceso de creación/verificación por el cliente.
- Facebook e Instagram: ya reconectados entre sí (esto lo resolvió el cliente directamente en Meta, no algo que Claude gestione).
- Correo con dominio propio (`@andrewhazbun.com`): se recomendó Cloudflare Email Routing (gratis) + alias "enviar como" en Gmail existente, pendiente de que el cliente lo active.
- El cliente es sensible al costo, prioriza siempre la opción gratuita o más económica disponible antes que una de pago.

## Fondos de hero en móvil
Las fotos de hero son horizontales y el hero de un teléfono es casi el doble de
alto que ancho, así que `background-size: cover` recortaba una franja vertical
estrecha: en la portada se veía el canto de una puerta de vidrio en vez de la
recepción. Por debajo de **640 px** cada página usa una versión vertical 9:16,
encuadrada a mano:

| página | fondo en escritorio | fondo en móvil |
|---|---|---|
| index | `reception-entrance` | `hero-index-movil.webp` |
| contacto y aviso | `reception-moody` | `hero-contacto-movil.webp` |
| servicios | `team-treatment-h` | `team-collaboration.webp` |
| sobre-nosotros | `hero-golden-hour` | `doctor-studio-v.webp` |
| implantes-dentales | `tomography-h` | `gallery-treatment-bts.webp` |
| ortodoncia | `doctor-studio-h` | `gallery-treatment-closeup.webp` |
| diseno-de-sonrisa | `reception-symmetrical` | `doctor-detail-2.webp` |
| blanqueamiento-dental | `gallery-cosmetic-treatment` | `gallery-whitening.webp` |

**Cuidado al elegir foto para el cuerpo de una página:** no puede ser la misma
que su propio fondo de hero, o sale dos veces. Pasó con `tomography-h` en
implantes y hubo que cambiarla.

Si cambia alguno, hay que cambiar también el `<link rel="preload">` de esa
página, que lleva `media="(max-width: 640px)"` para la vertical y
`media="(min-width: 641px)"` para la horizontal. **El punto de corte del CSS y
el del preload tienen que coincidir**, si no se descarga la imagen que no se usa.

## Reglas de interfaz (auditoría Vercel, agosto 2026)
- Las fuentes van con `<link>` y `preconnect` en el `<head>`, **nunca con `@import`** dentro del CSS: el `@import` obliga a descargar la hoja completa antes de descubrirlas y retrasa el texto.
- Nada de `transition: all`, se enumeran las propiedades.
- `color-scheme: dark` en `:root` y `<meta name="theme-color">` en todas las páginas: sin eso las barras de desplazamiento y los controles nativos salen claros sobre un sitio oscuro.
- Todo lo enfocable tiene `:focus-visible` visible. Hay enlace de salto al contenido y `scroll-margin-top` para que el encabezado fijo no tape el destino de las anclas.
- El lightbox de la galería es un diálogo: cierra con Escape, bloquea el scroll de fondo y devuelve el foco a la miniatura de origen.

## Caché del CSS y el JS
GitHub Pages sirve todo con `Cache-Control: max-age=600`, así que tras un
despliegue los visitantes recurrentes siguen viendo la hoja de estilos vieja
durante diez minutos. Por eso los enlaces a `style.css` y `script.js` llevan
`?v=` con un hash del contenido del propio archivo.

**Al cambiar cualquiera de los dos hay que regenerar ese hash**, si no el
cambio no llega a quien ya visitó el sitio:

```
python3 - <<'EOF'
import hashlib, re, glob
V = {p: hashlib.sha1(open(p,'rb').read()).hexdigest()[:8] for p in ("css/style.css","js/script.js")}
for f in glob.glob("*.html"):
    s = open(f, encoding="utf-8").read()
    for ruta, h in V.items():
        s = re.sub(r'(["\'])(/?' + re.escape(ruta) + r')(\?v=[0-9a-f]+)?\1',
                   lambda m: f'{m.group(1)}{m.group(2)}?v={h}{m.group(1)}', s)
    open(f, "w", encoding="utf-8").write(s)
EOF
```

## Pendientes que dependen del cliente
- **Número de colegiado del Dr. Hazbun** (Colegio Estomatológico de Guatemala).
  Es la pieza que más pesa y aún falta para una identidad profesional
  verificable en un sitio de salud. Cuando llegue, va en `sobre-nosotros.html`
  y en el JSON-LD de la `Person`.
- **Bing Webmaster Tools**: sin dar de alta. Importa la propiedad directamente desde Google Search Console en un paso. Importa porque es la fuente de índice que alimenta a Copilot y a las búsquedas de ChatGPT.
- **Analítica**: no hay ninguna instalada. La opción que encaja con el cliente es Cloudflare Web Analytics, gratuita, sin cookies y por tanto sin necesidad de banner de consentimiento, y el dominio ya está en Cloudflare.
- **Aviso de privacidad**: redactado a partir de lo que el sitio hace de verdad, conviene que el cliente lo valide antes de darlo por definitivo.
