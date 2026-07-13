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
        lightboxImg.src = trigger.getAttribute('href');
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', function () {
      lightbox.classList.remove('open');
      lightboxImg.src = '';
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
