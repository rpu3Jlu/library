/**
 * reader.js — читалка. Три режима:
 *   • text — книги фонда, набранные текстом: главы, оглавление, размер шрифта, прогресс, PDF;
 *   • pdf  — сканы PDF фонда института:
 *       «Страницы»: заранее отрисованные страницы (работает везде — на телефоне и без сервера),
 *                   миниатюры, плавающая панель (страница, масштаб, «по ширине»), клавиши ← → + −;
 *       «PDF»:      оригинальный файл во встроенном просмотрщике браузера (<iframe>);
 *   • ia   — полные книги Open Library: просмотрщик Internet Archive (<iframe src="https://archive.org/embed/{ia}">).
 * Номер главы/страницы хранится в адресе: #/read/local/<id>/<n>, при листании адрес обновляется без записи в историю.
 */
(function (NS) {
  'use strict';

  const { $, escapeHtml: esc, ICONS, store } = NS.utils;
  const i18n = NS.i18n;
  const { t, L } = i18n;
  const api = NS.api;
  const ui = NS.ui;
  const { GENRES } = NS.config;

  const ZOOMS = [0.5, 0.65, 0.8, 1, 1.25, 1.5, 2];
  const state = {
    mode: null, book: null, chapter: 0, page: 1, iaId: null,
    returnHash: '#/books', fromApp: false, lastFocus: null,
    renderedPdf: null, pageObserver: null, view: store.get('eb-pdf-view', 'pages'),
    zoom: store.get('eb-pdf-zoom', 3), fit: store.get('eb-pdf-fit', true),
  };
  if (!['pages', 'pdf'].includes(state.view)) state.view = 'pages';
  if (!Number.isInteger(state.zoom) || state.zoom < 0 || state.zoom >= ZOOMS.length) state.zoom = 3;
  let fontSize = store.get('eb-fs', 19);
  if (!Number.isInteger(fontSize) || fontSize < 15 || fontSize > 26) fontSize = 19;

  const el = {};

  function init() {
    ['reader', 'rdClose', 'rdSec', 'rdBook', 'fsMinus', 'fsPlus', 'rdPdf', 'rdExternal', 'tocBtn', 'rdProgressBar', 'rdProg',
      'rdBody', 'rdToc', 'rdKicker', 'rdChTitle', 'rdContent', 'rdNav', 'rdFrame', 'rdFoot', 'rdFootText',
      'rdPdfView', 'rdThumbs', 'rdPages', 'rdPagesInner', 'rdNative', 'rdFloat', 'pgPrev', 'pgNext', 'pgInfo',
      'zoomOut', 'zoomIn', 'zoomFit', 'viewSwitch', 'viewPages', 'viewPdf']
      .forEach((id) => { el[id] = $('#' + id); });

    el.rdClose.addEventListener('click', close);
    el.fsMinus.addEventListener('click', () => setFont(fontSize - 1));
    el.fsPlus.addEventListener('click', () => setFont(fontSize + 1));
    el.tocBtn.addEventListener('click', () => {
      const open = el.rdToc.classList.toggle('open');
      el.tocBtn.setAttribute('aria-expanded', String(open));
    });
    el.rdToc.addEventListener('click', (e) => { if (e.target.closest('a')) el.rdToc.classList.remove('open'); });
    // Переходы внутри читалки меняют главу/страницу без записи в историю: «Назад» выводит из читалки.
    el.reader.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#/read/local/"]');
      if (!link || e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      location.replace(link.getAttribute('href'));
    });

    // PDF: навигация, масштаб, режим.
    el.pgPrev.addEventListener('click', () => goPage(state.page - 1));
    el.pgNext.addEventListener('click', () => goPage(state.page + 1));
    el.zoomOut.addEventListener('click', () => setZoom(state.fit ? Math.min(3, ZOOMS.length - 1) - 1 : state.zoom - 1));
    el.zoomIn.addEventListener('click', () => setZoom(state.fit ? 4 : state.zoom + 1));
    el.zoomFit.addEventListener('click', () => setFit(!state.fit));
    el.viewPages.addEventListener('click', () => setView('pages'));
    el.viewPdf.addEventListener('click', () => setView('pdf'));
    el.rdThumbs.addEventListener('click', (e) => {
      const thumb = e.target.closest('[data-thumb]');
      if (thumb) goPage(Number(thumb.dataset.thumb));
    });

    document.addEventListener('keydown', (e) => {
      if (el.reader.hidden || !document.getElementById('bookModal').hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.target.closest('input, textarea, select')) return;
      if (state.mode === 'text') {
        if (e.key === 'ArrowRight' && state.chapter < state.book.chapters.length - 1) goChapter(state.chapter + 1);
        if (e.key === 'ArrowLeft' && state.chapter > 0) goChapter(state.chapter - 1);
      } else if (state.mode === 'pdf' && state.view === 'pages') {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goPage(state.page + 1); }
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goPage(state.page - 1); }
        if (e.key === '+' || e.key === '=') setZoom(state.fit ? 4 : state.zoom + 1);
        if (e.key === '-') setZoom(state.fit ? 2 : state.zoom - 1);
      }
    });
    i18n.onChange(() => { if (!el.reader.hidden) render(); });
  }

  const goChapter = (i) => { location.replace(`#/read/local/${encodeURIComponent(state.book.id)}/${i}`); };

  function setFont(size) {
    fontSize = Math.min(26, Math.max(15, size));
    store.set('eb-fs', fontSize);
    el.rdContent.style.setProperty('--rfs', fontSize + 'px');
  }

  function show({ returnHash, fromApp }) {
    if (el.reader.hidden) {
      state.lastFocus = document.activeElement;
      state.returnHash = returnHash || '#/books';
      state.fromApp = Boolean(fromApp);
      el.reader.hidden = false;
      ui.scrollLock.lock('reader');
      el.rdClose.focus();
    }
  }

  /* ================= Книга фонда: текст или PDF ================= */
  function openLocal(book, pos, opts) {
    if (book.format === 'pdf') { openPdf(book, pos, opts); return; }
    const ch = Math.min(Math.max(0, pos | 0), book.chapters.length - 1);
    const changedBook = state.book !== book || state.mode !== 'text';
    state.mode = 'text';
    state.book = book;
    state.chapter = ch;
    state.iaId = null;
    ui.progress.save(book.id, ch, book.chapters.length);
    show(opts);
    render();
    el.rdBody.scrollTop = 0;
    el.rdToc.classList.remove('open');
    if (changedBook) setFont(fontSize);
  }

  function openPdf(book, pos, opts) {
    const page = Math.min(Math.max(1, pos | 0 || 1), Math.max(1, book.pageCount));
    const sameBook = state.mode === 'pdf' && state.book === book;
    state.mode = 'pdf';
    state.book = book;
    state.iaId = null;
    show(opts);
    if (!sameBook) {
      state.page = page;
      render();
      // Ждём раскладки, затем мгновенно встаём на нужную страницу.
      requestAnimationFrame(() => scrollToPage(page, false));
    } else {
      goPage(page);
    }
    ui.progress.save(book.id, page, book.pageCount);
  }

  /* ================= Полная книга Internet Archive ================= */
  function openArchive(iaId, opts) {
    const links = api.getArchiveLinks(iaId);
    if (!links) return false;
    state.mode = 'ia';
    state.iaId = iaId;
    state.book = ui.findByIa(iaId);
    show(opts);
    render();
    return true;
  }

  function render() {
    const mode = state.mode;
    el.rdBody.hidden = mode !== 'text';
    el.rdProgressBar.hidden = mode === 'ia';
    el.fsMinus.hidden = mode !== 'text';
    el.fsPlus.hidden = mode !== 'text';
    el.tocBtn.hidden = mode !== 'text';
    el.rdFrame.hidden = mode !== 'ia';
    el.rdPdfView.hidden = mode !== 'pdf';
    el.viewSwitch.hidden = mode !== 'pdf';
    el.rdExternal.hidden = mode === 'text';
    el.rdFoot.hidden = mode === 'text';
    if (mode !== 'ia') removeArchiveFrame();
    if (mode === 'text') renderText();
    else if (mode === 'pdf') renderPdf();
    else renderArchive();
  }

  function headerFor(book) {
    const genre = GENRES.find((g) => g.id === book.genre);
    el.rdSec.textContent = (genre ? i18n.genreName(genre) : t('badge.local')) + ' · ' + t('badge.local');
    el.rdBook.textContent = L(book.title);
  }

  /* ---------- Текст ---------- */
  function renderText() {
    const b = state.book;
    const ch = state.chapter;
    const n = b.chapters.length;
    const chapter = b.chapters[ch];
    headerFor(b);
    const pdf = ui.localPdf(b);
    el.rdPdf.hidden = !pdf;
    if (pdf) { el.rdPdf.href = pdf; el.rdPdf.setAttribute('download', ''); el.rdPdf.removeAttribute('target'); }

    el.rdProg.style.width = ((ch + 1) / n) * 100 + '%';
    el.rdKicker.textContent = t('rd.chapter', { i: ch + 1, n });
    el.rdChTitle.textContent = L(chapter.title);

    const blocks = chapter.content[i18n.lang] && chapter.content[i18n.lang].length ? chapter.content[i18n.lang] : chapter.content.ru;
    let first = true;
    el.rdContent.innerHTML = blocks.map((block) => {
      if (block && typeof block === 'object' && typeof block.code === 'string') return `<pre><code>${esc(block.code)}</code></pre>`;
      const cls = first ? ' class="first"' : '';
      first = false;
      return `<p${cls}>${esc(block)}</p>`;
    }).join('');

    const done = (ui.progress.get(b.id) || { max: -1 }).max;
    el.rdToc.innerHTML = `<h4>${esc(t('rd.toc'))}</h4>` + b.chapters.map((c, i) => {
      const cls = [i === ch ? 'active' : '', i <= done && i !== ch ? 'done' : ''].join(' ').trim();
      return `<a href="#/read/local/${encodeURIComponent(b.id)}/${i}" class="${cls}"${i === ch ? ' aria-current="page"' : ''}><i>${i <= done && i !== ch ? '✓' : i + 1}</i><span>${esc(L(c.title))}</span></a>`;
    }).join('');

    let nav = ch > 0
      ? `<a class="btn btn-outline" href="#/read/local/${encodeURIComponent(b.id)}/${ch - 1}">${ICONS.arrowL}<span>${esc(t('rd.prev'))}</span></a>`
      : '<span></span>';
    if (ch < n - 1) {
      nav += `<a class="btn btn-red" href="#/read/local/${encodeURIComponent(b.id)}/${ch + 1}"><span>${esc(t('rd.next'))}: ${esc(L(b.chapters[ch + 1].title))}</span>${ICONS.arrow}</a>`;
    } else {
      nav += `<div class="rd-end"><b>🎓 ${esc(t('rd.end'))}</b><button type="button" class="btn btn-red btn-sm" data-rd="back">${esc(t('rd.back'))}</button></div>`;
    }
    el.rdNav.innerHTML = nav;
    const back = el.rdNav.querySelector('[data-rd="back"]');
    if (back) back.addEventListener('click', close);
  }

  /* ---------- PDF ---------- */
  function renderPdf() {
    const b = state.book;
    headerFor(b);
    const pdf = ui.localPdf(b);
    el.rdPdf.hidden = !pdf;
    el.rdExternal.hidden = !pdf;
    if (pdf) {
      el.rdPdf.href = pdf;
      el.rdPdf.setAttribute('download', '');
      el.rdPdf.removeAttribute('target');
      el.rdExternal.href = pdf;
      el.rdExternal.setAttribute('aria-label', t('act.openPdf'));
      el.rdExternal.title = t('act.openPdf');
    }
    // Без отрисованных страниц доступен только оригинальный PDF.
    const hasPages = ui.hasPageImages(b);
    el.viewPages.hidden = !hasPages;
    el.viewPdf.hidden = !pdf;
    el.viewSwitch.hidden = !hasPages || !pdf; // переключатель нужен, только когда есть оба режима
    const view = !hasPages ? 'pdf' : !pdf ? 'pages' : state.view;
    el.viewPages.setAttribute('aria-pressed', String(view === 'pages'));
    el.viewPdf.setAttribute('aria-pressed', String(view === 'pdf'));
    el.viewPages.lastElementChild.textContent = t('rd.viewPages');
    el.viewPdf.lastElementChild.textContent = t('rd.viewPdf');

    if (state.renderedPdf !== b.id) {
      state.renderedPdf = b.id;
      buildPages(b);
    }
    el.rdPages.hidden = view !== 'pages';
    el.rdThumbs.hidden = view !== 'pages';
    el.rdFloat.hidden = view !== 'pages';
    el.rdNative.hidden = view !== 'pdf';
    if (view === 'pdf') showNative(); else removeNative();

    el.rdFootText.textContent = view === 'pdf' ? t('rd.pdfHint') : (b.fragment ? t('rd.fragmentNote', { n: b.pageCount }) : '');
    el.rdFoot.hidden = !el.rdFootText.textContent;
    applyZoom(false);
    updatePageUi();
  }

  function buildPages(b) {
    if (state.pageObserver) state.pageObserver.disconnect();
    const n = b.pageCount;
    el.rdPagesInner.innerHTML = Array.from({ length: n }, (_, i) => {
      const p = i + 1;
      return `<figure class="pg" id="pg-${p}" data-page="${p}" style="aspect-ratio:1/${b.ratios[i]}">
        <img src="${esc(ui.pageImage(b, p))}" alt="${esc(L(b.title))} — ${esc(ui.hitLabel(b, p))}" ${p > 2 ? 'loading="lazy"' : ''} decoding="async">
        <figcaption>${p} / ${n}</figcaption></figure>`;
    }).join('');
    el.rdThumbs.innerHTML = `<h4>${esc(t('rd.thumbs'))}</h4>` + Array.from({ length: n }, (_, i) => `
      <button type="button" class="thumb" data-thumb="${i + 1}" aria-label="${esc(ui.hitLabel(b, i + 1))}">
        <span style="aspect-ratio:1/${b.ratios[i]}"><img src="${esc(ui.pageImage(b, i + 1))}" alt="" loading="lazy" decoding="async"></span><small>${i + 1}</small></button>`).join('');

    // Текущая страница = та, что занимает больше всего места на экране.
    const visible = new Map();
    state.pageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(Number(entry.target.dataset.page), entry.intersectionRatio));
      let best = state.page;
      let bestRatio = -1;
      visible.forEach((ratio, page) => { if (ratio > bestRatio) { bestRatio = ratio; best = page; } });
      if (bestRatio > 0 && best !== state.page && !state.scrollingTo) setCurrentPage(best);
    }, { root: el.rdPages, threshold: [0, 0.25, 0.5, 0.75, 1] });
    el.rdPagesInner.querySelectorAll('.pg').forEach((fig) => state.pageObserver.observe(fig));
  }

  function setCurrentPage(page) {
    state.page = page;
    updatePageUi();
    ui.progress.save(state.book.id, page, state.book.pageCount);
    history.replaceState(null, '', `#/read/local/${encodeURIComponent(state.book.id)}/${page}`);
  }

  function updatePageUi() {
    const b = state.book;
    if (!b || state.mode !== 'pdf') return;
    el.pgInfo.textContent = t('rd.page', { i: state.page, n: b.pageCount });
    el.pgPrev.disabled = state.page <= 1;
    el.pgNext.disabled = state.page >= b.pageCount;
    el.rdProg.style.width = (state.page / b.pageCount) * 100 + '%';
    el.rdThumbs.querySelectorAll('.thumb').forEach((th) => {
      const on = Number(th.dataset.thumb) === state.page;
      th.classList.toggle('active', on);
      if (on) th.setAttribute('aria-current', 'page'); else th.removeAttribute('aria-current');
    });
    const active = el.rdThumbs.querySelector('.thumb.active');
    if (active && !el.rdThumbs.hidden) {
      const top = active.offsetTop - el.rdThumbs.clientHeight / 2 + active.offsetHeight / 2;
      el.rdThumbs.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function scrollToPage(page, smooth = true) {
    const fig = document.getElementById('pg-' + page);
    if (!fig) return;
    state.scrollingTo = true;
    el.rdPages.scrollTo({ top: fig.offsetTop - 16, behavior: smooth ? 'smooth' : 'auto' });
    clearTimeout(state.scrollTimer);
    state.scrollTimer = setTimeout(() => { state.scrollingTo = false; }, smooth ? 700 : 60);
  }

  function goPage(page) {
    const b = state.book;
    if (!b || state.mode !== 'pdf') return;
    const p = Math.min(Math.max(1, page), b.pageCount);
    setCurrentPage(p);
    if (state.view === 'pdf' || !ui.hasPageImages(b)) showNative(true);
    else scrollToPage(p);
  }

  function applyZoom(keepPage = true) {
    el.rdPagesInner.style.setProperty('--pg-max', state.fit ? '100%' : Math.round(ZOOMS[state.zoom] * 820) + 'px');
    el.zoomFit.setAttribute('aria-pressed', String(state.fit));
    el.zoomOut.disabled = !state.fit && state.zoom <= 0;
    el.zoomIn.disabled = !state.fit && state.zoom >= ZOOMS.length - 1;
    if (keepPage) requestAnimationFrame(() => scrollToPage(state.page, false));
  }
  function setZoom(index) {
    state.fit = false;
    state.zoom = Math.min(ZOOMS.length - 1, Math.max(0, index));
    store.set('eb-pdf-zoom', state.zoom);
    store.set('eb-pdf-fit', false);
    applyZoom();
  }
  function setFit(on) {
    state.fit = on;
    store.set('eb-pdf-fit', on);
    applyZoom();
  }

  function setView(view) {
    state.view = view;
    store.set('eb-pdf-view', view);
    renderPdf();
    if (view === 'pages') requestAnimationFrame(() => scrollToPage(state.page, false));
  }

  /** Оригинальный PDF во встроенном просмотрщике браузера; #page= открывает нужную страницу. */
  function showNative(force = false) {
    const pdf = ui.localPdf(state.book);
    if (!pdf) return;
    const src = `${pdf}#page=${state.page}&view=FitH`;
    let frame = el.rdNative.querySelector('iframe');
    if (frame && !force && frame.dataset.book === state.book.id) return;
    if (frame) frame.remove();
    frame = document.createElement('iframe');
    frame.dataset.book = state.book.id;
    frame.title = L(state.book.title);
    frame.src = src;
    el.rdNative.appendChild(frame);
  }
  function removeNative() {
    const frame = el.rdNative.querySelector('iframe');
    if (frame) frame.remove();
  }

  /* ---------- Internet Archive ---------- */
  function renderArchive() {
    const links = api.getArchiveLinks(state.iaId);
    const b = state.book;
    el.rdSec.textContent = 'Internet Archive · ' + t('badge.full');
    el.rdBook.textContent = b ? ui.bookTitle(b) + (b.authors && b.authors.length ? ' — ' + b.authors[0] : '') : t('rd.iaFallback');
    el.rdPdf.hidden = false;
    el.rdPdf.href = links.pdf;
    el.rdPdf.removeAttribute('download');
    el.rdPdf.setAttribute('target', '_blank');
    el.rdExternal.href = links.details;
    el.rdExternal.setAttribute('aria-label', t('act.archive'));
    el.rdExternal.title = t('act.archive');
    el.rdFootText.textContent = t('rd.iaNote');
    el.rdFoot.hidden = false;

    // Пересоздаём iframe только при смене книги (смена языка не перезагружает просмотрщик).
    let frame = el.rdFrame.querySelector('iframe');
    if (!frame || frame.dataset.ia !== state.iaId) {
      if (frame) frame.remove();
      el.rdFrame.classList.remove('loaded');
      frame = document.createElement('iframe');
      frame.dataset.ia = state.iaId;
      frame.src = links.embed;
      frame.title = el.rdBook.textContent;
      frame.allow = 'fullscreen';
      frame.setAttribute('allowfullscreen', '');
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      // sandbox не даёт встроенной странице перенаправить наш сайт
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms');
      frame.addEventListener('load', () => el.rdFrame.classList.add('loaded'));
      el.rdFrame.appendChild(frame);
    }
  }
  function removeArchiveFrame() {
    const frame = el.rdFrame.querySelector('iframe');
    if (frame) frame.remove();
  }

  function close() {
    if (el.reader.hidden) return;
    // Если пришли в читалку изнутри сайта — возвращаемся назад по истории,
    // иначе (открыли ссылку напрямую) — в каталог без лишней записи в истории.
    if (state.fromApp && history.length > 1) history.back();
    else location.replace(state.returnHash);
  }

  /** Вызывается роутером при уходе со страницы читалки. */
  function hide() {
    if (el.reader.hidden) return;
    el.reader.hidden = true;
    el.rdToc.classList.remove('open');
    removeArchiveFrame();
    removeNative();
    if (state.pageObserver) state.pageObserver.disconnect();
    state.renderedPdf = null;
    el.rdPagesInner.innerHTML = '';
    el.rdThumbs.innerHTML = '';
    state.mode = null;
    ui.scrollLock.unlock('reader');
    if (state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus();
  }

  NS.reader = { init, openLocal, openArchive, hide, isOpen: () => !el.reader.hidden };
})(window.SPBU = window.SPBU || {});
