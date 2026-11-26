// Google Analytics 4 (G-M2LR423MPY). Se carga desde aquí para no repetirlo en cada página.
(function () {
  var GA_ID = 'G-M2LR423MPY';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  // Contactos: clics en WhatsApp y en el teléfono (se marcan como eventos clave en GA).
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var where = location.pathname.replace(/^\//, '') || 'index.html';
    if (href.indexOf('wa.me/') !== -1 || href.indexOf('api.whatsapp.com') !== -1) {
      window.gtag('event', 'clic_whatsapp', { pagina: where, transport_type: 'beacon' });
    } else if (href.indexOf('tel:') === 0) {
      window.gtag('event', 'clic_telefono', { pagina: where, transport_type: 'beacon' });
    }
  }, true);
})();

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  var header = document.querySelector('.site-header');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
      toggle.textContent = expanded ? '✕' : '☰';
      if (expanded && header) header.classList.remove('header-hidden');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  // Auto-hide header on scroll down, reveal on scroll up
  if (header) {
    var lastY = window.scrollY;
    var revealThreshold = header.offsetHeight;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        var navOpen = nav && nav.classList.contains('open');
        if (!navOpen) {
          if (y > lastY && y > revealThreshold) {
            header.classList.add('header-hidden');
          } else if (y < lastY) {
            header.classList.remove('header-hidden');
          }
        }
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  }

  // Lightbox for gallery
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    document.querySelectorAll('[data-lightbox]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        lastTrigger = trigger;
        lightboxImg.src = trigger.getAttribute('href');
        lightboxImg.alt = (trigger.querySelector('img') || {}).alt || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        var cerrar = lightbox.querySelector('.lightbox-close');
        if (cerrar) cerrar.focus();
      });
    });
    var lastTrigger = null;
    function closeLightbox() {
      if (!lightbox.classList.contains('open')) return;
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      document.body.style.overflow = '';
      if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
    }
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Scroll reveal animations
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }
});

// En celular, los botones flotantes de llamar/WhatsApp aparecen al bajar del primer pantallazo
// (arriba ya están en el encabezado y en el hero; así no tapan el texto de entrada).
(function () {
  var f = document.querySelector('.float-contact');
  if (!f || !window.matchMedia) return;
  var mq = window.matchMedia('(max-width: 900px)');
  f.style.transition = 'opacity .3s ease, transform .3s ease';
  function upd() {
    var ocultar = mq.matches && window.scrollY < window.innerHeight * 0.75;
    f.style.opacity = ocultar ? '0' : '';
    f.style.transform = ocultar ? 'translateY(16px)' : '';
    f.style.pointerEvents = ocultar ? 'none' : '';
  }
  window.addEventListener('scroll', upd, { passive: true });
  if (mq.addEventListener) mq.addEventListener('change', upd);
  upd();
})();
