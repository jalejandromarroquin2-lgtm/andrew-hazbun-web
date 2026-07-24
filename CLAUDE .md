# Clínica Dental Anre - Notas del Proyecto

## Estilo y Diseño
- **Estilo**: Clínico, de alta gama, limpio y elegante. Fondo blanco/negro de lujo.
- **Tipografía**: Letras altamente legibles, limpias y profesionales.
- **Imágenes**: Formato horizontal (16:9) para secciones hero o fondos grandes. Formato cuadrado o vertical para tarjetas de servicios.

## Estructura del Sitio Local
El sitio web está compuesto por los siguientes archivos HTML:
- `index.html` (Página principal)
- `servicios.html`
- `galeria.html`
- `contacto.html`
- `sobre-nosotros.html`

## Reglas para Claude
- Lee siempre este archivo antes de proponer cambios de código.
- Mantén consistencia en los colores y fuentes en todas las páginas.
- No alteres las rutas de las carpetas `css/`, `images/` o `js/`.

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

## Manejo de imágenes (lecciones aprendidas)
- Las fotos del celular del cliente suelen traer una etiqueta EXIF de orientación que `sips -g orientation` no reporta bien. Usar `PIL.ImageOps.exif_transpose()` o `sips --resampleHeightWidthMax` directo sobre el original, nunca rotar manualmente con `sips -r` y luego redimensionar, eso causa doble rotación.
- Si una imagen ya procesada aparece de lado en el navegador pero se ve bien con el visor local, revisar con `python3 -c "from PIL import Image; print(Image.open('...').getexif().get(274))"`, si hay un tag de orientación viejo, hay que limpiarlo (recomprimir sin EXIF) sin rotar los píxeles de nuevo.
- Evitar cutouts PNG con fondo removido si se puede usar una foto real igual de buena, los recortes con IA casi siempre dejan artefactos blancos difíciles de limpiar del todo.

## Pendientes / contexto de negocio
- Google Business Profile: en proceso de creación/verificación por el cliente.
- Facebook e Instagram: ya reconectados entre sí (esto lo resolvió el cliente directamente en Meta, no algo que Claude gestione).
- Correo con dominio propio (`@andrewhazbun.com`): se recomendó Cloudflare Email Routing (gratis) + alias "enviar como" en Gmail existente, pendiente de que el cliente lo active.
- El cliente es sensible al costo, prioriza siempre la opción gratuita o más económica disponible antes que una de pago.
