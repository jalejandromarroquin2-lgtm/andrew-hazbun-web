// Opiniones reales de Google, actualizadas solas.
// Fuente: Featurable (gratis) conectado al Perfil de Empresa de la clínica; Featurable vuelve a leer Google cada ~48 h.
// Si la API no responde, se quedan las opiniones fijas que ya trae el HTML.
(function () {
  var section = document.querySelector('[data-resenas]');
  if (!section) return;
  var id = section.getAttribute('data-featurable-id');
  if (!id) return;

  var MAX = 9;                 // cuántas opiniones mostrar
  var MIN_ESTRELLAS = 4;       // solo 4 y 5 estrellas con texto
  var EXCLUIR = /marroqu|hazbun/i; // conflicto de interés: no mostrar opiniones de la familia del doctor ni del equipo que maneja el sitio
  var CACHE_KEY = 'ahsc_resenas_v2';
  var CACHE_MS = 6 * 60 * 60 * 1000;

  var STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8z"/></svg>';
  var G = '<svg class="g-mark" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"/><path fill="#FBBC05" d="M10.6 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-5 2.3-8.2 2.3-6.2 0-11.5-4.2-13.4-9.8l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function abreviar(nombre) {
    var p = String(nombre || '').trim().split(/\s+/);
    if (!p[0]) return 'Paciente';
    return p.length > 1 ? p[0] + ' ' + p[p.length - 1].charAt(0).toUpperCase() + '.' : p[0];
  }
  function limpiarTexto(t) {
    t = String(t || '');
    var o = t.indexOf('(Original)');
    if (o !== -1) t = t.slice(o + 10);
    t = t.replace(/\(Translated by Google\)[\s\S]*/i, '').replace(/\(Traducido por Google\)[\s\S]*/i, '').replace(/\s+/g, ' ').replace(/\s+([,.!?])/g, '$1').trim();
    if (t.length > 320) t = t.slice(0, 300).replace(/\s+\S*$/, '') + ' […]';
    return t;
  }
  function hace(fecha) {
    var d = new Date(fecha);
    if (isNaN(d)) return '';
    var dias = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (dias < 1) return 'hoy';
    if (dias < 7) return 'hace ' + dias + (dias === 1 ? ' día' : ' días');
    if (dias < 30) { var s = Math.floor(dias / 7); return 'hace ' + s + (s === 1 ? ' semana' : ' semanas'); }
    if (dias < 365) { var m = Math.floor(dias / 30); return 'hace ' + m + (m === 1 ? ' mes' : ' meses'); }
    var a = Math.floor(dias / 365); return 'hace ' + a + (a === 1 ? ' año' : ' años');
  }

  // Acepta respuesta v2 ({widget:{...}}) o v1 ({reviews:[...]}).
  function normalizar(r) {
    if (!r || !r.success) return null;
    if (r.widget) {
      var w = r.widget, s = w.gbpLocationSummary || {};
      return {
        rating: s.rating, total: s.reviewsCount, escribir: s.writeAReviewUri,
        reviews: (w.reviews || []).map(function (x) {
          // originalText = lo que escribió el paciente (text viene traducido al inglés)
          return { nombre: x.author && x.author.name, estrellas: x.rating ? x.rating.value : 0, texto: x.originalText || x.text, fecha: x.publishedAt || x.createdAt };
        })
      };
    }
    return {
      rating: r.averageRating, total: r.totalReviewCount, escribir: r.profileUrl,
      reviews: (r.reviews || []).map(function (x) {
        return { nombre: x.reviewer && x.reviewer.displayName, estrellas: x.starRating, texto: x.comment, fecha: x.createTime };
      })
    };
  }

  function pintar(d) {
    var lista = d.reviews
      .filter(function (x) { return x.estrellas >= MIN_ESTRELLAS && limpiarTexto(x.texto) && !EXCLUIR.test(x.nombre || ''); })
      .sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); })
      .slice(0, MAX);
    if (!lista.length) return;

    // La más completa va primero (tarjeta destacada); el resto, de la más reciente a la más antigua.
    var iLarga = 0;
    lista.forEach(function (x, i) { if (limpiarTexto(x.texto).length > limpiarTexto(lista[iLarga].texto).length) iLarga = i; });
    lista.unshift(lista.splice(iLarga, 1)[0]);

    var track = section.querySelector('.review-track');
    if (track) {
      track.innerHTML = lista.map(function (x, i) {
        var n = abreviar(x.nombre);
        var corto = limpiarTexto(x.texto).length < 70 && i !== 0;
        return '<figure class="review-card' + (i === 0 ? ' review-featured' : '') + (corto ? ' review-short' : '') + '">' +
          '<div class="review-top"><span class="stars" aria-label="' + x.estrellas + ' de 5 estrellas">' + new Array(Math.round(x.estrellas) + 1).join(STAR) + '</span>' + G + '</div>' +
          '<blockquote>“' + esc(limpiarTexto(x.texto)) + '”</blockquote>' +
          '<figcaption><span class="review-avatar" aria-hidden="true">' + esc(n.charAt(0)) + '</span><span><strong>' + esc(n) + '</strong>' +
          '<span class="review-src">Opinión en Google' + (hace(x.fecha) ? ' · ' + hace(x.fecha) : '') + '</span></span></figcaption>' +
          '</figure>';
      }).join('');
      track.scrollLeft = 0;
    }

    var nota = d.rating ? Number(d.rating).toFixed(1) : null;
    document.querySelectorAll('[data-rating-num]').forEach(function (el) { if (nota) el.textContent = nota; });
    document.querySelectorAll('[data-rating-total]').forEach(function (el) {
      if (d.total) el.textContent = d.total + (d.total === 1 ? ' opinión' : ' opiniones');
    });
    if (d.escribir) section.querySelectorAll('[data-escribir]').forEach(function (a) { a.href = d.escribir; });
    section.classList.add('reviews-live');
  }

  var cache = null;
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  if (cache && cache.d) pintar(cache.d);
  if (cache && Date.now() - cache.t < CACHE_MS) return;

  fetch('https://api.featurable.com/v2/widgets/' + encodeURIComponent(id))
    .then(function (r) { return r.json(); })
    .then(function (r) {
      var d = normalizar(r);
      if (!d) return;
      pintar(d);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
    })
    .catch(function () {});
})();

// Flechas del carrusel de opiniones
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-resenas]').forEach(function (sec) {
    var track = sec.querySelector('.review-track');
    sec.querySelectorAll('[data-review-nav]').forEach(function (b) {
      b.addEventListener('click', function () {
        var card = track.querySelector('.review-card');
        var paso = card ? card.getBoundingClientRect().width + 20 : 320;
        track.scrollBy({ left: b.getAttribute('data-review-nav') === 'prev' ? -paso : paso, behavior: 'smooth' });
      });
    });
  });
});
