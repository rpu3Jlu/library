/**
 * app.js — точка входа: маршруты, меню, главная страница, тема, язык, контакты.
 *
 * Маршруты (hash, чтобы сайт работал без сервера):
 *   #/                     главная
 *   #/books?…              каталог (все жанры)
 *   #/genre/<id>?…         страница жанра
 *   #/read/local/<id>/<n>  читалка: книга фонда института, глава n
 *   #/read/ia/<id>         читалка: полная книга Internet Archive
 *   #/contacts             главная + прокрутка к контактам
 */
(function (NS) {
  'use strict';

  const { $, $$, escapeHtml: esc, ICONS, store, observeReveal, enhanceHScroll } = NS.utils;
  const i18n = NS.i18n;
  const { t } = i18n;
  const api = NS.api;
  const ui = NS.ui;
  const reader = NS.reader;
  const { Catalog, createSearchBox, buildHash, stateFromRoute, normalizeState, toApiParams, localSearch, useOl, DEFAULT_STATE } = NS.catalog;
  const { GENRES } = NS.config;

  NS.data = { localBooks: [] };

  const FAME = [{ y: '1724', k: 1 }, { y: '1869', k: 2 }, { y: '1896', k: 3 }, { ic: 'medal', k: 4 }, { y: '2010', k: 5 }, { ic: 'code', k: 6 }];
  const WHY = [{ ic: 'diploma', k: 1 }, { ic: 'flask', k: 2 }, { ic: 'target', k: 3 }, { ic: 'globe', k: 4 }, { ic: 'home', k: 5 }, { ic: 'city', k: 6 }];
  // Быстрые ссылки под поиском на главной.
  const POPULAR = [
    { genre: 'economics', sub: 'insurance', src: 'local' },
    { genre: 'law', sub: 'conflict of laws', src: 'local' },
    { genre: 'law', sub: 'maritime law', src: 'local' },
    { genre: 'programming', sub: 'management information systems', src: 'local' },
    { genre: 'law', sub: 'political science', src: 'local' },
    { genre: 'programming', sub: 'python' },
  ];
  const MAPS = {
    spb: 'Санкт-Петербург, Университетская набережная, 7-9',
    tas: 'Ташкент, улица Шахрисабз, 16',
  };

  /* ================= Тема и язык ================= */
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    store.set('eb-theme', theme);
  }
  const toggleTheme = () => setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

  function syncLangButtons() {
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === i18n.lang)));
  }

  /** Статичные иконки в разметке: <i data-icon="search"></i> */
  function fillIcons(root = document) {
    $$('[data-icon]', root).forEach((node) => {
      const icon = ICONS[node.dataset.icon];
      if (icon && !node.firstElementChild) node.insertAdjacentHTML('afterbegin', icon);
    });
  }

  /* ================= Меню ================= */
  function renderNav() {
    const link = (href, key, label, icon) => `<a href="${esc(href)}" data-nav="${esc(key)}">${ICONS[icon] || ''}<span>${esc(label)}</span></a>`;
    $('#nav').innerHTML = link('#/', 'home', t('nav.home'), 'home')
      + link('#/books', 'books', t('nav.catalog'), 'grid')
      + GENRES.map((g) => link(`#/genre/${g.id}`, g.id, i18n.genreName(g), g.icon)).join('')
      + `<a href="#/contacts" data-action="contacts" data-nav="contacts">${ICONS.phone}<span>${esc(t('nav.contacts'))}</span></a>`;
    setActiveNav(currentNav);
    $('#footerGenres').innerHTML = GENRES.map((g) => `<li><a href="#/genre/${esc(g.id)}">${esc(i18n.genreName(g))}</a></li>`).join('')
      + `<li><a href="#/books">${esc(t('genres.all'))}</a></li>`;
  }

  let currentNav = 'home';
  function setActiveNav(key) {
    currentNav = key;
    $$('#nav a').forEach((a) => {
      const on = a.dataset.nav === key;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function closeMenu() {
    $('#nav').classList.remove('open');
    $('#burger').setAttribute('aria-expanded', 'false');
  }

  /* ================= Главная ================= */
  function renderHome() {
    $('#fameGrid').innerHTML = FAME.map((f) => `<article class="card fame-card reveal">
      <div class="fame-year">${f.y ? esc(f.y) : ICONS[f.ic]}</div>
      <h3>${esc(t(`fame.${f.k}t`))}</h3><p>${esc(t(`fame.${f.k}d`))}</p></article>`).join('');
    $('#whyGrid').innerHTML = WHY.map((w) => `<article class="card reveal">
      <span class="why-num" aria-hidden="true">0${w.k}</span><div class="why-ico">${ICONS[w.ic]}</div>
      <h3>${esc(t(`why.${w.k}t`))}</h3><p>${esc(t(`why.${w.k}d`))}</p></article>`).join('');

    // Лента жанров: первая карточка — «Все книги», дальше жанры из config.js.
    const countLocal = (id) => NS.data.localBooks.filter((b) => !id || b.genre === id).length;
    const allCard = `<a class="gcard gcard-all" href="#/books">
      <span class="gcard-ico">${ICONS.grid}</span><h3>${esc(t('genres.all'))}</h3><p>${esc(t('genres.all.d'))}</p>
      <span class="gcard-foot"><span>${esc(t('genres.local', { n: countLocal('') }))}<small>${esc(t('genres.ol'))}</small></span><span class="gcard-go">${ICONS.arrow}</span></span></a>`;
    $('#genreTrack').innerHTML = allCard + GENRES.map((g, i) => `<a class="gcard g${i % 6}" href="#/genre/${esc(g.id)}">
      <span class="gcard-ico">${ICONS[g.icon] || ICONS.book}</span>
      <h3>${esc(i18n.genreName(g))}</h3>
      ${i18n.has(`genre.${g.id}.desc`) ? `<p>${esc(t(`genre.${g.id}.desc`))}</p>` : ''}
      <span class="gcard-subs">${g.subs.map((s) => `<span>${esc(i18n.subjectLabel(s))}</span>`).join('')}</span>
      <span class="gcard-foot"><span>${esc(t('genres.local', { n: countLocal(g.id) }))}<small>${esc(t('genres.ol'))}</small></span><span class="gcard-go">${ICONS.arrow}</span></span>
    </a>`).join('');

    // Новые поступления: PDF-книги фонда, сначала свежие.
    const arrivals = NS.data.localBooks.filter((b) => b.format === 'pdf').sort((a, b) => (b.added || '').localeCompare(a.added || '') || (b.year || 0) - (a.year || 0));
    $('#arrivalsTrack').innerHTML = arrivals.map((b) => ui.bookCard(b)).join('');

    $('#heroTags').innerHTML = `<span>${esc(t('hero.popular'))}</span>` + POPULAR.map((p) => {
      const label = p.label ? (p.label[i18n.lang] || p.label.ru) : i18n.subjectLabel(p.sub);
      return `<a class="tag" href="${esc(buildHash(p))}">${esc(label)}</a>`;
    }).join('');
    observeReveal();
  }

  /** Поиск на главной: подсказки на лету, Enter — переход в каталог с тем же запросом. */
  function initHeroSearch() {
    let controller = null;
    const box = createSearchBox($('#heroSearch'), {
      async onQuery(q) {
        if (controller) controller.abort();
        if (!q) { box.setLoading(false); return; }
        controller = new AbortController();
        const mine = controller;
        const state = normalizeState({ ...DEFAULT_STATE, q });
        const found = localSearch(state);
        const local = found.books;
        ui.setSearchContext(found.context, found.matched);
        // Книги фонда находятся мгновенно и без интернета — показываем их сразу.
        if (local.length) box.showResults(local.slice(0, 6), local.length, q, found);
        if (!useOl(state)) return;
        box.setLoading(true);
        try {
          // Те же параметры, что у каталога, — после Enter каталог возьмёт ответ из кэша.
          const res = await api.searchBooks(toApiParams(state, 1), { signal: mine.signal });
          box.showResults(local.concat(res.docs).slice(0, 6), local.length + res.numFound, q, found);
        } catch (err) {
          if (api.isAbortError(err)) return;
          if (local.length) box.showResults(local.slice(0, 6), local.length, q, found);
          else box.showError(ui.errorText(err));
        } finally {
          if (mine === controller) box.setLoading(false);
        }
      },
      onSubmit(q) {
        if (controller) controller.abort();
        location.hash = buildHash({ q });
      },
    });
  }

  /* ================= Контакты ================= */
  function setContactsTab(tab) {
    $$('.tabs [role="tab"]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    $$('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== tab; });
    const q = encodeURIComponent(MAPS[tab]);
    $('#mapFrame').src = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
    $('#gmapLink').href = `https://www.google.com/maps/search/?api=1&query=${q}`;
    $('#ymapLink').href = `https://yandex.ru/maps/?text=${q}`;
  }

  let contactsWatch = null;
  /** Контакты есть внизу каждой страницы — просто плавно едем к ним. */
  function scrollToContacts() {
    closeMenu();
    const section = $('#contacts');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Пока страница едет вниз, полки с книгами догружаются и меняют высоту —
    // после остановки прокрутки докручиваем точно до блока.
    // Пока страница едет вниз и ещё несколько секунд после, полки с книгами догружаются
    // и меняют высоту — держим блок контактов на месте, пока пользователь сам не начнёт листать.
    if (contactsWatch) contactsWatch.stop();
    const settle = () => {
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      if (Math.abs(section.getBoundingClientRect().top - offset) > 8) section.scrollIntoView({ behavior: 'auto', block: 'start' });
    };
    const observer = 'ResizeObserver' in window ? new ResizeObserver(() => settle()) : null;
    const stop = () => {
      if (observer) observer.disconnect();
      clearTimeout(timer);
      ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.removeEventListener(ev, stop));
      contactsWatch = null;
    };
    const timer = setTimeout(stop, 4000);
    if (observer) observer.observe($('#main'));
    ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, stop, { passive: true }));
    if ('onscrollend' in window) window.addEventListener('scrollend', settle, { once: true });
    contactsWatch = { stop };
    section.focus({ preventScroll: true });
    section.classList.remove('contacts-flash');
    void section.offsetWidth; // перезапуск анимации подсветки
    section.classList.add('contacts-flash');
  }

  /* ================= Маршрутизация ================= */
  let currentView = null;
  let hashChangedInApp = false;
  let lastMainHash = '#/';

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path, query = ''] = raw.split('?');
    return { parts: path.split('/').filter(Boolean).map((p) => { try { return decodeURIComponent(p); } catch (e) { return p; } }), params: new URLSearchParams(query) };
  }

  function showView(name) {
    if (currentView === name) return;
    currentView = name;
    $('#view-home').hidden = name !== 'home';
    $('#view-catalog').hidden = name !== 'catalog';
    if (name !== 'catalog') Catalog.hide();
  }

  function route() {
    const { parts, params } = parseHash();
    closeMenu();
    ui.closeDetails({ restoreFocus: false });

    if (parts[0] === 'read') {
      if (!currentView) { showView('catalog'); Catalog.show(normalizeState(DEFAULT_STATE)); setActiveNav('books'); }
      const opts = { returnHash: lastMainHash, fromApp: hashChangedInApp };
      if (parts[1] === 'local') {
        const book = NS.data.localBooks.find((b) => b.id === parts[2]);
        if (book) { reader.openLocal(book, Number.parseInt(parts[3], 10) || 0, opts); return; }
      } else if (parts[1] === 'ia' && api.isValidIaId(parts[2])) {
        if (reader.openArchive(parts[2], opts)) return;
      }
      location.replace('#/books'); // неизвестная книга
      return;
    }

    reader.hide();
    lastMainHash = location.hash || '#/';

    if (parts[0] === 'books' || parts[0] === 'genre') {
      showView('catalog');
      const state = stateFromRoute(parts, params);
      Catalog.show(state);
      setActiveNav(state.genre || 'books');
      return;
    }

    const wasHome = currentView === 'home';
    showView('home');
    if (parts[0] === 'contacts') {
      setActiveNav('contacts');
      requestAnimationFrame(() => scrollToContacts());
    } else {
      setActiveNav('home');
      if (!wasHome) window.scrollTo(0, 0);
    }
  }

  /* ================= Запуск ================= */
  async function init() {
    NS.data.localBooks = await api.loadLocalBooks();
    // Полнотекстовый индекс фонда: названия, авторы, темы, описания и текст страниц.
    NS.searchEngine.build(NS.data.localBooks, await api.loadFulltext());

    fillIcons();
    i18n.applyStatic();
    syncLangButtons();
    renderNav();
    renderHome();
    ui.initModal();
    reader.init();
    Catalog.init();
    initHeroSearch();
    enhanceHScroll($('#genreCarousel'));
    enhanceHScroll($('#arrivalsScroller'));
    // Фото филиала берутся с сайта СПбГУ; если не загрузились — аккуратная заглушка вместо «битой» картинки.
    $$('[data-photo]').forEach((img) => {
      const fail = () => img.closest('figure').classList.add('ph-failed');
      img.addEventListener('error', fail);
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
    });
    setContactsTab('spb');
    $('#year').textContent = String(new Date().getFullYear());

    // Глобальные клики: тема, контакты, плавная прокрутка к блокам главной.
    document.addEventListener('click', (e) => {
      const themeBtn = e.target.closest('[data-action="theme"]');
      if (themeBtn) { toggleTheme(); return; }
      const contacts = e.target.closest('[data-action="contacts"]');
      if (contacts) { e.preventDefault(); scrollToContacts(); setActiveNav('contacts'); return; }
      const scrollBtn = e.target.closest('[data-scroll]');
      if (scrollBtn) { const target = document.getElementById(scrollBtn.dataset.scroll); if (target) target.scrollIntoView({ behavior: 'smooth' }); return; }
      if (!e.target.closest('#nav') && !e.target.closest('#burger')) closeMenu();
    });
    $$('.lang button').forEach((b) => b.addEventListener('click', () => i18n.setLang(b.dataset.lang)));
    $('#burger').addEventListener('click', () => {
      const open = $('#nav').classList.toggle('open');
      $('#burger').setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#nav').classList.contains('open')) { closeMenu(); $('#burger').focus(); } });
    $$('.tabs [role="tab"]').forEach((b) => b.addEventListener('click', () => setContactsTab(b.dataset.tab)));
    $('#heroImg').addEventListener('error', (e) => e.target.remove());
    $$('.ph img').forEach((img) => img.addEventListener('error', () => img.remove()));
    window.addEventListener('scroll', () => $('#hdr').classList.toggle('scrolled', window.scrollY > 10), { passive: true });

    i18n.onChange(() => { syncLangButtons(); renderNav(); renderHome(); fillIcons(); });

    window.addEventListener('hashchange', () => { hashChangedInApp = true; route(); });
    route();
    observeReveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.SPBU = window.SPBU || {});
