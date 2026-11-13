/**
 * search-engine.js — полнотекстовый поиск по фонду института (работает без интернета).
 *
 * Что умеет:
 *   • ищет по названию, автору, темам, издательству, описанию и тексту страниц (OCR сканов, главы книг);
 *   • кириллица = латиница: «siyosatshunoslik» находит «Сиёсатшунослик», «pravo» — «право»;
 *   • узбекские буквы ў/қ/ғ/ҳ и o'/g' приводятся к общему виду;
 *   • разные окончания слов (страхование / страхования) и опечатки (до 1–2 букв);
 *   • все слова запроса должны найтись (логическое И), лучшие совпадения — выше;
 *   • фрагмент текста с подсветкой и номером страницы; «Возможно, вы искали…».
 *
 * Индекс строится один раз при запуске: словарь основ слов → список вхождений.
 */
(function (NS) {
  'use strict';

  const { escapeHtml: esc } = NS.utils;

  /* ---------- Нормализация: всё приводится к латинскому «ключу» ---------- */
  const CYR = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
    н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh',
    ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya', ў: 'o', қ: 'k', ғ: 'g', ҳ: 'h', і: 'i', ә: 'a', ө: 'o', ү: 'u', ң: 'n',
  };
  const LAT_FIX = [[/kh/g, 'x'], [/zh/g, 'j'], [/q/g, 'k'], [/w/g, 'v'], [/ä/g, 'a'], [/ö/g, 'o'], [/ü/g, 'u'], [/ß/g, 'ss'], [/[éèê]/g, 'e']];
  const ENDINGS = ['iyami', 'yami', 'ami', 'iyax', 'yax', 'ogo', 'ego', 'omu', 'emu', 'iye', 'iya', 'iyu', 'uyu', 'aya', 'yaya',
    'iy', 'yy', 'oy', 'ey', 'ov', 'ev', 'om', 'em', 'am', 'im', 'ix', 'ax', 'ie', 'ye', 'ya', 'yu', 'oe', 'ee', 'a', 'e', 'i', 'o', 'u', 'y'];
  const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}'ʻ’ʼ`]*/gu;

  function toKey(word) {
    let s = word.toLowerCase().replace(/['ʻ’ʼ`‘]/g, '');
    let out = '';
    for (const ch of s) out += CYR[ch] !== undefined ? CYR[ch] : ch;
    for (const [re, rep] of LAT_FIX) out = out.replace(re, rep);
    return out;
  }
  function stem(key) {
    if (key.length < 5 || /^\d+$/.test(key)) return key;
    for (const end of ENDINGS) {
      if (key.endsWith(end) && key.length - end.length >= 4) return key.slice(0, -end.length);
    }
    return key;
  }
  const termOf = (word) => stem(toKey(word));
  const tokenize = (text) => (String(text || '').match(WORD_RE) || []);

  /** Расстояние Левенштейна с ранним выходом (max — допустимый предел). */
  function distance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      let rowMin = i;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }

  /* ---------- Индекс ---------- */
  // Поля: 0 название, 1 автор, 2 темы/жанр/тип, 3 издательство, 4 описание, 5 текст страниц
  const WEIGHTS = [10, 6, 4, 3, 2, 1];
  const FIELD_SETS = { all: [0, 1, 2, 3, 4, 5], title: [0], author: [1], subject: [2] };

  const state = { books: [], postings: new Map(), vocab: [], display: new Map(), freq: new Map(), pages: new Map() };

  function add(term, bookIdx, field, page) {
    if (!term) return;
    let list = state.postings.get(term);
    if (!list) { list = []; state.postings.set(term, list); }
    const last = list[list.length - 1];
    if (last && last[0] === bookIdx && last[1] === field && last[2] === page) return;
    list.push([bookIdx, field, page]);
  }

  function indexText(text, bookIdx, field, page = 0) {
    for (const word of tokenize(text)) {
      if (word.length < 2) continue;
      const term = termOf(word);
      add(term, bookIdx, field, page);
      if (!state.display.has(term)) state.display.set(term, word.toLowerCase());
    }
  }

  /** Строит индекс. pagesText(book) → массив строк (страницы или главы). */
  function build(books, fulltext = {}) {
    const i18n = NS.i18n.dictionaries;
    const { GENRES } = NS.config;
    state.books = books;
    state.postings = new Map();
    state.display = new Map();
    state.pages = new Map();
    books.forEach((b, idx) => {
      indexText(`${b.title.ru} ${b.title.uz}`, idx, 0);
      indexText(`${b.author.ru} ${b.author.uz}`, idx, 1);
      const genre = GENRES.find((g) => g.id === b.genre);
      const subjectWords = b.subjects.flatMap((s) => [s, i18n.ru['subj.' + s] || '', i18n.uz['subj.' + s] || ''])
        .concat(genre ? [genre.ru, genre.uz, genre.subject] : [], [i18n.ru['type.' + b.type] || '', i18n.uz['type.' + b.type] || '']);
      indexText(subjectWords.join(' '), idx, 2);
      indexText(b.publisher || '', idx, 3);
      indexText(`${b.description.ru} ${b.description.uz}`, idx, 4);
      let pages;
      if (b.format === 'pdf') pages = Array.isArray(fulltext[b.id]) ? fulltext[b.id].map(String) : [];
      else pages = b.chapters.map((c) => [c.title.ru, c.title.uz].concat(c.content.ru, c.content.uz).filter((x) => typeof x === 'string').join('\n'));
      state.pages.set(b.id, pages);
      pages.forEach((text, p) => indexText(text, idx, 5, p + 1));
    });
    state.vocab = Array.from(state.postings.keys());
    state.freq = new Map(state.vocab.map((t) => [t, state.postings.get(t).length]));
  }

  /** Все словарные основы, подходящие к термину запроса, с «качеством» совпадения. */
  function expand(term) {
    const found = new Map();
    if (state.postings.has(term)) found.set(term, 1);
    const fuzzyMax = term.length >= 8 ? 2 : term.length >= 4 ? 1 : 0;
    for (const v of state.vocab) {
      if (found.has(v)) continue;
      if (term.length >= 3 && v.startsWith(term)) { found.set(v, 0.85); continue; }
      if (v.length >= 4 && term.startsWith(v) && term.length - v.length <= 2) { found.set(v, 0.8); continue; }
      if (fuzzyMax && Math.abs(v.length - term.length) <= fuzzyMax && v[0] === term[0]) {
        const d = distance(term, v, fuzzyMax);
        // Две ошибки допускаем осторожнее: близкая длина и одинаковое начало слова.
        if (d <= fuzzyMax && (d === 1 || (Math.abs(v.length - term.length) <= 1 && v.slice(0, 2) === term.slice(0, 2)))) {
          found.set(v, d === 1 ? 0.6 : 0.4);
        }
      }
    }
    return found;
  }

  function queryTerms(query) {
    const seen = new Set();
    return tokenize(query).map(termOf).filter((t) => t.length >= 2 && !seen.has(t) && seen.add(t));
  }

  /**
   * @returns {{ results: Map<string, {score:number, pages:number[], fields:Set<number>}>, matched: Set<string>, terms: string[] }}
   *   matched — все словарные основы, которые совпали (для подсветки).
   */
  function search(query, { field = 'all' } = {}) {
    const terms = queryTerms(query);
    const allowed = new Set(FIELD_SETS[field] || FIELD_SETS.all);
    const matched = new Set();
    if (!terms.length) return { results: new Map(), matched, terms };

    let combined = null;
    for (const term of terms) {
      const perBook = new Map(); // bookIdx → { best, pages:Set, fields:Set }
      for (const [token, quality] of expand(term)) {
        let used = false;
        for (const [bookIdx, f, page] of state.postings.get(token)) {
          if (!allowed.has(f)) continue;
          used = true;
          let entry = perBook.get(bookIdx);
          if (!entry) { entry = { best: 0, pages: new Set(), fields: new Set() }; perBook.set(bookIdx, entry); }
          entry.best = Math.max(entry.best, WEIGHTS[f] * quality);
          entry.fields.add(f);
          if (f === 5) entry.pages.add(page);
        }
        if (used) matched.add(token);
      }
      if (!combined) {
        combined = perBook;
      } else {
        // Логическое И: остаются книги, где нашлись все слова запроса.
        for (const [bookIdx, entry] of combined) {
          const next = perBook.get(bookIdx);
          if (!next) { combined.delete(bookIdx); continue; }
          entry.best += next.best;
          next.fields.forEach((f) => entry.fields.add(f));
          // Страницы, где есть все слова, ценнее — оставляем пересечение, если оно не пустое.
          const both = new Set([...entry.pages].filter((p) => next.pages.has(p)));
          entry.pages = both.size ? both : new Set([...entry.pages, ...next.pages]);
        }
      }
    }

    const results = new Map();
    for (const [bookIdx, entry] of combined || []) {
      const book = state.books[bookIdx];
      const phraseBonus = toKey(`${book.title.ru} ${book.title.uz}`).includes(toKey(query.trim())) ? 8 : 0;
      results.set(book.id, {
        score: entry.best + phraseBonus + Math.min(1, entry.pages.size * 0.2),
        pages: [...entry.pages].sort((a, b) => a - b),
        fields: entry.fields,
      });
    }
    return { results, matched, terms };
  }

  /** Экранированный HTML с <mark> на словах, чьи основы совпали с запросом. */
  function markup(text, matched) {
    const raw = String(text ?? '');
    if (!matched || !matched.size) return esc(raw);
    let out = '';
    let last = 0;
    for (const m of raw.matchAll(WORD_RE)) {
      out += esc(raw.slice(last, m.index));
      const hit = matched.has(termOf(m[0]));
      out += hit ? `<mark>${esc(m[0])}</mark>` : esc(m[0]);
      last = m.index + m[0].length;
    }
    return out + esc(raw.slice(last));
  }

  /** Короткий фрагмент страницы вокруг найденных слов. */
  function snippet(bookId, page, matched, maxLen = 170) {
    const pages = state.pages.get(bookId) || [];
    const text = String(pages[page - 1] || '').replace(/\s*\n\s*/g, ' · ');
    if (!text) return '';
    let pos = -1;
    for (const m of text.matchAll(WORD_RE)) {
      if (matched.has(termOf(m[0]))) { pos = m.index; break; }
    }
    if (pos === -1) return markup(text.slice(0, maxLen), matched);
    const start = Math.max(0, pos - 50);
    let piece = text.slice(start, start + maxLen);
    if (start > 0) piece = '…' + piece.replace(/^\S*\s/, '');
    if (start + maxLen < text.length) piece = piece.replace(/\s\S*$/, '') + '…';
    return markup(piece, matched);
  }

  /** «Возможно, вы искали…»: для каждого слова — самое частое близкое слово словаря. */
  function suggest(query) {
    let changed = false;
    const words = tokenize(query).map((word) => {
      const term = termOf(word);
      if (state.postings.has(term) || term.length < 3) return word;
      let best = null;
      let bestScore = Infinity;
      for (const v of state.vocab) {
        if (Math.abs(v.length - term.length) > 2) continue;
        const d = distance(term, v, 2);
        if (d > 2) continue;
        const score = d * 1000 - state.freq.get(v);
        if (score < bestScore) { bestScore = score; best = v; }
      }
      if (!best) return word;
      changed = true;
      return state.display.get(best) || word;
    });
    return changed ? words.join(' ') : null;
  }

  NS.searchEngine = { build, search, markup, snippet, suggest, toKey, termOf };
})(window.SPBU = window.SPBU || {});
