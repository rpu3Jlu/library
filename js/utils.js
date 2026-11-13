/**
 * utils.js — общие помощники: выборка DOM, экранирование HTML, debounce,
 * безопасная работа с localStorage, иконки и горизонтальная лента с прокруткой.
 */
(function (NS) {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* ---------- Защита от XSS: всё, что пришло извне, выводим только через escapeHtml ---------- */
  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' };
  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"'`]/g, (ch) => HTML_ESCAPES[ch]);
  }

  /** Подсвечивает слова запроса. Текст режется ДО экранирования, поэтому разметку не сломать. */
  function highlight(text, query) {
    const raw = String(text ?? '');
    const words = String(query || '')
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 1)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!words.length) return escapeHtml(raw);
    const re = new RegExp('(' + words.join('|') + ')', 'gi');
    return raw
      .split(re)
      .map((part, i) => (i % 2 ? '<mark>' + escapeHtml(part) + '</mark>' : escapeHtml(part)))
      .join('');
  }

  function debounce(fn, ms) {
    let timer = null;
    let lastArgs = [];
    function debounced(...args) {
      lastArgs = args;
      clearTimeout(timer);
      timer = setTimeout(() => { timer = null; fn(...lastArgs); }, ms);
    }
    debounced.cancel = () => { clearTimeout(timer); timer = null; };
    return debounced;
  }

  /** localStorage может быть недоступен (приватный режим, запрет cookies) — не падаем. */
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* игнорируем */ }
    },
  };

  const clampInt = (value, min, max, fallback) => {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };
  const capitalize = (s) => String(s || '').replace(/^\p{L}/u, (c) => c.toUpperCase());
  const formatNumber = (n) => Number(n || 0).toLocaleString('ru-RU');

  /* ---------- Иконки (stroke = currentColor, поэтому красятся через CSS color) ---------- */
  const svg = (paths, extra = '') =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${paths}</svg>`;

  const ICONS = {
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
    chart: svg('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-7"/><path d="M15 7h5v5"/>'),
    code: svg('<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>'),
    scale: svg('<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>'),
    book: svg('<path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>'),
    flask: svg('<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>'),
    globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    brain: svg('<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h0a3 3 0 0 1-3-3"/>'),
    palette: svg('<path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 21 9.8C21 6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>'),
    heart: svg('<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>'),
    cpu: svg('<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/>'),
    grid: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    home: svg('<path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
    phone: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
    pin: svg('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    layers: svg('<path d="M12 2l10 6-10 6L2 8z"/><path d="M2 16l10 6 10-6"/>'),
    calendar: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>'),
    download: svg('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
    external: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    arrowL: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    chevL: svg('<path d="M15 18l-6-6 6-6"/>'),
    chevR: svg('<path d="M9 18l6-6-6-6"/>'),
    close: svg('<path d="M18 6L6 18M6 6l12 12"/>'),
    filter: svg('<path d="M4 6h16M7 12h10M10 18h4"/>'),
    check: svg('<path d="M5 12l5 5L20 7"/>'),
    lock: svg('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    alert: svg('<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'),
    wifiOff: svg('<path d="M2 2l20 20M8.5 16.4a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 5.2-2.7M19 12.9a10 10 0 0 0-2.2-1.6M1.4 9a15 15 0 0 1 4.3-2.6M22.6 9A15 15 0 0 0 11 5M12 20h.01"/>'),
    refresh: svg('<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>'),
    list: svg('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
    user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    medal: svg('<circle cx="12" cy="15" r="6"/><path d="M8.5 10L6 2h4l2 5 2-5h4l-2.5 8"/>'),
    target: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
    diploma: svg('<path d="M22 10L12 5 2 10l10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>'),
    city: svg('<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M9 11h.01M15 11h.01"/>'),
    swipe: svg('<path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/>'),
    minus: svg('<path d="M5 12h14"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    expand: svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    star: svg('<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>'),
    camera: svg('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),
        sparkle: svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
  };

  /**
   * Горизонтальная лента (жанры, полки с книгами):
   *  - колесо мыши крутит ленту вбок, пока ей есть куда ехать, потом отдаёт прокрутку странице;
   *  - мышью можно тянуть ленту; на телефоне работает обычный свайп;
   *  - стрелки «назад/вперёд» и затухание краёв показывают, что есть ещё карточки.
   * Ожидаемая разметка: .hs > (.hs-track + [data-hs="prev"] + [data-hs="next"])
   */
  function enhanceHScroll(root) {
    const track = root && root.querySelector('.hs-track');
    if (!track || track.dataset.hsReady) return;
    track.dataset.hsReady = '1';
    const prev = root.querySelector('[data-hs="prev"]');
    const next = root.querySelector('[data-hs="next"]');

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 2;
      const atEnd = track.scrollLeft >= max - 2;
      root.classList.toggle('can-left', max > 2 && !atStart);
      root.classList.toggle('can-right', max > 2 && !atEnd);
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd || max <= 2;
    };
    track.addEventListener('scroll', update, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
    window.addEventListener('load', update);
    update();

    // Привязка к карточкам (scroll-snap) мешает плавной прокрутке колесом — на время прокрутки отключаем её.
    let snapTimer = null;
    const pauseSnap = () => {
      track.style.scrollSnapType = 'none';
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => { track.style.scrollSnapType = ''; }, 220);
    };

    track.addEventListener('wheel', (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return; // тачпад уже листает вбок
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 2) return;
      const forward = e.deltaY > 0;
      if ((forward && track.scrollLeft >= max - 1) || (!forward && track.scrollLeft <= 1)) return;
      e.preventDefault();
      pauseSnap();
      const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
      track.scrollLeft += delta * 1.15;
    }, { passive: false });

    // Перетаскивание мышью. Касания не трогаем — у них нативная прокрутка.
    let drag = null;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false, id: e.pointerId };
    });
    track.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        try { track.setPointerCapture(drag.id); } catch (err) { /* ignore */ }
        track.classList.add('dragging');
        track.style.scrollSnapType = 'none';
      }
      if (drag.moved) track.scrollLeft = drag.left - dx;
    });
    const endDrag = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      track.classList.remove('dragging');
      track.style.scrollSnapType = '';
      if (moved) {
        track.dataset.justDragged = '1';
        setTimeout(() => { delete track.dataset.justDragged; }, 60);
      }
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    // После перетаскивания браузер шлёт click — гасим его, чтобы не открыть карточку случайно.
    track.addEventListener('click', (e) => {
      if (track.dataset.justDragged) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    track.addEventListener('dragstart', (e) => e.preventDefault());

    const step = (dir) => track.scrollBy({ left: dir * Math.max(240, track.clientWidth * 0.8), behavior: 'smooth' });
    if (prev) prev.addEventListener('click', () => step(-1));
    if (next) next.addEventListener('click', () => step(1));
  }

  /** Запускает «проявление» блоков при прокрутке. */
  let revealObserver = null;
  function observeReveal(root = document) {
    const items = $$('.reveal:not(.in)', root);
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reduce) { items.forEach((el) => el.classList.add('in')); return; }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    }
    items.forEach((el) => revealObserver.observe(el));
  }

  NS.utils = { $, $$, escapeHtml, highlight, debounce, store, clampInt, capitalize, formatNumber, ICONS, enhanceHScroll, observeReveal };
})(window.SPBU = window.SPBU || {});
