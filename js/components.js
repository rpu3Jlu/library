/**
 * components.js — общие элементы интерфейса:
 * карточка книги, обложка с заглушкой, значки доступа, скелетоны, состояния
 * («ничего не найдено», ошибка) и окно «Подробнее о книге».
 *
 * Правило безопасности: любые данные книги попадают в HTML только через esc()/highlight()/markup().
 * Ссылки собираются из проверенных идентификаторов (api.getArchiveLinks / getOpenLibraryUrl).
 */
(function (NS) {
  'use strict';

  const { $, escapeHtml: esc, highlight, ICONS, store } = NS.utils;
  const i18n = NS.i18n;
  const { t, L } = i18n;
  const api = NS.api;
  const { GENRES } = NS.config;

  /* ---------- Блокировка прокрутки страницы (окно и читалка могут быть открыты одновременно) ---------- */
  const scrollOwners = new Set();
  const scrollLock = {
    lock(owner) { scrollOwners.add(owner); document.body.style.overflow = 'hidden'; },
    unlock(owner) { scrollOwners.delete(owner); if (!scrollOwners.size) document.body.style.overflow = ''; },
  };

  /* ---------- Прогресс чтения книг фонда ----------
   * Книги-тексты: позиция = номер главы с 0. PDF-книги: позиция = номер страницы с 1. */
  const progress = {
    all() { const p = store.get('eb-progress', {}); return p && typeof p === 'object' ? p : {}; },
    get(id) { return this.all()[id] || null; },
    save(id, pos, total) {
      const all = this.all();
      const prev = all[id] || { max: -1, last: 0 };
      all[id] = { max: Math.max(prev.max, pos), last: pos, total, at: Date.now() };
      store.set('eb-progress', all);
    },
    percent(book) {
      const p = this.get(book.id);
      if (!p) return 0;
      const done = book.format === 'pdf' ? p.max / Math.max(1, book.pageCount) : (p.max + 1) / Math.max(1, book.chapters.length);
      return Math.min(100, Math.max(0, Math.round(done * 100)));
    },
  };

  /* ---------- Реестр книг: карточка хранит только uid, объект книги лежит здесь ---------- */
  const registry = new Map();
  const register = (book) => { registry.set(book.uid, book); return book.uid; };
  const getBook = (uid) => registry.get(uid);
  const findByIa = (iaId) => {
    for (const book of registry.values()) if (book.ia && book.ia.includes(iaId)) return book;
    return null;
  };

  /** Результаты поиска по фонду: uid → { pages, matched } — для фрагментов в карточке и окне. */
  let searchContext = new Map();
  let searchMatched = new Set();
  function setSearchContext(map, matched) { searchContext = map || new Map(); searchMatched = matched || new Set(); }

  /* ---------- Данные книги в едином виде ---------- */
  const bookTitle = (b) => (b.source === 'local' ? L(b.title) : b.title);
  const bookAuthors = (b) => (b.source === 'local' ? L(b.author) : b.authors.join(', ')) || t('meta.noAuthor');
  const firstIa = (b) => (b.ia && b.ia[0]) || null;
  const isPdfBook = (b) => b.source === 'local' && b.format === 'pdf';

  /** local | full | fragment | none */
  function accessKind(b) {
    if (b.source === 'local') return 'local';
    if (b.access === 'public' && firstIa(b)) return 'full';
    if (b.access === 'borrowable' || b.access === 'printdisabled') return 'fragment';
    return 'none';
  }

  /** Номер жанра для цвета обложки: по полю genre, по подсказке раздела или по темам книги. */
  function genreIndex(b, hintGenreId) {
    const byId = (id) => GENRES.findIndex((g) => g.id === id);
    if (b.source === 'local') return byId(b.genre);
    if (hintGenreId) { const i = byId(hintGenreId); if (i !== -1) return i; }
    const subjects = (b.subjects || []).map((s) => s.toLowerCase());
    return GENRES.findIndex((g) => [g.subject].concat(g.subs).some((s) => subjects.includes(s)));
  }

  function localPdf(b) {
    if (!b.pdf) return null;
    return typeof b.pdf === 'string' ? b.pdf : b.pdf[i18n.lang] || b.pdf.ru;
  }
  function readLocalHref(b, at) {
    const saved = progress.get(b.id);
    const pos = at !== undefined ? at : saved ? saved.last : b.format === 'pdf' ? 1 : 0;
    return `#/read/local/${encodeURIComponent(b.id)}/${pos}`;
  }
  const pageImage = (b, n) => (b.pageImages ? b.pageImages[n - 1] : b.pagesDir ? `${b.pagesDir}/${n}.jpg` : null);
  const hasPageImages = (b) => Boolean(b.pageImages || b.pagesDir);
  const hitLabel = (b, n) => t(b.format === 'pdf' ? 'hit.page' : 'hit.chapter', { n });
  const hitPos = (b, n) => (b.format === 'pdf' ? n : n - 1); // главы в адресе считаются с 0

  /* ---------- Обложка ---------- */
  function coverHtml(b, { size = 'M', hint = '', large = false } = {}) {
    const gi = genreIndex(b, hint);
    const genre = GENRES[gi];
    const cls = gi >= 0 ? `cv-g${gi % 6}` : 'cv-gx';
    const label = genre ? i18n.genreName(genre) : 'Open Library';
    const icon = ICONS[(genre && genre.icon) || 'book'] || ICONS.book;
    const author = b.source === 'local' ? L(b.author) : (b.authors[0] || '');
    const url = b.source === 'ol' ? api.getCoverUrl(b.coverId, size) : b.cover || null;
    return `<div class="cover${large ? ' cover-lg' : ''}${url && b.source === 'local' ? ' cover-real' : ''}">
      <div class="cv-ph ${cls}" aria-hidden="true">
        <span class="cv-ph-sec">${icon}${esc(label)}</span>
        <span class="cv-ph-title">${esc(bookTitle(b))}</span>
        <span class="cv-ph-line"></span>
        <span class="cv-ph-author">${esc(author)}</span>
      </div>
      ${url ? `<img class="cv-img" src="${esc(url)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">` : ''}
    </div>`;
  }

  /* ---------- Значки ---------- */
  function badgeHtml(kind) {
    switch (kind) {
      case 'local': return `<span class="badge b-local">${ICONS.book}${esc(t('badge.local'))}</span>`;
      case 'full': return `<span class="badge b-full">${ICONS.check}${esc(t('badge.full'))}</span>`;
      case 'fragment': return `<span class="badge b-fragment">${ICONS.lock}${esc(t('badge.fragment'))}</span>`;
      default: return `<span class="badge b-none">${esc(t('badge.none'))}</span>`;
    }
  }
  /** Второй значок книги фонда: «PDF · N стр.» или «Полная книга». */
  const formatBadge = (b) => (isPdfBook(b)
    ? `<span class="badge b-full">${ICONS.download}${esc(t('badge.pdf', { n: b.pageCount }))}</span>`
    : `<span class="badge b-full">${ICONS.check}${esc(t('badge.full'))}</span>`);
  const badgesFor = (b) => (accessKind(b) === 'local' ? badgeHtml('local') + formatBadge(b) : badgeHtml(accessKind(b)));

  /* ---------- Кнопки действий ---------- */
  function actionsHtml(b, { inModal = false } = {}) {
    const kind = accessKind(b);
    const big = inModal ? '' : ' btn-sm';
    if (kind === 'local') {
      const started = progress.get(b.id);
      const label = started && progress.percent(b) < 100 ? t('act.continue') : t('act.read');
      const pdf = localPdf(b);
      let html = `<a class="btn btn-red${big}" href="${esc(readLocalHref(b))}">${ICONS.book}<span>${esc(label)}</span></a>`;
      if (pdf) {
        html += inModal
          ? `<a class="btn btn-outline" href="${esc(pdf)}" download>${ICONS.download}<span>${esc(t('act.pdf'))}</span></a>`
          : `<a class="icon-btn sm" href="${esc(pdf)}" download title="${esc(t('act.pdf'))}" aria-label="${esc(t('act.pdf'))}">${ICONS.download}</a>`;
        if (inModal && isPdfBook(b)) html += `<a class="btn btn-soft" href="${esc(pdf)}" target="_blank" rel="noopener">${ICONS.external}<span>${esc(t('act.openPdf'))}</span></a>`;
      }
      return html;
    }
    if (kind === 'full') {
      const links = api.getArchiveLinks(firstIa(b));
      const read = `<a class="btn btn-red${big}" href="#/read/ia/${encodeURIComponent(firstIa(b))}">${ICONS.book}<span>${esc(t('act.readFree'))}</span></a>`;
      if (!links) return read;
      return read + (inModal
        ? `<a class="btn btn-outline" href="${esc(links.pdf)}" target="_blank" rel="noopener noreferrer">${ICONS.download}<span>${esc(t('act.pdf'))}</span></a>`
        : `<a class="icon-btn sm" href="${esc(links.pdf)}" target="_blank" rel="noopener noreferrer" title="${esc(t('act.pdf'))}" aria-label="${esc(t('act.pdf'))}">${ICONS.download}</a>`);
    }
    const olUrl = api.getOpenLibraryUrl(b.key);
    if (kind === 'fragment') {
      return `<a class="btn btn-outline${big}" href="${esc(olUrl)}" target="_blank" rel="noopener noreferrer"><span>${esc(t('act.fragment'))}</span>${ICONS.external}</a>`;
    }
    // Нет электронной версии: в карточке — «Подробнее», в окне — ссылка на Open Library.
    return inModal
      ? `<a class="btn btn-outline" href="${esc(olUrl)}" target="_blank" rel="noopener noreferrer"><span>${esc(t('act.ol'))}</span>${ICONS.external}</a>`
      : `<button type="button" class="btn btn-soft btn-sm" data-action="details">${ICONS.info}<span>${esc(t('act.details'))}</span></button>`;
  }

  /** Заголовок с подсветкой: у книг фонда — по совпавшим основам слов (понимает латиницу/кириллицу). */
  function titleHtml(b, query) {
    const text = bookTitle(b);
    if (b.source === 'local' && searchContext.has(b.uid) && NS.searchEngine) return NS.searchEngine.markup(text, searchMatched);
    return highlight(text, query);
  }
  function authorHtml(b, query) {
    const text = bookAuthors(b);
    if (b.source === 'local' && searchContext.has(b.uid) && NS.searchEngine) return NS.searchEngine.markup(text, searchMatched);
    return highlight(text, query);
  }

  /** Строка «стр. 3 · …найденный текст…» под карточкой книги фонда. */
  function hitLineHtml(b) {
    const ctx = searchContext.get(b.uid);
    if (!ctx || !ctx.pages.length || !NS.searchEngine) return '';
    const page = ctx.pages[0];
    const snippet = NS.searchEngine.snippet(b.id, page, searchMatched, 120);
    if (!snippet) return '';
    return `<a class="bcard-hit" href="${esc(readLocalHref(b, hitPos(b, page)))}"><b>${esc(hitLabel(b, page))}</b> ${snippet}</a>`;
  }

  /* ---------- Карточка книги ---------- */
  function bookCard(b, { query = '', hint = '' } = {}) {
    register(b);
    const kind = accessKind(b);
    const langs = (b.languages || []).slice(0, 2).map(i18n.languageName).join(', ');
    const pct = kind === 'local' ? progress.percent(b) : 0;
    const titleText = bookTitle(b);
    const typeMeta = b.source === 'local' ? `<span>${ICONS.layers}${esc(t('type.' + b.type))}</span>` : '';
    return `<article class="bcard" data-uid="${esc(b.uid)}">
      <button type="button" class="bcard-cover" data-action="details" aria-label="${esc(t('act.detailsOf'))}: ${esc(titleText)}">
        ${kind === 'local' ? `<span class="bcard-flag">${badgeHtml('local')}</span>` : ''}
        ${coverHtml(b, { hint })}
      </button>
      <div class="bcard-body">
        <h3 class="bcard-title"><button type="button" data-action="details">${titleHtml(b, query)}</button></h3>
        <p class="bcard-author">${authorHtml(b, query)}</p>
        <p class="bcard-meta">
          <span>${ICONS.calendar}${b.year ? esc(b.year) : esc(t('meta.noYear'))}</span>
          ${langs ? `<span>${ICONS.globe}${esc(langs)}</span>` : ''}
          ${typeMeta}
        </p>
        <div class="bcard-badges">${kind === 'local' ? formatBadge(b) : badgeHtml(kind)}</div>
        ${hitLineHtml(b)}
        ${pct ? `<div class="bcard-progress" title="${pct}%"><span style="width:${pct}%"></span></div>` : ''}
        <div class="bcard-actions">${actionsHtml(b)}</div>
      </div>
    </article>`;
  }

  function skeletonCards(count) {
    const one = `<div class="bcard sk-card" aria-hidden="true"><div class="cover sk"></div>
      <div class="bcard-body"><span class="sk sk-line w90"></span><span class="sk sk-line w50"></span><span class="sk sk-line w40"></span><span class="sk sk-btn"></span></div></div>`;
    return one.repeat(count);
  }

  /**
   * Блок состояния: { icon, title, text, list:[...], actions:[{ label, attrs, primary }], extraHtml }
   * attrs и extraHtml формируются только из своих данных, внешние строки сюда не попадают.
   */
  function stateHtml({ icon = 'search', title = '', text = '', list = [], actions = [], extraHtml = '' }) {
    return `<div class="state" role="status">
      <div class="state-ico">${ICONS[icon] || ICONS.info}</div>
      <h3>${esc(title)}</h3>
      ${text ? `<p>${esc(text)}</p>` : ''}
      ${extraHtml}
      ${list.length ? `<ul>${list.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : ''}
      ${actions.length ? `<div class="state-actions">${actions.map((a) => `<button type="button" class="btn ${a.primary ? 'btn-red' : 'btn-outline'}" ${a.attrs}>${a.icon ? ICONS[a.icon] : ''}<span>${esc(a.label)}</span></button>`).join('')}</div>` : ''}
    </div>`;
  }

  const errorText = (err) => t('err.' + ((err && err.code) || 'unknown'));

  /* ================= Окно «Подробнее о книге» ================= */
  const modal = { el: null, content: null, book: null, hint: '', lastFocus: null, controller: null, details: null };

  /** Чистим описание Open Library от markdown-ссылок и служебных строк, режем на абзацы. */
  function descriptionHtml(text) {
    const clean = String(text)
      .replace(/\r/g, '')
      .replace(/^\s*\[\d+\]:.*$/gm, '')          // сноски-ссылки «[1]: https://…»
      .replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1') // [текст](url) → текст
      .replace(/\[([^\]]+)\]\[\d+\]/g, '$1')       // [текст][1] → текст
      .replace(/^[-*_]{3,}\s*$/gm, '')
      .replace(/[*_]{2}([^*_]+)[*_]{2}/g, '$1')
      .trim();
    return clean.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).slice(0, 12)
      .map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
  }

  function metaItem(label, value) {
    return value === null || value === undefined || value === ''
      ? '' : `<div><small>${esc(label)}</small><b title="${esc(value)}">${esc(value)}</b></div>`;
  }

  /** Ссылка темы: если тема — подкатегория жанра, ведём в жанр с фильтром, иначе — поиск по теме. */
  function subjectHref(b, subject) {
    const genre = GENRES.find((g) => g.id === b.genre);
    if (genre && genre.subs.includes(subject)) return NS.catalog.buildHash({ genre: genre.id, sub: subject, src: 'local' });
    return NS.catalog.buildHash({ q: i18n.subjectLabel(subject), field: 'subject' });
  }

  function renderModal() {
    const b = modal.book;
    if (!b) return;
    const kind = accessKind(b);
    const pdfBook = isPdfBook(b);
    const langs = (b.languages || []).slice(0, 3).map(i18n.languageName).join(', ');
    let meta;
    if (pdfBook) meta = metaItem(t('md.year'), b.year || t('meta.noYear')) + metaItem(t('md.langs'), langs) + metaItem(t('md.pages'), b.pageCount) + metaItem(t('md.type'), t('type.' + b.type));
    else if (b.source === 'local') meta = metaItem(t('md.year'), b.year) + metaItem(t('md.langs'), langs) + metaItem(t('md.chapters'), b.chapters.length) + metaItem(t('md.level'), t('level.' + b.level));
    else meta = metaItem(t('md.year'), b.year || t('meta.noYear')) + metaItem(t('md.langs'), langs || '—') + metaItem(t('md.editions'), b.editionCount) + metaItem(t('md.pages'), b.pages);
    const noteIcon = { local: pdfBook ? ICONS.download : ICONS.book, full: ICONS.check, fragment: ICONS.lock, none: ICONS.info }[kind];
    const noteText = pdfBook ? t('note.localPdf', { n: b.pageCount }) : t('note.' + kind);

    let desc;
    if (b.source === 'local') {
      desc = `<p>${esc(L(b.description))}</p>`;
    } else if (modal.details === 'loading') {
      desc = '<span class="sk sk-line w90"></span><span class="sk sk-line w90" style="margin-top:10px"></span><span class="sk sk-line w70" style="margin-top:10px"></span>';
    } else if (modal.details && modal.details.error) {
      desc = `<p>${esc(t('md.descErr'))} <button type="button" class="md-toggle" data-md="retry">${esc(t('err.retry'))}</button></p>`;
    } else {
      const html = modal.details && modal.details.description ? descriptionHtml(modal.details.description) : '';
      desc = html || `<p style="color:var(--muted)">${esc(t('md.noDesc'))}</p>`;
    }

    // Найдено по запросу: страницы/главы с фрагментами текста.
    const ctx = searchContext.get(b.uid);
    const hitsHtml = ctx && ctx.pages.length && NS.searchEngine
      ? `<div class="md-section"><h3>${esc(t('md.hits'))}</h3><ul class="md-hits">${ctx.pages.slice(0, 6).map((p) => `<li><a href="${esc(readLocalHref(b, hitPos(b, p)))}">
          <b>${esc(hitLabel(b, p))}</b><span>${NS.searchEngine.snippet(b.id, p, searchMatched, 150)}</span></a></li>`).join('')}</ul></div>`
      : '';

    // Миниатюры страниц PDF: клик открывает читалку на этой странице.
    const pagesHtml = pdfBook && hasPageImages(b)
      ? `<div class="md-section"><h3>${esc(t('md.pagesTitle'))}</h3><div class="md-pages">${Array.from({ length: b.pageCount }, (_, i) => `
          <a href="${esc(readLocalHref(b, i + 1))}" aria-label="${esc(hitLabel(b, i + 1))}">
            <span class="md-thumb" style="aspect-ratio:1/${b.ratios[i]}"><img src="${esc(pageImage(b, i + 1))}" alt="" loading="lazy" decoding="async"></span>
            <small>${i + 1}</small></a>`).join('')}</div></div>`
      : '';

    const subjects = (b.source === 'local' ? b.subjects : b.subjects).filter((s) => s && s.length < 60).slice(0, 10);
    const subjectsHtml = subjects.length
      ? `<div class="md-section"><h3>${esc(t('md.subjects'))}</h3><div class="md-subjects">${subjects.map((s) => (b.source === 'local'
        ? `<a href="${esc(subjectHref(b, s))}">${esc(i18n.subjectLabel(s))}</a>`
        : `<a href="${esc(NS.catalog.buildHash({ q: s, field: 'subject' }))}">${esc(s)}</a>`)).join('')}</div></div>`
      : '';
    const tocHtml = b.source === 'local' && !pdfBook
      ? `<div class="md-section"><h3>${esc(t('md.toc'))}</h3><ol class="md-toc">${b.chapters
        .map((c, i) => `<li><a href="#/read/local/${encodeURIComponent(b.id)}/${i}"><i>${i + 1}</i>${esc(L(c.title))}</a></li>`).join('')}</ol></div>`
      : '';

    modal.content.innerHTML = `<div class="md-grid">
      <div class="md-cover">${coverHtml(b, { size: 'L', hint: modal.hint, large: true })}</div>
      <div>
        <div class="md-badges">${badgesFor(b)}</div>
        <h2 class="md-title" id="mdTitle">${esc(bookTitle(b))}</h2>
        <p class="md-authors">${esc(bookAuthors(b))}</p>
        ${b.publisher ? `<p class="md-publisher">${ICONS.book}<span>${esc(b.publisher)}</span></p>` : ''}
        <div class="md-meta">${meta}</div>
        <div class="note note-${kind}">${noteIcon}<p>${esc(noteText)}</p></div>
        <div class="md-actions">${actionsHtml(b, { inModal: true })}</div>
        ${hitsHtml}
        <div class="md-section"><h3>${esc(t('md.desc'))}</h3><div class="md-desc" id="mdDesc">${desc}</div><button type="button" class="md-toggle" data-md="toggle" hidden></button></div>
        ${pagesHtml}
        ${tocHtml}
        ${subjectsHtml}
        ${b.source === 'ol' ? `<p class="md-source">${ICONS.info}<a href="${esc(api.getOpenLibraryUrl(b.key))}" target="_blank" rel="noopener noreferrer">${esc(t('md.source'))}</a></p>` : ''}
      </div>
    </div>`;

    // Длинное описание сворачиваем.
    const descEl = $('#mdDesc', modal.content);
    const toggle = modal.content.querySelector('[data-md="toggle"]');
    if (descEl && toggle && descEl.scrollHeight > 230) {
      descEl.classList.add('clamped');
      toggle.hidden = false;
      toggle.textContent = t('md.more');
    }
  }

  async function loadDetails() {
    const b = modal.book;
    if (!b || b.source !== 'ol') return;
    if (modal.controller) modal.controller.abort();
    const controller = new AbortController();
    modal.controller = controller;
    modal.details = 'loading';
    renderModal();
    try {
      const details = await api.getBookDetails(b.key, { signal: controller.signal });
      if (modal.book !== b) return;
      modal.details = details;
    } catch (err) {
      if (api.isAbortError(err) || modal.book !== b) return;
      modal.details = { error: err };
    }
    renderModal();
  }

  function trapFocus(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeDetails(); return; }
    if (e.key !== 'Tab') return;
    const focusables = Array.from(modal.el.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openDetails(uid, { hint = '' } = {}) {
    const b = getBook(uid);
    if (!b) return;
    modal.book = b;
    modal.hint = hint;
    modal.details = null;
    modal.lastFocus = document.activeElement;
    modal.el.hidden = false;
    scrollLock.lock('modal');
    renderModal();
    modal.el.querySelector('.modal-card').scrollTop = 0;
    $('#mdClose').focus();
    if (b.source === 'ol') loadDetails();
  }

  function closeDetails({ restoreFocus = true } = {}) {
    if (modal.el.hidden) return;
    if (modal.controller) modal.controller.abort();
    modal.el.hidden = true;
    modal.book = null;
    scrollLock.unlock('modal');
    if (restoreFocus && modal.lastFocus && document.contains(modal.lastFocus)) modal.lastFocus.focus();
  }

  function initModal() {
    modal.el = $('#bookModal');
    modal.content = $('#mdContent');
    $('#mdClose').addEventListener('click', () => closeDetails());
    modal.el.addEventListener('click', (e) => {
      if (e.target === modal.el) { closeDetails(); return; }
      const action = e.target.closest('[data-md]');
      if (!action) return;
      if (action.dataset.md === 'retry') loadDetails();
      if (action.dataset.md === 'toggle') {
        const descEl = $('#mdDesc');
        const collapsed = descEl.classList.toggle('clamped');
        action.textContent = t(collapsed ? 'md.more' : 'md.less');
      }
    });
    modal.el.addEventListener('keydown', trapFocus);
    i18n.onChange(() => { if (!modal.el.hidden) renderModal(); });

    // Карточки по всему сайту: клик по обложке, названию или «Подробнее» открывает окно.
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-action="details"]');
      if (!trigger) return;
      const card = trigger.closest('[data-uid]');
      if (!card) return;
      e.preventDefault();
      openDetails(card.dataset.uid, { hint: card.closest('[data-hint]') ? card.closest('[data-hint]').dataset.hint : '' });
    });

    // Битая или пустая обложка → остаётся красивая заглушка.
    document.addEventListener('error', (e) => {
      if (e.target instanceof HTMLImageElement && e.target.classList.contains('cv-img')) e.target.remove();
    }, true);
    document.addEventListener('load', (e) => {
      const img = e.target;
      if (img instanceof HTMLImageElement && img.classList.contains('cv-img') && img.naturalWidth < 10) img.remove();
    }, true);
  }

  NS.ui = {
    scrollLock, progress, register, getBook, findByIa, bookTitle, bookAuthors, accessKind, genreIndex, localPdf,
    readLocalHref, pageImage, hasPageImages, hitLabel, hitPos, isPdfBook, setSearchContext,
    coverHtml, badgeHtml, bookCard, skeletonCards, stateHtml, errorText, openDetails, closeDetails, initModal,
  };
})(window.SPBU = window.SPBU || {});
