/**
 * config.js — настройки каталога.
 *
 * НОВЫЙ ЖАНР = ОДНА СТРОКА в массиве GENRES. Он сам появится в меню, на главной
 * (лента жанров), в каталоге и в подвале.
 *   id      — латиницей, становится адресом раздела: #/genre/<id>
 *   subject — тема Open Library, по которой загружаются книги раздела
 *   ru / uz — название раздела на двух языках
 *   icon    — иконка из utils.js: chart, code, scale, book, flask, globe, brain, palette, heart, cpu
 *   subs    — подкатегории (тоже темы Open Library). Перевод подписи можно добавить
 *             в i18n.js (ключ subj.<тема>), иначе выводится сама тема с большой буквы.
 *
 * НОВЫЙ ЯЗЫК ФИЛЬТРА = ОДНА СТРОКА в LANGUAGES. Код — трёхбуквенный MARC-код,
 * так язык хранится в Open Library: rus, uzb, eng, kaz, tur, deu, fre…
 */
(function (NS) {
  'use strict';

  const GENRES = [
    { id: 'economics',   subject: 'economics',            ru: 'Экономика',        uz: 'Iqtisodiyot', icon: 'chart', subs: ['finance', 'insurance', 'management', 'marketing', 'economic history', 'macroeconomics', 'microeconomics'] },
    { id: 'programming', subject: 'computer programming', ru: 'Программирование', uz: 'Dasturlash',  icon: 'code',  subs: ['information technology', 'management information systems', 'python', 'javascript', 'algorithms', 'databases'] },
    { id: 'law',         subject: 'law',                  ru: 'Право',            uz: 'Huquq',       icon: 'scale', subs: ['constitutional law', 'civil law', 'criminal law', 'international law', 'conflict of laws', 'comparative law', 'maritime law', 'jurisprudence', 'political science'] },
  ];

  const LANGUAGES = [
    { code: 'rus', ru: 'Русский',    uz: 'Rus tili' },
    { code: 'uzb', ru: 'Узбекский',  uz: "O'zbek tili" },
    { code: 'eng', ru: 'Английский', uz: 'Ingliz tili' },
    { code: 'ger', ru: 'Немецкий',   uz: 'Nemis tili' },
  ];

  /** Типы изданий фонда института (подписи — в i18n.js, ключи type.*). */
  const BOOK_TYPES = ['textbook', 'lectures', 'monograph', 'journal', 'collection', 'laws', 'business', 'popular', 'stories', 'guide'];

  const SETTINGS = {
    pageSize: 20,          // книг на страницу и на «полку» жанра
    debounceMs: 400,       // пауза после ввода перед запросом
    minQueryLength: 3,     // минимальная длина запроса
    defaultFullOnly: true, // «Только полные книги» включён по умолчанию
    minYear: 1450,
  };

  NS.config = Object.freeze({ GENRES, LANGUAGES, BOOK_TYPES, SETTINGS });
})(window.SPBU = window.SPBU || {});
