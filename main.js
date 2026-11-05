/*
  Miguel Angel Quiroz, portfolio scripts.
  Plain JavaScript with no build step. The page works without it; this file adds
  the theme switch, the phone menu, the label tilt, Copy email and the projects list.
*/
(function () {
  'use strict';

  var root = document.documentElement;
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var EMAIL = 'miguelqu0507@gmail.com';

  /* Theme. Follows the visitor's system setting until they choose one with the button. */
  function currentTheme() {
    var chosen = root.getAttribute('data-theme');
    if (chosen === 'light' || chosen === 'dark') return chosen;
    return prefersDark.matches ? 'dark' : 'light';
  }

  function syncTheme() {
    var dark = currentTheme() === 'dark';
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#1C2126' : '#E3E7EA');
  }

  document.querySelectorAll('.theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private browsing */ }
      syncTheme();
    });
  });
  if (prefersDark.addEventListener) prefersDark.addEventListener('change', syncTheme);
  syncTheme();

  /* Phone menu */
  var header = document.querySelector('.top');
  var menuBtn = document.querySelector('.menu-btn');
  if (header && menuBtn) {
    var closeMenu = function () {
      header.classList.remove('menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    };
    menuBtn.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.querySelectorAll('.nav a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('menu-open')) {
        closeMenu();
        menuBtn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('menu-open') && !header.contains(e.target)) closeMenu();
    });
  }

  /* The 3D label tilts toward the pointer. Touch screens get a slow sway from CSS instead. */
  var scene = document.querySelector('.scene');
  if (scene && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var frame = 0;
    scene.addEventListener('pointermove', function (e) {
      if (reduceMotion.matches) return;
      var box = scene.getBoundingClientRect();
      var x = Math.max(-0.5, Math.min(0.5, (e.clientX - box.left) / box.width - 0.5));
      var y = Math.max(-0.5, Math.min(0.5, (e.clientY - box.top) / box.height - 0.5));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        var s = scene.style;
        s.setProperty('--ry', (-8 + x * 30).toFixed(2) + 'deg');
        s.setProperty('--rx', (6 - y * 18).toFixed(2) + 'deg');
        s.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
        s.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
        s.setProperty('--px', x.toFixed(3));
        s.setProperty('--py', y.toFixed(3));
      });
    });
    scene.addEventListener('pointerleave', function () {
      cancelAnimationFrame(frame);
      ['--ry', '--rx', '--mx', '--my', '--px', '--py'].forEach(function (name) {
        scene.style.removeProperty(name);
      });
    });
  }

  /* Pause the label's looping animations while it is scrolled out of view. */
  if (scene && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        scene.classList.toggle('is-offscreen', !entry.isIntersecting);
      });
    }).observe(scene);
  }

  /* Copy email */
  document.querySelectorAll('[data-copy-email]').forEach(function (btn) {
    var label = btn.querySelector('[data-label]') || btn;
    var original = label.textContent;
    var timer = 0;
    function show(text) {
      label.textContent = text;
      clearTimeout(timer);
      timer = setTimeout(function () { label.textContent = original; }, 2400);
    }
    btn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(function () { show('Copied'); }, function () { show(EMAIL); });
      } else {
        show(EMAIL);
      }
    });
  });

  /* Projects. Only entries in projects.js with published: true are shown. */
  var projects = (Array.isArray(window.PROJECTS) ? window.PROJECTS : []).filter(function (p) {
    return p && p.published === true && p.title;
  });
  var section = document.getElementById('projects');
  var list = section && section.querySelector('[data-projects]');
  if (section && list && projects.length) {
    projects.forEach(function (p) { list.appendChild(projectCard(p)); });
    section.hidden = false;
    document.querySelectorAll('[data-projects-link]').forEach(function (item) { item.hidden = false; });
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function safeUrl(url) {
    if (typeof url !== 'string' || !url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) return url;
    return '';
  }

  function projectCard(p) {
    var card = make('article', 'project');
    var image = safeUrl(p.image);
    if (image) {
      var img = document.createElement('img');
      img.src = image;
      img.alt = p.imageAlt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      card.appendChild(img);
    }
    card.appendChild(make('h3', '', p.title));
    if (p.summary) card.appendChild(make('p', '', p.summary));
    if (Array.isArray(p.built) && p.built.length) {
      var built = make('ul', 'built');
      p.built.forEach(function (item) { built.appendChild(make('li', '', item)); });
      card.appendChild(built);
    }
    if (Array.isArray(p.tech) && p.tech.length) {
      var tech = make('ul', 'tech');
      tech.setAttribute('aria-label', 'Built with');
      p.tech.forEach(function (item) { tech.appendChild(make('li', '', item)); });
      card.appendChild(tech);
    }
    var links = make('div', 'links');
    var code = safeUrl(p.code);
    var demo = safeUrl(p.demo);
    if (code) links.appendChild(linkTo(code, 'View the code', 'p-code', 'View the code for ' + p.title));
    if (demo) links.appendChild(linkTo(demo, 'Try it live', 'p-demo', 'Try ' + p.title + ' live'));
    if (links.childNodes.length) card.appendChild(links);
    return card;
  }

  function linkTo(href, text, className, label) {
    var a = make('a', className, text);
    a.href = href;
    a.setAttribute('aria-label', label);
    return a;
  }

  /* Keep the footer year current. */
  document.querySelectorAll('[data-year]').forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();
