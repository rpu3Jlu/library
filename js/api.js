/**
 * api.js — вся работа с Open Library (ключ API не нужен).
 *
 * Публичные функции:
 *   searchBooks(params, { signal })  — поиск книг (search.json)
 *   getBookDetails(key, { signal })  — подробности о произведении (/works/OL…W.json)
 *   getCoverUrl(coverId, size)       — адрес обложки (S | M | L)
 *   getArchiveLinks(iaId)            — ссылки Internet Archive: встраивание, PDF, страница
 *   getOpenLibraryUrl(key)           — страница книги на Open Library
 *   loadLocalBooks()                 — фонд института (data/local-books.js)
 *
 * Что сделано для надёжности:
 *   • кэш ответов в памяти (Map) и в sessionStorage (обёрнут в try/catch), срок жизни 30 минут;
 *   • одинаковые одновременные запросы объединяются в один;
 *   • очередь: не чаще 1 запроса в секунду (требование Open Library);
 *   • отмена через AbortController: если все, кто ждал ответ, отменились, запрос тоже отменяется;
 *   • таймаут 10 секунд, понятные ошибки на русском (ApiError.code переводится в интерфейсе).
 */
(function (NS) {
  'use strict';

  const BASE_URL = 'https://openlibrary.org';
  const COVERS_URL = 'https://covers.openlibrary.org/b/id/';
  const ARCHIVE_URL = 'https://archive.org';
  const SEARCH_FIELDS = [
    'key', 'title', 'author_name', 'first_publish_year', 'cover_i', 'subject', 'language',
    'edition_count', 'ebook_access', 'ia', 'number_of_pages_median',
  ].join(',');

  const TIMEOUT_MS = 10000;
  const MIN_INTERVAL_MS = 1000;
  const CACHE_PREFIX = 'spbu-ol:v1:';
  const CACHE_TTL_MS = 30 * 60 * 1000;
  const MEMORY_LIMIT = 150;
  const SORTS = new Set(['new', 'old', 'title']);
  const ACCESS_VALUES = ['public', 'borrowable', 'printdisabled', 'unclassified', 'no_ebook'];

  const ERROR_MESSAGES = {
    offline: 'Нет подключения к интернету. Проверьте сеть и повторите попытку.',
    timeout: 'Open Library не ответил за 10 секунд. Попробуйте ещё раз чуть позже.',
    network: 'Не удалось связаться с Open Library. Проверьте интернет или повторите позже.',
    rateLimited: 'Слишком много запросов к Open Library. Подождите минуту и повторите.',
    server: 'Сервис Open Library временно недоступен. Повторите попытку позже.',
    notFound: 'Книга не найдена в Open Library.',
    http: 'Open Library вернул ошибку. Повторите попытку.',
    parse: 'Open Library прислал некорректный ответ.',
    badKey: 'Некорректный идентификатор книги.',
    aborted: 'Запрос отменён.',
    unknown: 'Что-то пошло не так. Повторите попытку.',
  };

  class ApiError extends Error {
    constructor(code, status = 0) {
      super(ERROR_MESSAGES[code] || ERROR_MESSAGES.unknown);
      this.name = 'ApiError';
      this.code = ERROR_MESSAGES[code] ? code : 'unknown';
      this.status = status;
    }
  }
  const abortError = () => new ApiError('aborted');
  const isAbortError = (err) => Boolean(err) && (err.code === 'aborted' || err.name === 'AbortError');

  /* ---------- Проверка идентификаторов перед подстановкой в адреса ---------- */
  const isValidWorkKey = (key) => typeof key === 'string' && /^\/works\/OL\d+W$/.test(key);
  const isValidIaId = (id) => typeof id === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/.test(id);

  /* ================= Кэш: Map + sessionStorage ================= */
  const memoryCache = new Map();

  function remember(key, value) {
    memoryCache.delete(key); // переставляем в конец — так Map работает как LRU
    memoryCache.set(key, value);
    if (memoryCache.size > MEMORY_LIMIT) memoryCache.delete(memoryCache.keys().next().value);
  }

  function readCache(key) {
    if (memoryCache.has(key)) {
      const value = memoryCache.get(key);
      remember(key, value);
      return value;
    }
    try {
      const raw = sessionStorage.getItem(CACHE_PREFIX + key);
      if (raw) {
        const entry = JSON.parse(raw);
        if (entry && Date.now() - entry.t < CACHE_TTL_MS) {
          remember(key, entry.v);
          return entry.v;
        }
        sessionStorage.removeItem(CACHE_PREFIX + key);
      }
    } catch (e) { /* sessionStorage недоступен или данные повреждены — просто идём в сеть */ }
    return undefined;
  }

  function clearSessionCache() {
    try {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) sessionStorage.removeItem(k);
      }
    } catch (e) { /* игнорируем */ }
  }

  function writeCache(key, value) {
    remember(key, value);
    const payload = JSON.stringify({ t: Date.now(), v: value });
    try {
      sessionStorage.setItem(CACHE_PREFIX + key, payload);
    } catch (e) {
      // Скорее всего переполнено хранилище: чистим свой кэш и пробуем ещё раз.
      try { clearSessionCache(); sessionStorage.setItem(CACHE_PREFIX + key, payload); } catch (e2) { /* хватит и памяти */ }
    }
  }

  function clearCache() { memoryCache.clear(); clearSessionCache(); }

  /* ================= Очередь: не чаще 1 запроса в секунду ================= */
  const queue = [];
  let lastStartedAt = 0;
  let pumpTimer = null;

  function pump() {
    if (pumpTimer || !queue.length) return;
    const wait = Math.max(0, lastStartedAt + MIN_INTERVAL_MS - Date.now());
    pumpTimer = setTimeout(() => {
      pumpTimer = null;
      const item = queue.shift();
      if (item) {
        lastStartedAt = Date.now();
        item.release();
      }
      pump();
    }, wait);
  }

  /** Ждёт своей очереди. Отменённый запрос сразу уходит из очереди и не тратит «слот». */
  function acquireSlot(signal) {
    return new Promise((resolve, reject) => {
      if (signal.aborted) { reject(abortError()); return; }
      const item = {};
      const onAbort = () => {
        const index = queue.indexOf(item);
        if (index !== -1) queue.splice(index, 1);
        reject(abortError());
      };
      item.release = () => { signal.removeEventListener('abort', onAbort); resolve(); };
      signal.addEventListener('abort', onAbort, { once: true });
      queue.push(item);
      pump();
    });
  }

  /* ================= Сетевой запрос с таймаутом ================= */
  function httpError(status) {
    if (status === 404) return new ApiError('notFound', status);
    if (status === 429) return new ApiError('rateLimited', status);
    if (status >= 500) return new ApiError('server', status);
    return new ApiError('http', status);
  }

  async function performRequest(url, signal) {
    await acquireSlot(signal);
    if (navigator.onLine === false) throw new ApiError('offline');

    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, TIMEOUT_MS);
    const onAbort = () => controller.abort();
    signal.addEventListener('abort', onAbort, { once: true });

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
        credentials: 'omit',
        mode: 'cors',
      });
      if (!response.ok) throw httpError(response.status);
      try {
        return await response.json();
      } catch (parseErr) {
        if (timedOut) throw new ApiError('timeout');
        if (signal.aborted) throw abortError();
        throw new ApiError('parse');
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if (timedOut) throw new ApiError('timeout');
      if (signal.aborted) throw abortError();
      throw new ApiError(navigator.onLine === false ? 'offline' : 'network');
    } finally {
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
    }
  }

  /* ================= Объединение одинаковых запросов ================= */
  const inflight = new Map(); // url -> { promise, controller, users }

  function request(url, signal) {
    let entry = inflight.get(url);
    if (!entry) {
      const controller = new AbortController();
      entry = { controller, users: 0, promise: null };
      const current = entry;
      entry.promise = performRequest(url, controller.signal).finally(() => {
        if (inflight.get(url) === current) inflight.delete(url);
      });
      entry.promise.catch(() => { /* ошибку получат подписчики ниже */ });
      inflight.set(url, entry);
    }
    entry.users += 1;
    const shared = entry;

    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = (fn, value) => {
        if (settled) return;
        settled = true;
        if (signal) signal.removeEventListener('abort', onAbort);
        fn(value);
      };
      function onAbort() {
        if (settled) return;
        shared.users -= 1;
        if (shared.users <= 0) {
          if (inflight.get(url) === shared) inflight.delete(url);
          shared.controller.abort(); // больше никто не ждёт — отменяем сам запрос
        }
        finish(reject, abortError());
      }
      if (signal) {
        if (signal.aborted) { onAbort(); return; }
        signal.addEventListener('abort', onAbort, { once: true });
      }
      shared.promise.then((v) => finish(resolve, v), (e) => finish(reject, e));
    });
  }

  /** Берёт из кэша или делает запрос, нормализует ответ и кладёт в кэш. */
  async function cachedRequest(url, signal, transform) {
    const cached = readCache(url);
    if (cached !== undefined) return cached;
    const raw = await request(url, signal);
    const value = transform(raw);
    writeCache(url, value);
    return value;
  }

  /* ================= Построение поискового запроса ================= */
  /** Убираем спецсимволы синтаксиса Solr, чтобы ввод пользователя не ломал запрос. */
  function sanitizeTerm(value) {
    return String(value || '')
      .replace(/[+\-&|!(){}[\]^"~*?:\\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 150);
  }
  const quoted = (value) => '"' + sanitizeTerm(value) + '"';

  /**
   * Фильтры передаются внутри q: параметр language в адресе Open Library только
   * влияет на ранжирование и не отсеивает книги (так сказано в документации).
   */
  function buildQuery(params) {
    const parts = [];
    const text = sanitizeTerm(params.q);
    if (text) parts.push(text);
    if (sanitizeTerm(params.title)) parts.push('title:' + quoted(params.title));
    if (sanitizeTerm(params.author)) parts.push('author:' + quoted(params.author));
    const subjects = [].concat(params.subject || []).filter((s) => sanitizeTerm(s));
    subjects.forEach((s) => parts.push('subject:' + quoted(s)));
    if (/^[a-z]{3}$/.test(params.language || '')) parts.push('language:' + params.language);
    if (params.fullOnly) parts.push('ebook_access:public');
    const from = Number.isInteger(params.yearFrom) ? params.yearFrom : null;
    const to = Number.isInteger(params.yearTo) ? params.yearTo : null;
    if (from !== null || to !== null) parts.push(`first_publish_year:[${from ?? '*'} TO ${to ?? '*'}]`);
    return parts.join(' ');
  }

  /* ================= Нормализация ответа ================= */
  const strList = (value, limit) => (Array.isArray(value) ? value.filter((v) => typeof v === 'string').slice(0, limit) : []);

  function normalizeDoc(doc) {
    if (!doc || !isValidWorkKey(doc.key)) return null;
    return {
      source: 'ol',
      uid: 'ol:' + doc.key,
      key: doc.key,
      title: typeof doc.title === 'string' && doc.title.trim() ? doc.title.trim() : '—',
      authors: strList(doc.author_name, 4),
      year: Number.isInteger(doc.first_publish_year) ? doc.first_publish_year : null,
      coverId: Number.isInteger(doc.cover_i) && doc.cover_i > 0 ? doc.cover_i : null,
      subjects: strList(doc.subject, 14),
      languages: strList(doc.language, 12).filter((c) => /^[a-z]{3}$/.test(c)),
      editionCount: Number.isInteger(doc.edition_count) ? doc.edition_count : null,
      pages: Number.isInteger(doc.number_of_pages_median) ? doc.number_of_pages_median : null,
      access: ACCESS_VALUES.includes(doc.ebook_access) ? doc.ebook_access : 'no_ebook',
      ia: strList(doc.ia, 3).filter(isValidIaId),
    };
  }

  /** description бывает строкой или объектом { type, value } — обрабатываем оба варианта. */
  function extractText(value) {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && typeof value.value === 'string') return value.value;
    return '';
  }

  /* ================= Публичные функции ================= */

  /**
   * @param {object} params
   *   q, title, author, subject (строка или массив), language ('rus'|'uzb'|'eng'…),
   *   fullOnly (только ebook_access = public), yearFrom, yearTo,
   *   sort ('new'|'old'|'title'|''), page (с 1), limit (по умолчанию 20), uiLang ('ru'|'uz')
   * @returns {Promise<{numFound:number, page:number, limit:number, docs:object[]}>}
   */
  async function searchBooks(params = {}, { signal } = {}) {
    const query = buildQuery(params);
    const page = NS.utils.clampInt(params.page, 1, 500, 1);
    const limit = NS.utils.clampInt(params.limit, 1, 100, 20);
    if (!query) return { numFound: 0, page, limit, docs: [] };

    const url = new URL('/search.json', BASE_URL);
    url.searchParams.set('q', query);
    url.searchParams.set('fields', SEARCH_FIELDS);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('page', String(page));
    if (SORTS.has(params.sort)) url.searchParams.set('sort', params.sort);
    // Язык интерфейса (2 буквы) Open Library учитывает только при ранжировании.
    if (/^[a-z]{2}$/.test(params.uiLang || '')) url.searchParams.set('lang', params.uiLang);

    return cachedRequest(url.toString(), signal || new AbortController().signal, (raw) => {
      if (!raw || !Array.isArray(raw.docs)) throw new ApiError('parse');
      const found = Number(raw.numFound ?? raw.num_found ?? 0);
      return {
        numFound: Number.isFinite(found) ? found : 0,
        page,
        limit,
        docs: raw.docs.map(normalizeDoc).filter(Boolean),
      };
    });
  }

  /**
   * @param {string} key — вида "/works/OL45804W"
   * @returns {Promise<{key, title, description, subjects, covers, firstPublishDate}>}
   */
  async function getBookDetails(key, { signal } = {}) {
    if (!isValidWorkKey(key)) throw new ApiError('badKey');
    const sig = signal || new AbortController().signal;
    const normalize = (raw) => ({
      key,
      title: typeof raw.title === 'string' ? raw.title : '',
      description: extractText(raw.description).trim(),
      subjects: strList(raw.subjects, 20),
      covers: Array.isArray(raw.covers) ? raw.covers.filter((c) => Number.isInteger(c) && c > 0) : [],
      firstPublishDate: typeof raw.first_publish_date === 'string' ? raw.first_publish_date : '',
      redirect: raw && raw.type && raw.type.key === '/type/redirect' && isValidWorkKey(raw.location) ? raw.location : null,
    });
    const details = await cachedRequest(`${BASE_URL}${key}.json`, sig, normalize);
    // Объединённые записи Open Library отдают «перенаправление» — проходим по нему один раз.
    if (details.redirect && details.redirect !== key) {
      const target = await cachedRequest(`${BASE_URL}${details.redirect}.json`, sig, normalize);
      return { ...target, key };
    }
    return details;
  }

  /** @returns {string|null} адрес обложки или null, если обложки нет */
  function getCoverUrl(coverId, size = 'M') {
    const s = ['S', 'M', 'L'].includes(size) ? size : 'M';
    return Number.isInteger(coverId) && coverId > 0 ? `${COVERS_URL}${coverId}-${s}.jpg` : null;
  }

  function getArchiveLinks(iaId) {
    if (!isValidIaId(iaId)) return null;
    const id = encodeURIComponent(iaId);
    return {
      embed: `${ARCHIVE_URL}/embed/${id}`,
      pdf: `${ARCHIVE_URL}/download/${id}/${id}.pdf`,
      details: `${ARCHIVE_URL}/details/${id}`,
    };
  }

  function getOpenLibraryUrl(key) {
    return isValidWorkKey(key) ? BASE_URL + key : BASE_URL;
  }

  /* ================= Фонд института ================= */
  const pick = (obj) => ({ ru: String((obj && obj.ru) || ''), uz: String((obj && (obj.uz || obj.ru)) || '') });
  const isSafeLocalPath = (p) => typeof p === 'string' && /^books\/(?:pdf\/)?[A-Za-z0-9._-]+\.pdf$/.test(p);
  const isSafeImage = (p) => typeof p === 'string' && (/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p) || /^books\/(?:covers|pages)\/[a-z0-9-]+(?:\/\d+)?\.(?:jpg|png|webp)$/.test(p));
  const isSafeCover = isSafeImage;
  const isSafeDir = (p) => typeof p === 'string' && /^books\/pages\/[a-z0-9-]+$/.test(p);
  const BOOK_TYPES = NS.config.BOOK_TYPES;

  function normalizeLocal(book) {
    if (!book || typeof book.id !== 'string' || !/^[a-z0-9-]+$/.test(book.id)) return null;
    const isPdf = book.format === 'pdf';
    const common = {
      source: 'local',
      uid: 'local:' + book.id,
      id: book.id,
      format: isPdf ? 'pdf' : 'text',
      genre: String(book.genre || ''),
      type: BOOK_TYPES.includes(book.type) ? book.type : 'guide',
      subjects: strList(book.subjects, 20),
      level: book.level === 'mid' ? 'mid' : 'beg',
      year: Number.isInteger(book.year) ? book.year : null,
      languages: strList(book.languages, 5),
      title: pick(book.title),
      author: pick(book.author),
      description: pick(book.description),
      publisher: typeof book.publisher === 'string' ? book.publisher : '',
      added: typeof book.added === 'string' ? book.added : '',
    };
    if (isPdf) {
      const pageCount = Number.isInteger(book.pageCount) && book.pageCount > 0 ? Math.min(book.pageCount, 2000) : 0;
      const pagesDir = isSafeDir(book.pagesDir) ? book.pagesDir : null;
      return {
        ...common,
        pdf: isSafeLocalPath(book.pdf) ? book.pdf : null,
        cover: isSafeCover(book.cover) ? book.cover : null,
        pagesDir,
        // необязательно: явный список картинок страниц (например, встроенных в однофайловую версию)
        pageImages: Array.isArray(book.pageImages) && book.pageImages.length === pageCount && book.pageImages.every(isSafeImage) ? book.pageImages : null,
        pageCount,
        // высота/ширина каждой страницы — чтобы место под страницу резервировалось заранее
        ratios: Array.from({ length: pageCount }, (_, i) => {
          const r = Array.isArray(book.ratios) ? Number(book.ratios[i]) : NaN;
          return Number.isFinite(r) && r > 0.2 && r < 5 ? r : 1.414;
        }),
        fragment: Boolean(book.fragment),
        chapters: [],
      };
    }
    const chapters = Array.isArray(book.chapters) ? book.chapters : [];
    return {
      ...common,
      pdf: {
        ru: isSafeLocalPath(book.pdf && book.pdf.ru) ? book.pdf.ru : null,
        uz: isSafeLocalPath(book.pdf && book.pdf.uz) ? book.pdf.uz : null,
      },
      cover: null,
      chapters: chapters.map((ch) => ({
        title: pick(ch.title),
        content: {
          ru: Array.isArray(ch.content && ch.content.ru) ? ch.content.ru : [],
          uz: Array.isArray(ch.content && ch.content.uz) ? ch.content.uz : [],
        },
      })),
    };
  }

  /** Текст страниц PDF-книг для полнотекстового поиска (data/search-index.js). */
  function loadFulltext() {
    const data = window.LOCAL_FULLTEXT && typeof window.LOCAL_FULLTEXT === 'object' ? window.LOCAL_FULLTEXT : {};
    return Promise.resolve(data);
  }

  /**
   * Фонд института. Сейчас данные лежат в data/local-books.js, чтобы сайт работал
   * и при открытии двойным кликом. На сервере можно заменить тело функции на:
   *   return fetch('data/local-books.json').then(r => r.json()).then(list => list.map(normalizeLocal).filter(Boolean));
   */
  function loadLocalBooks() {
    const list = Array.isArray(window.LOCAL_BOOKS) ? window.LOCAL_BOOKS : [];
    return Promise.resolve(list.map(normalizeLocal).filter(Boolean));
  }

  NS.api = Object.freeze({
    searchBooks,
    getBookDetails,
    getCoverUrl,
    getArchiveLinks,
    getOpenLibraryUrl,
    loadLocalBooks,
    loadFulltext,
    isAbortError,
    isValidIaId,
    isValidWorkKey,
    clearCache,
    ApiError,
  });
})(window.SPBU = window.SPBU || {});
