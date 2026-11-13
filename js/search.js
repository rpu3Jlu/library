/**
 * search.js — поиск и каталог.
 *
 *  createSearchBox(form, handlers) — строка поиска с подсказками:
 *      debounce 400 мс, не меньше 3 символов, навигация стрелками, Enter, Esc, ARIA combobox.
 *  Catalog — страница «Каталог» (#/books) и страницы жанров (#/genre/<id>):
 *      лента жанров, подкатегории, фильтры (язык, поле поиска, годы, «только полные», сортировка),
 *      полки по жанрам, сетка результатов, «Показать ещё», скелетоны, пустой результат, ошибки.
 *  Состояние каталога хранится в адресе (#/genre/law?q=…&lang=rus), поэтому ссылкой можно поделиться,
 *  а кнопка «Назад» работает как ожидается.
 */
(function (NS) {
  'use strict';

  const { $, escapeHtml: esc, highlight, debounce, ICONS, enhanceHScroll, formatNumber } = NS.utils;
  const i18n = NS.i18n;
  const { t, L } = i18n;
  const api = NS.api;
  const ui = NS.ui;
  const { GENRES, LANGUAGES, SETTINGS } = NS.config;
  const MIN = SETTINGS.minQueryLength;
  const YEAR_NOW = new Date().getFullYear();

  /* ================= Состояние и адрес ================= */
  const FIELDS = ['all', 'title', 'author', 'subject'];
  const SORTS = ['', 'new', 'old', 'title'];
  const SOURCES = ['', 'local', 'ol'];
  const { BOOK_TYPES } = NS.config;
  const DEFAULT_STATE = Object.freeze({ genre: '', sub: '', q: '', field: 'all', lang: '', from: null, to: null, full: SETTINGS.defaultFullOnly, sort: '', src: '', type: '' });

  function parseYear(value) {
    const n = Number.parseInt(value, 10);
    return Number.isInteger(n) && n >= SETTINGS.minYear && n <= YEAR_NOW + 1 ? n : null;
  }
  const parseBool = (value, fallback) => {
    if (value === undefined || value === null) return fallback;
    return !(value === false || value === '0' || value === 'false');
  };

  /** Приводит любые входные данные (из адреса, из формы) к допустимому состоянию. */
  function normalizeState(raw = {}) {
    const genre = GENRES.find((g) => g.id === raw.genre);
    const s = {
      genre: genre ? genre.id : '',
      sub: genre && genre.subs.includes(raw.sub) ? raw.sub : '',
      q: String(raw.q || '').replace(/\s+/g, ' ').trim().slice(0, 120),
      field: FIELDS.includes(raw.field) ? raw.field : 'all',
      lang: LANGUAGES.some((l) => l.code === raw.lang) ? raw.lang : '',
      from: parseYear(raw.from),
      to: parseYear(raw.to),
      full: parseBool(raw.full, DEFAULT_STATE.full),
      sort: SORTS.includes(raw.sort) ? raw.sort : '',
      src: SOURCES.includes(raw.src) ? raw.src : '',
      type: BOOK_TYPES.includes(raw.type) ? raw.type : '',
    };
    if (s.from && s.to && s.from > s.to) [s.from, s.to] = [s.to, s.from];
    if (s.src === 'ol') s.type = ''; // тип издания есть только у книг фонда
    return s;
  }
  const stateKey = (s) => JSON.stringify(s);
  const activeQuery = (s) => (s.q.length >= MIN ? s.q : '');
  /** Нужно ли обращаться к Open Library при таком состоянии. */
  const useOl = (s) => s.src !== 'local' && !s.type;
  const useLocal = (s) => s.src !== 'ol';

  function buildHash(partial = {}) {
    const s = normalizeState({ ...DEFAULT_STATE, ...partial });
    const params = new URLSearchParams();
    if (s.q) params.set('q', s.q);
    if (s.field !== 'all') params.set('field', s.field);
    if (s.sub) params.set('sub', s.sub);
    if (s.src) params.set('src', s.src);
    if (s.type) params.set('type', s.type);
    if (s.lang) params.set('lang', s.lang);
    if (s.from) params.set('from', String(s.from));
    if (s.to) params.set('to', String(s.to));
    if (s.full !== DEFAULT_STATE.full) params.set('full', s.full ? '1' : '0');
    if (s.sort) params.set('sort', s.sort);
    const qs = params.toString();
    return (s.genre ? `#/genre/${s.genre}` : '#/books') + (qs ? '?' + qs : '');
  }

  function stateFromRoute(parts, params) {
    return normalizeState({
      genre: parts[0] === 'genre' ? parts[1] : '',
      q: params.get('q'), field: params.get('field'), sub: params.get('sub'), lang: params.get('lang'),
      from: params.get('from'), to: params.get('to'), sort: params.get('sort'),
      src: params.get('src'), type: params.get('type'),
      full: params.has('full') ? params.get('full') : undefined,
    });
  }

  /** Состояние каталога → параметры для api.searchBooks. */
  function toApiParams(s, page = 1, limit = SETTINGS.pageSize) {
    const genre = GENRES.find((g) => g.id === s.genre);
    const subjects = genre ? [s.sub || genre.subject] : [];
    const params = { page, limit, language: s.lang, fullOnly: s.full, yearFrom: s.from, yearTo: s.to, sort: s.sort, subject: subjects };
    const q = activeQuery(s);
    if (q) {
      if (s.field === 'title') params.title = q;
      else if (s.field === 'author') params.author = q;
      else if (s.field === 'subject') params.subject = subjects.concat(q);
      else params.q = q;
    }
    return params;
  }

  /* ================= Поиск по фонду института (search-engine.js) ================= */
  /**
   * @returns {{ books: object[], context: Map<string,{pages:number[]}>, matched: Set<string>, suggestion: string|null }}
   *   context — для каждой найденной книги страницы/главы с совпадениями (для фрагментов текста).
   */
  function localSearch(s) {
    const empty = { books: [], context: new Map(), matched: new Set(), suggestion: null };
    if (!useLocal(s)) return empty;
    const q = activeQuery(s);
    let found = null;
    if (q && NS.searchEngine) found = NS.searchEngine.search(q, { field: s.field });
    const list = (NS.data.localBooks || []).filter((b) => {
      if (s.genre && b.genre !== s.genre) return false;
      if (s.sub && !b.subjects.includes(s.sub)) return false;
      if (s.type && b.type !== s.type) return false;
      if (s.lang && !b.languages.includes(s.lang)) return false;
      if (s.from && (!b.year || b.year < s.from)) return false;
      if (s.to && (!b.year || b.year > s.to)) return false;
      if (q) return found ? found.results.has(b.id) : false;
      return true;
    });
    const score = (b) => (found ? found.results.get(b.id).score : 0);
    if (s.sort === 'title') list.sort((a, b) => L(a.title).localeCompare(L(b.title), i18n.lang));
    else if (s.sort === 'new') list.sort((a, b) => (b.year || 0) - (a.year || 0));
    else if (s.sort === 'old') list.sort((a, b) => (a.year || 9999) - (b.year || 9999));
    else if (found) list.sort((a, b) => score(b) - score(a));
    else list.sort((a, b) => (b.format === 'pdf') - (a.format === 'pdf')); // без запроса — сначала новые поступления
    const context = new Map();
    if (found) list.forEach((b) => context.set(b.uid, { pages: found.results.get(b.id).pages }));
    return {
      books: list,
      context,
      matched: found ? found.matched : new Set(),
      suggestion: q && NS.searchEngine && !list.length ? NS.searchEngine.suggest(q) : null,
    };
  }
  const localMatches = (s) => localSearch(s).books;

  /* ================= Строка поиска с подсказками ================= */
  /**
   * handlers.onQuery(query)  — вызывается через 400 мс после ввода ('' — если строка пуста или < 3 символов)
   * handlers.onSubmit(query) — Enter / кнопка «Найти» / «Все результаты»
   */
  function createSearchBox(form, handlers) {
    const input = form.querySelector('.sbox-input');
    const pop = form.querySelector('.sbox-pop');
    let options = [];
    let active = -1;
    let lastFired = null;
    let shownFor = null; // запрос, для которого в выпадающем списке лежат результаты

    const value = () => input.value.replace(/\s+/g, ' ').trim();

    function open() {
      if (!pop.innerHTML) return;
      pop.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }
    function hide() {
      pop.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    }
    function setActive(index) {
      const items = pop.querySelectorAll('.sug');
      items.forEach((el, i) => el.setAttribute('aria-selected', String(i === index)));
      active = index;
      if (index >= 0 && items[index]) {
        input.setAttribute('aria-activedescendant', items[index].id);
        items[index].scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    const fire = () => {
      const v = value();
      const q = v.length >= MIN ? v : '';
      if (q === lastFired) return;
      lastFired = q;
      handlers.onQuery(q);
    };
    const debounced = debounce(fire, SETTINGS.debounceMs);

    input.addEventListener('input', () => {
      const v = value();
      if (!v) { hide(); options = []; shownFor = null; }
      else if (v.length < MIN) showHint(t('search.min', { n: MIN }), 'info');
      debounced();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!options.length) return;
        e.preventDefault();
        open();
        const dir = e.key === 'ArrowDown' ? 1 : -1;
        setActive((active + dir + options.length) % options.length);
      } else if (e.key === 'Escape' && !pop.hidden) {
        e.preventDefault();
        hide();
      } else if (e.key === 'Enter' && active >= 0 && !pop.hidden) {
        e.preventDefault();
        const uid = options[active];
        hide();
        ui.openDetails(uid);
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      debounced.cancel();
      const v = value();
      if (v && v.length < MIN) { showHint(t('search.min', { n: MIN }), 'info'); input.focus(); return; }
      hide();
      lastFired = v;
      handlers.onSubmit(v);
    });

    pop.addEventListener('mousedown', (e) => e.preventDefault()); // фокус остаётся в поле
    pop.addEventListener('click', (e) => {
      const option = e.target.closest('.sug');
      if (option) { hide(); ui.openDetails(option.dataset.uid); return; }
      if (e.target.closest('[data-sug="all"]')) { hide(); lastFired = value(); handlers.onSubmit(value()); }
    });
    form.addEventListener('focusout', () => {
      setTimeout(() => { if (!form.contains(document.activeElement)) hide(); }, 0);
    });
    input.addEventListener('focus', () => { if (shownFor && shownFor === value() && options.length) open(); });

    /** ctx — { context, matched } из localSearch: подсветка и «стр. N» для книг фонда. */
    function showResults(books, total, query, ctx = null) {
      if (query !== value()) return; // пока ждали ответ, пользователь ввёл другое
      shownFor = query;
      options = books.map((b) => ui.register(b));
      if (!books.length) {
        const suggestion = ctx && ctx.suggestion;
        showHint(suggestion ? `${t('search.none')} ${t('search.didYouMean')} «${suggestion}»` : t('search.none'), 'search');
        options = [];
        return;
      }
      pop.innerHTML = books.map((b, i) => {
        const kind = ui.accessKind(b);
        const hit = ctx && ctx.context.get(b.uid);
        const meta = [ui.bookAuthors(b), b.year, hit && hit.pages.length ? ui.hitLabel(b, hit.pages[0]) : ''].filter(Boolean).join(' · ');
        const title = b.source === 'local' && ctx && NS.searchEngine ? NS.searchEngine.markup(ui.bookTitle(b), ctx.matched) : highlight(ui.bookTitle(b), query);
        return `<div class="sug" role="option" id="${pop.id}-o${i}" data-uid="${esc(b.uid)}" aria-selected="false">
          <span class="sug-cover">${ui.coverHtml(b, { size: 'S' })}</span>
          <span class="sug-txt"><b>${title}</b><small>${esc(meta)}</small></span>
          ${ui.badgeHtml(kind === 'local' ? 'local' : kind)}
        </div>`;
      }).join('') + `<button type="button" class="sug-all" data-sug="all"><span>${esc(t('search.all'))}: ${esc(formatNumber(total))}</span>${ICONS.arrow}</button>`;
      active = -1;
      if (document.activeElement === input) open();
    }

    function showHint(text, icon = 'info') {
      options = [];
      pop.innerHTML = `<div class="sug-hint" role="status">${ICONS[icon] || ICONS.info}<span>${esc(text)}</span></div>`;
      if (document.activeElement === input) open();
    }

    return {
      input,
      showResults,
      showHint,
      showError: (text) => showHint(text, 'alert'),
      hide,
      setLoading: (on) => form.classList.toggle('loading', Boolean(on)),
      setValue(v) { if (document.activeElement !== input) input.value = v; lastFired = v.length >= MIN ? v : ''; },
      isFocused: () => document.activeElement === input,
    };
  }

  /* ================= Каталог ================= */
  const el = {};
  const Catalog = {
    state: { ...DEFAULT_STATE },
    visible: false,
    box: null,
    controller: null,
    shelvesController: null,
    shelfObserver: null,
    shelfData: {},
    mode: null,
    results: { local: [], ctx: null, docs: [], numFound: 0, page: 0, loading: false, error: null, loadingMore: false, moreError: null, olUsed: true },

    init() {
      ['catTitle', 'catDesc', 'catCrumb', 'genreStrip', 'stripScroller', 'subsRow', 'subsStrip', 'subsScroller', 'filters',
        'filtersToggle', 'filtersCount', 'fLang', 'fField', 'fFrom', 'fTo', 'fSort', 'fFull', 'fReset', 'fSrc', 'fType', 'catBody']
        .forEach((id) => { el[id] = $('#' + id); });

      this.box = createSearchBox($('#catSearch'), {
        onQuery: (q) => this.update({ q }, { fromTyping: true }),
        onSubmit: (q) => {
          this.update({ q });
          if (window.matchMedia('(max-width: 899px)').matches) {
            this.box.input.blur(); // прячем клавиатуру на телефоне
            el.catBody.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        },
      });

      el.fLang.addEventListener('change', () => this.update({ lang: el.fLang.value }));
      el.fField.addEventListener('change', () => this.update({ field: el.fField.value }));
      el.fSort.addEventListener('change', () => this.update({ sort: el.fSort.value }));
      el.fFull.addEventListener('change', () => this.update({ full: el.fFull.checked }));
      el.fSrc.addEventListener('change', () => this.update({ src: el.fSrc.value }));
      el.fType.addEventListener('change', () => this.update({ type: el.fType.value }));
      el.fReset.addEventListener('click', () => this.resetFilters());
      const onYears = () => {
        const valid = [el.fFrom, el.fTo].every((input) => {
          const ok = input.value === '' || parseYear(input.value) !== null;
          input.setAttribute('aria-invalid', String(!ok));
          return ok;
        });
        if (valid) this.update({ from: el.fFrom.value, to: el.fTo.value });
      };
      const yearsDebounced = debounce(onYears, 700);
      [el.fFrom, el.fTo].forEach((input) => {
        input.addEventListener('input', yearsDebounced);
        input.addEventListener('change', () => { yearsDebounced.cancel(); onYears(); });
      });
      el.filtersToggle.addEventListener('click', () => {
        const open = el.filters.classList.toggle('open');
        el.filtersToggle.setAttribute('aria-expanded', String(open));
      });
      el.subsStrip.addEventListener('click', (e) => {
        const chip = e.target.closest('[data-sub]');
        if (chip) this.update({ sub: chip.dataset.sub });
      });
      el.catBody.addEventListener('click', (e) => this.onBodyClick(e));

      enhanceHScroll(el.stripScroller);
      enhanceHScroll(el.subsScroller);
      i18n.onChange(() => { if (this.visible) { this.syncControls(); this.renderChrome(); this.rerender(); } });
    },

    /** Вызывается роутером. */
    show(next) {
      const wasVisible = this.visible;
      const prevKey = stateKey(this.state);
      const prevGenre = this.state.genre;
      this.visible = true;
      this.state = next;
      this.syncControls();
      this.renderChrome();
      if (!wasVisible || stateKey(next) !== prevKey || !this.mode) this.refresh();
      // Новый раздел или новый запрос из адреса — наверх; возврат из читалки (то же состояние) — остаёмся на месте.
      if (!wasVisible || prevGenre !== next.genre || stateKey(next) !== prevKey) window.scrollTo(0, 0);
    },

    hide() {
      this.visible = false;
      if (this.controller) this.controller.abort();
      if (this.shelvesController) this.shelvesController.abort();
      this.box.hide();
    },

    /** Меняет состояние из интерфейса. Фильтры не плодят записи в истории (replaceState). */
    update(patch, { fromTyping = false } = {}) {
      const next = normalizeState({ ...this.state, ...patch });
      if (stateKey(next) === stateKey(this.state)) return;
      this.state = next;
      history.replaceState(null, '', buildHash(next));
      this.syncControls();
      this.renderChrome();
      this.refresh({ fromTyping });
    },

    resetFilters() {
      this.update({ field: 'all', lang: '', from: null, to: null, full: DEFAULT_STATE.full, sort: '', sub: '', src: '', type: '' });
    },

    isShelvesMode() { return !this.state.genre && !activeQuery(this.state); },

    refresh({ fromTyping = false } = {}) {
      if (this.isShelvesMode()) {
        if (fromTyping) this.box.hide();
        this.renderShelves();
      } else {
        this.runSearch({ fromTyping });
      }
    },

    /** Перерисовка из памяти (смена языка интерфейса) — без новых запросов. */
    rerender() {
      if (this.mode === 'grid') this.renderGrid();
      else if (this.mode === 'shelves') this.renderShelves({ fromMemory: true });
    },

    /* ---------- Элементы управления ---------- */
    syncControls() {
      const s = this.state;
      el.fLang.innerHTML = `<option value="">${esc(t('f.langAll'))}</option>`
        + LANGUAGES.map((l) => `<option value="${esc(l.code)}">${esc(l[i18n.lang] || l.ru)}</option>`).join('');
      el.fSrc.innerHTML = SOURCES.map((v) => `<option value="${v}">${esc(t('src.' + (v || 'all')))}</option>`).join('');
      el.fType.innerHTML = `<option value="">${esc(t('type.all'))}</option>`
        + BOOK_TYPES.filter((ty) => (NS.data.localBooks || []).some((b) => b.type === ty))
          .map((ty) => `<option value="${ty}">${esc(t('type.' + ty))}</option>`).join('');
      el.fLang.value = s.lang;
      el.fField.value = s.field;
      el.fSort.value = s.sort;
      el.fSrc.value = s.src;
      el.fType.value = s.type;
      el.fType.disabled = s.src === 'ol';
      el.fFull.checked = s.full;
      el.fFull.disabled = !useOl(s); // «только полные» касается только Open Library
      el.fFull.closest('.switch').classList.toggle('is-disabled', !useOl(s));
      if (document.activeElement !== el.fFrom) el.fFrom.value = s.from || '';
      if (document.activeElement !== el.fTo) el.fTo.value = s.to || '';
      [el.fFrom, el.fTo].forEach((i) => i.setAttribute('aria-invalid', 'false'));
      el.fFrom.max = el.fTo.max = String(YEAR_NOW + 1);
      const active = [s.lang, s.field !== 'all', s.from, s.to, s.full !== DEFAULT_STATE.full, s.sort, s.sub, s.src, s.type].filter(Boolean).length;
      el.fReset.hidden = active === 0;
      el.filtersCount.hidden = active === 0;
      el.filtersCount.textContent = String(active);
      this.box.setValue(s.q);
    },

    renderChrome() {
      const s = this.state;
      const gi = GENRES.findIndex((g) => g.id === s.genre);
      const genre = GENRES[gi];
      if (genre) {
        el.catTitle.innerHTML = `<span class="gico">${ICONS[genre.icon] || ICONS.book}</span><span>${esc(i18n.genreName(genre))}</span>`;
        el.catDesc.textContent = i18n.has(`genre.${genre.id}.desc`) ? t(`genre.${genre.id}.desc`) : genre.subs.map(i18n.subjectLabel).join(', ');
        el.catCrumb.innerHTML = `<a href="#/books">${esc(t('cat.crumb'))}</a><span aria-hidden="true">/</span><span>${esc(i18n.genreName(genre))}</span>`;
      } else {
        el.catTitle.textContent = t('cat.title');
        el.catDesc.textContent = t('cat.desc');
        el.catCrumb.textContent = t('cat.crumb');
      }

      // Лента жанров: ссылки сохраняют текущий запрос и фильтры.
      const pill = (g, i) => {
        const current = g ? s.genre === g.id : !s.genre;
        const href = buildHash({ ...s, genre: g ? g.id : '', sub: '' });
        const icon = g ? ICONS[g.icon] || ICONS.book : ICONS.grid;
        const n = (NS.data.localBooks || []).filter((b) => !g || b.genre === g.id).length;
        return `<a class="gpill${g ? '' : ' gpill-all'}" href="${esc(href)}"${current ? ' aria-current="page"' : ''}>
          <span class="gpill-ico ${g ? 'g' + (i % 6) : ''}">${icon}</span><span>${esc(g ? i18n.genreName(g) : t('genres.all'))}</span><span class="gpill-n">${n}</span></a>`;
      };
      el.genreStrip.innerHTML = pill(null, -1) + GENRES.map((g, i) => pill(g, i)).join('');
      const currentPill = el.genreStrip.querySelector('[aria-current="page"]');
      if (currentPill) {
        const track = el.genreStrip;
        track.scrollLeft = Math.max(0, currentPill.offsetLeft - (track.clientWidth - currentPill.offsetWidth) / 2);
      }

      el.subsRow.hidden = !genre;
      if (genre) {
        const local = NS.data.localBooks || [];
        const chip = (value, label) => {
          const n = value ? local.filter((b) => b.genre === genre.id && b.subjects.includes(value)).length : 0;
          return `<button type="button" class="chip" data-sub="${esc(value)}" aria-pressed="${s.sub === value}">${esc(label)}${n ? `<span class="chip-n">${n}</span>` : ''}</button>`;
        };
        el.subsStrip.innerHTML = chip('', t('sub.all')) + genre.subs.map((sub) => chip(sub, i18n.subjectLabel(sub))).join('');
      }
    },

    /* ---------- Поиск: фонд института (мгновенно, без интернета) + Open Library ---------- */
    async runSearch({ append = false, fromTyping = false } = {}) {
      if (this.shelvesController) this.shelvesController.abort();
      if (this.controller) this.controller.abort();
      const controller = new AbortController();
      this.controller = controller;
      const s = this.state;
      const r = this.results;
      const page = append ? r.page + 1 : 1;
      const q = activeQuery(s);

      if (append) {
        r.loadingMore = true;
        r.moreError = null;
        this.renderMore();
      } else {
        this.mode = 'grid';
        const local = localSearch(s);
        ui.setSearchContext(local.context, local.matched);
        Object.assign(r, { local: local.books, ctx: local, docs: [], numFound: 0, page: 0, loading: useOl(s), error: null, loadingMore: false, moreError: null, olUsed: useOl(s) });
        this.renderGrid();
        if (!useOl(s)) {
          if (fromTyping) this.box.showResults(r.local.slice(0, 6), r.local.length, q, local);
          return;
        }
        if (fromTyping) {
          // Книги фонда показываем в подсказках сразу, не дожидаясь Open Library.
          if (r.local.length) this.box.showResults(r.local.slice(0, 6), r.local.length, q, local);
          this.box.setLoading(true);
        }
      }

      try {
        const res = await api.searchBooks(toApiParams(s, page), { signal: controller.signal });
        if (controller !== this.controller) return;
        const known = new Set(r.docs.map((d) => d.key));
        const fresh = res.docs.filter((d) => !known.has(d.key));
        r.docs = append ? r.docs.concat(fresh) : fresh;
        r.numFound = res.numFound;
        r.page = page;
        r.loading = false;
        r.loadingMore = false;
        if (append) this.appendCards(fresh); else this.renderGrid();
        if (fromTyping) this.box.showResults(r.local.concat(r.docs).slice(0, 6), r.local.length + r.numFound, q, r.ctx);
      } catch (err) {
        if (api.isAbortError(err) || controller !== this.controller) return;
        if (append) {
          r.loadingMore = false;
          r.moreError = err;
          this.renderMore();
        } else {
          r.loading = false;
          r.error = err;
          this.renderGrid();
          if (fromTyping) {
            if (r.local.length) this.box.showResults(r.local.slice(0, 6), r.local.length, q, r.ctx);
            else this.box.showError(ui.errorText(err));
          }
        }
      } finally {
        if (controller === this.controller) this.box.setLoading(false);
      }
    },

    renderGrid() {
      this.mode = 'grid';
      const s = this.state;
      const r = this.results;
      const q = activeQuery(s);
      const hint = s.genre;
      const total = r.local.length + r.numFound;
      el.catBody.setAttribute('aria-busy', String(r.loading));
      let html = '';

      if (s.lang === 'uzb' && r.olUsed) html += alertHtml('info', t('res.uzbNote'));
      if (s.type && s.src !== 'local') html += alertHtml('info', t('f.typeNote'));

      if (r.loading) {
        html += `<div class="res-head"><h2>${esc(t('res.searching'))}</h2></div>`;
        html += `<div class="books" data-hint="${esc(hint)}">${r.local.map((b) => ui.bookCard(b, { query: q, hint })).join('')}${ui.skeletonCards(r.local.length ? 6 : 10)}</div>`;
      } else if (r.error && !r.local.length) {
        html += ui.stateHtml({
          icon: r.error.code === 'offline' ? 'wifiOff' : 'alert',
          title: t('err.title'),
          text: ui.errorText(r.error),
          actions: [{ label: t('err.retry'), attrs: 'data-cat="retry"', primary: true, icon: 'refresh' }],
        });
      } else if (total === 0) {
        const actions = [];
        if (s.full && r.olUsed) actions.push({ label: t('empty.fullOff'), attrs: 'data-cat="full-off"', primary: true, icon: 'lock' });
        if (el.fReset.hidden === false) actions.push({ label: t('empty.reset'), attrs: 'data-cat="reset"', icon: 'refresh' });
        const suggestion = r.ctx && r.ctx.suggestion;
        const extraHtml = suggestion
          ? `<p class="did-you-mean">${esc(t('search.didYouMean'))} <button type="button" class="link-btn" data-cat="suggest" data-q="${esc(suggestion)}">${esc(suggestion)}</button></p>`
          : '';
        html += ui.stateHtml({ icon: 'search', title: t('empty.title'), text: t('empty.text'), extraHtml, list: [t('empty.tip1'), t('empty.tipScript'), t('empty.tip2'), t('empty.tip3')], actions });
      } else {
        if (r.error) html += alertHtml('error', t('err.partial') + ' ' + ui.errorText(r.error), `<button type="button" class="btn btn-outline btn-sm" data-cat="retry">${ICONS.refresh}<span>${esc(t('err.retry'))}</span></button>`);
        if (r.olUsed && s.full && r.numFound < SETTINGS.pageSize && !r.error) {
          html += alertHtml('info', t('res.fullNote'), `<button type="button" class="btn btn-outline btn-sm" data-cat="full-off">${esc(t('res.showAll'))}</button>`);
        }
        const split = r.olUsed
          ? t('res.split', { a: formatNumber(r.local.length), b: formatNumber(r.numFound) })
          : t('src.local') + (q && r.local.length ? ' · ' + t('search.inText') : '');
        html += `<div class="res-head"><h2>${esc(t('res.found', { n: formatNumber(total) }))}</h2><small>${esc(split)}</small></div>`;
        html += `<div class="books" id="resultsGrid" data-hint="${esc(hint)}">${r.local.concat(r.docs).map((b) => ui.bookCard(b, { query: q, hint })).join('')}</div>`;
        html += '<div class="more" id="moreBox"></div>';
      }
      el.catBody.innerHTML = html;
      if (!r.loading && total > 0 && !(r.error && !r.local.length)) this.renderMore();
    },

    appendCards(docs) {
      const grid = $('#resultsGrid');
      if (!grid) { this.renderGrid(); return; }
      const q = activeQuery(this.state);
      const before = grid.children.length;
      grid.insertAdjacentHTML('beforeend', docs.map((b) => ui.bookCard(b, { query: q, hint: this.state.genre })).join(''));
      this.renderMore();
      // Фокус на первую новую карточку — удобно с клавиатуры и для скринридеров.
      const firstNew = grid.children[before];
      if (firstNew) { const btn = firstNew.querySelector('.bcard-title button'); if (btn) btn.focus({ preventScroll: true }); }
    },

    renderMore() {
      const box = $('#moreBox');
      if (!box) return;
      const r = this.results;
      const shown = r.local.length + r.docs.length;
      const total = r.local.length + r.numFound;
      const hasMore = r.docs.length < r.numFound && r.page < 500;
      const pct = total ? Math.round((shown / total) * 100) : 100;
      let html = `<small>${esc(t('res.shown', { a: formatNumber(shown), b: formatNumber(total) }))}</small>
        <div class="more-bar" aria-hidden="true"><span style="width:${pct}%"></span></div>`;
      if (r.moreError) {
        html += alertHtml('error', ui.errorText(r.moreError), `<button type="button" class="btn btn-outline btn-sm" data-cat="more">${ICONS.refresh}<span>${esc(t('err.retry'))}</span></button>`);
      } else if (hasMore) {
        html += `<button type="button" class="btn btn-red" data-cat="more"${r.loadingMore ? ' disabled' : ''}>${r.loadingMore ? esc(t('res.loadingMore')) : esc(t('res.more'))}</button>`;
      }
      box.innerHTML = html;
      if (r.loadingMore) {
        const grid = $('#resultsGrid');
        if (grid && !grid.querySelector('.sk-card')) grid.insertAdjacentHTML('beforeend', ui.skeletonCards(4));
      } else {
        document.querySelectorAll('#resultsGrid .sk-card').forEach((n) => n.remove());
      }
    },

    /* ---------- Полки по жанрам: сначала книги фонда, затем Open Library ---------- */
    renderShelves({ fromMemory = false } = {}) {
      this.mode = 'shelves';
      if (this.controller) this.controller.abort();
      if (this.shelvesController) this.shelvesController.abort();
      if (!fromMemory) this.shelfData = {};
      this.shelvesController = new AbortController();
      if (this.shelfObserver) this.shelfObserver.disconnect();
      el.catBody.setAttribute('aria-busy', 'false');
      ui.setSearchContext(new Map(), new Set());

      const s = this.state;
      const ol = useOl(s);
      let html = continueReadingHtml();
      if (s.lang === 'uzb' && ol) html += alertHtml('info', t('res.uzbNote'));
      if (s.type && s.src !== 'local') html += alertHtml('info', t('f.typeNote'));
      let shown = 0;
      html += GENRES.map((g, i) => {
        const local = localMatches({ ...s, genre: g.id, sub: '' });
        if (!ol && !local.length) return '';
        shown += 1;
        return `<section class="shelf" data-shelf="${esc(g.id)}" data-hint="${esc(g.id)}">
          <div class="shelf-head">
            <div class="shelf-title"><span class="shelf-ico g${i % 6}">${ICONS[g.icon] || ICONS.book}</span>
              <div><h2>${esc(i18n.genreName(g))}</h2><small data-shelf-count>${esc(local.length ? t('genres.local', { n: local.length }) : '')}</small></div></div>
            <a class="shelf-link" href="${esc(buildHash({ ...s, genre: g.id, sub: '' }))}">${esc(t('shelf.seeAll'))}${ICONS.arrow}</a>
          </div>
          <div class="hs">${hsButtons('prev')}<div class="hs-track" data-shelf-track>${local.map((b) => ui.bookCard(b, { hint: g.id })).join('')}<span class="ol-slot">${ol ? ui.skeletonCards(local.length ? 3 : 6) : ''}</span></div>${hsButtons('next')}</div>
        </section>`;
      }).join('');
      if (!shown) {
        html += ui.stateHtml({ icon: 'search', title: t('empty.title'), text: t('shelf.empty'), actions: [{ label: t('empty.reset'), attrs: 'data-cat="reset"', icon: 'refresh' }] });
      }
      el.catBody.innerHTML = html;
      el.catBody.querySelectorAll('.hs').forEach(enhanceHScroll);
      if (!ol) return;

      // Книги Open Library догружаются, когда полка появляется на экране (очередь API держит 1 запрос/с).
      const sections = Array.from(el.catBody.querySelectorAll('[data-shelf]'));
      if ('IntersectionObserver' in window) {
        this.shelfObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            this.shelfObserver.unobserve(entry.target);
            this.loadShelf(entry.target);
          });
        }, { rootMargin: '600px 0px' });
        sections.forEach((sec) => this.shelfObserver.observe(sec));
      } else {
        sections.forEach((sec) => this.loadShelf(sec));
      }
    },

    async loadShelf(section) {
      const genre = GENRES.find((g) => g.id === section.dataset.shelf);
      if (!genre) return;
      const slot = section.querySelector('.ol-slot');
      const count = section.querySelector('[data-shelf-count]');
      const localN = section.querySelectorAll('.bcard[data-uid^="local:"]').length;
      const signal = this.shelvesController.signal;
      const s = { ...this.state, genre: genre.id, sub: '', q: '' };
      let data = this.shelfData[genre.id];
      if (!data || data.error) {
        slot.innerHTML = ui.skeletonCards(localN ? 3 : 6);
        try {
          const res = await api.searchBooks(toApiParams(s, 1), { signal });
          data = { docs: res.docs, numFound: res.numFound };
        } catch (err) {
          if (api.isAbortError(err)) return;
          data = { error: err };
        }
        if (signal.aborted) return;
        this.shelfData[genre.id] = data;
      }
      const parts = [];
      if (localN) parts.push(t('genres.local', { n: localN }));
      if (data.error) {
        slot.innerHTML = `<div class="shelf-msg"><span>${esc(ui.errorText(data.error))}</span>
          <button type="button" class="btn btn-outline btn-sm" data-cat="retry-shelf">${ICONS.refresh}<span>${esc(t('err.retry'))}</span></button></div>`;
      } else if (!data.docs.length) {
        parts.push(t('shelf.count', { n: 0 }));
        slot.innerHTML = localN ? '' : `<div class="shelf-msg"><span>${esc(t('shelf.empty'))}</span>${s.full
          ? `<button type="button" class="btn btn-outline btn-sm" data-cat="full-off">${esc(t('empty.fullOff'))}</button>` : ''}</div>`;
      } else {
        parts.push(t('shelf.count', { n: formatNumber(data.numFound) }));
        slot.innerHTML = data.docs.map((b) => ui.bookCard(b, { hint: genre.id })).join('');
      }
      count.textContent = parts.join(' · ');
    },

    onBodyClick(e) {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      const action = btn.dataset.cat;
      if (action === 'retry') this.runSearch();
      else if (action === 'more') this.runSearch({ append: true });
      else if (action === 'full-off') this.update({ full: false });
      else if (action === 'reset') this.resetFilters();
      else if (action === 'suggest') this.update({ q: btn.dataset.q || '' });
      else if (action === 'retry-shelf') {
        const section = btn.closest('[data-shelf]');
        if (section) { delete this.shelfData[section.dataset.shelf]; this.loadShelf(section); }
      }
    },
  };

  /* ---------- Мелкие шаблоны ---------- */
  const hsButtons = (dir) => `<button type="button" class="hs-btn" data-hs="${dir}" aria-label="${dir === 'prev' ? '←' : '→'}">${dir === 'prev' ? ICONS.chevL : ICONS.chevR}</button>`;

  function alertHtml(kind, text, actionHtml = '') {
    return `<div class="alert${kind === 'error' ? ' alert-error' : ''}" role="${kind === 'error' ? 'alert' : 'note'}">
      ${kind === 'error' ? ICONS.alert : ICONS.info}<div class="alert-body"><span>${esc(text)}</span>${actionHtml}</div></div>`;
  }

  function continueReadingHtml() {
    const books = (NS.data.localBooks || [])
      .filter((b) => ui.progress.get(b.id) && ui.progress.percent(b) < 100)
      .sort((a, b) => (ui.progress.get(b.id).at || 0) - (ui.progress.get(a.id).at || 0))
      .slice(0, 4);
    if (!books.length) return '';
    return `<section class="shelf"><div class="shelf-head"><div class="shelf-title"><span class="shelf-ico g1">${ICONS.clock}</span><div><h2>${esc(t('cont.title'))}</h2></div></div></div>
      <div class="cont-row">${books.map((b) => {
        const p = ui.progress.get(b.id);
        const pct = ui.progress.percent(b);
        const where = b.format === 'pdf' ? ui.hitLabel(b, p.last || 1) : L((b.chapters[p.last] || b.chapters[0]).title);
        return `<a class="cont-item" href="${esc(ui.readLocalHref(b))}">${ui.coverHtml(b)}
          <span style="flex:1;min-width:0"><b>${esc(L(b.title))}</b><small>${esc(where)} · ${pct}%</small>
          <span class="bcard-progress" style="display:block"><span style="width:${pct}%"></span></span></span></a>`;
      }).join('')}</div></section>`;
  }

  NS.catalog = { Catalog, createSearchBox, buildHash, stateFromRoute, normalizeState, toApiParams, localMatches, localSearch, useOl, DEFAULT_STATE };
})(window.SPBU = window.SPBU || {});
