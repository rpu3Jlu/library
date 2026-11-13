/**
 * i18n.js — переводы интерфейса (RU / UZ).
 * t('key', { n: 5 }) подставляет {n}. Если ключа нет в узбекском — берётся русский.
 */
(function (NS) {
  'use strict';

  const DICT = {
    ru: {
      'doc.title': 'Электронная библиотека СПбГУ',
      'skip': 'Перейти к содержимому',
      'logo.sub': 'Электронная библиотека',
      'nav.home': 'Главная', 'nav.catalog': 'Каталог', 'nav.contacts': 'Контакты', 'nav.menu': 'Меню',
      'theme.toggle': 'Сменить тему', 'lang.group': 'Язык сайта',

      'hero.badge': 'Основан в 1724 году · Один из старейших университетов России',
      'hero.title': 'Электронная библиотека <em>СПбГУ</em>',
      'hero.sub': 'Книги по экономике, программированию и праву: фонд института и тысячи книг из Open Library. Читайте онлайн бесплатно — на русском, узбекском и английском.',
      'hero.cta.catalog': 'Каталог книг', 'hero.cta.genres': 'Жанры', 'hero.cta.why': 'Почему СПбГУ',
      'hero.popular': 'Популярное:',

      'search.label': 'Поиск книг', 'search.ph': 'Название, автор или тема — например, «Python» или «Адам Смит»',
      'search.ph.short': 'Название, автор или тема', 'search.btn': 'Найти',
      'search.min': 'Введите не меньше {n} символов', 'search.loading': 'Ищем книги…',
      'search.none': 'Ничего не нашлось. Попробуйте другое слово или английское название.',
      'search.all': 'Все результаты', 'search.local': 'Фонд института',

      'stat.1': 'год основания', 'stat.2': 'лет истории', 'stat.3': 'факультета и института', 'stat.4': 'студентов',
      'about.kicker': 'Об университете', 'about.title': 'Санкт-Петербургский государственный университет',
      'about.p1': 'СПбГУ ведёт свою историю от указа Петра I 1724 года, по которому вместе с Академией наук были учреждены университет и гимназия. Сегодня это один из ведущих классических университетов России.',
      'about.p2': 'Сердце университета — здание Двенадцати коллегий на Васильевском острове, крупнейший памятник петровского барокко, построенный в 1722–1744 годах по проекту Доменико Трезини. Основные кампусы расположены на Васильевском острове и в Петергофе.',
      'about.p3': 'Университет объединяет 24 факультета и института, более 32 тысяч студентов и научные школы мирового уровня — от математики и физики до экономики и права.',
      'about.f1k': 'Девиз', 'about.f1v': 'Hic tuta perennat — «Здесь в безопасности пребывает»',
      'about.f2k': 'Кампусы', 'about.f2v': 'Васильевский остров и Петергоф',
      'about.f3k': 'Библиотека', 'about.f3v': 'Научная библиотека им. М. Горького',
      'about.f4k': 'Филиал', 'about.f4v': 'Ташкент, Узбекистан',
      'about.badge': 'Указ Петра I',
      'photo.cap1': 'Здание Двенадцати коллегий — главное здание университета',
      'photo.cap2': 'Университетская набережная на Неве', 'photo.cap3': 'Университетская набережная',

      'fame.kicker': 'Чем знаменит', 'fame.title': 'Три века открытий',
      'fame.sub': 'Здесь делали открытия, которые изменили науку, а выпускники университета получали высшие мировые награды.',
      'fame.1t': 'Указ Петра I', 'fame.1d': 'История университета начинается с указа 1724 года об учреждении Академии наук вместе с университетом и гимназией.',
      'fame.2t': 'Периодический закон', 'fame.2d': 'Профессор университета Дмитрий Менделеев открыл периодический закон химических элементов.',
      'fame.3t': 'Рождение радио', 'fame.3d': 'В 1896 году на территории университета Александр Попов публично продемонстрировал передачу радиосигнала.',
      'fame.4t': 'Нобелевские лауреаты', 'fame.4d': 'Здесь учились Иван Павлов, Лев Ландау, Николай Семёнов, Александр Прохоров, Алексей Екимов, а также экономисты Василий Леонтьев и Леонид Канторович.',
      'fame.5t': 'Филдсовская премия', 'fame.5d': 'Выпускник университета Станислав Смирнов в 2010 году получил высшую награду в математике.',
      'fame.6t': 'Чемпионы ICPC', 'fame.6d': 'Команды СПбГУ неоднократно побеждали на чемпионате мира по программированию ICPC.',

      'why.kicker': 'Поступление', 'why.title': 'Почему стоит поступать в СПбГУ', 'why.sub': 'Шесть причин выбрать университет с трёхсотлетней историей.',
      'why.1t': 'Престижный диплом', 'why.1d': 'Диплом одного из ведущих университетов России высоко ценят работодатели. Диплом ташкентского филиала признаётся в Узбекистане.',
      'why.2t': 'Сильная научная школа', 'why.2d': 'Фундаментальные исследования, научный парк, собственные журналы и преподаватели — признанные учёные.',
      'why.3t': 'Сильная среда', 'why.3d': 'Высокий конкурс: в 2023 году средний балл ЕГЭ поступивших составил около 90 из 100. Вокруг — мотивированные и талантливые люди.',
      'why.4t': 'Международная среда', 'why.4d': 'Каждый год на обучение подают заявки абитуриенты примерно из 100 стран мира.',
      'why.5t': 'Учёба в Ташкенте', 'why.5d': 'Филиал даёт образование по программам СПбГУ на русском языке — не уезжая из Узбекистана.',
      'why.6t': 'Город-музей', 'why.6d': 'Учёба в Санкт-Петербурге — это жизнь среди музеев, театров и архитектуры мирового значения.',

      'genres.kicker': 'Жанры', 'genres.title': 'Выберите, что почитать',
      'genres.sub': 'Листайте разделы колесом мыши, перетаскиванием или свайпом и открывайте нужный жанр.',
      'genres.hint': 'Листайте вбок', 'genres.all': 'Все книги',
      'genres.all.d': 'Фонд института и книги Open Library по всем разделам в одном каталоге.',
      'genres.local': 'В фонде института: {n}', 'genres.ol': '+ книги Open Library', 'genres.open': 'Открыть',
      'genre.economics.desc': 'Микро- и макроэкономика, финансы, менеджмент и финансовая грамотность.',
      'genre.programming.desc': 'Языки программирования, алгоритмы, структуры данных и базы данных.',
      'genre.law.desc': 'Теория государства и права, гражданское, уголовное, конституционное и международное право.',

      'subj.finance': 'Финансы', 'subj.management': 'Менеджмент', 'subj.microeconomics': 'Микроэкономика', 'subj.macroeconomics': 'Макроэкономика',
      'subj.python': 'Python', 'subj.javascript': 'JavaScript', 'subj.algorithms': 'Алгоритмы', 'subj.databases': 'Базы данных',
      'subj.civil law': 'Гражданское право', 'subj.criminal law': 'Уголовное право', 'subj.constitutional law': 'Конституционное право', 'subj.international law': 'Международное право',
      'subj.computer networks': 'Компьютерные сети',

      'branch.kicker': 'Филиал в Узбекистане', 'branch.title': 'Филиал СПбГУ в Ташкенте',
      'branch.p': 'Первый филиал СПбГУ за рубежом открылся в Ташкенте в 2023 году. Обучение ведётся на русском языке по программам Санкт-Петербургского университета, выпускники получают диплом СПбГУ. Направления филиала — экономика, программирование и право — совпадают с разделами нашей библиотеки.',
      'branch.cta': 'Сайт филиала',
      'branch.note': 'Программы — по данным сайта tashkent.spbu.ru (ноябрь 2026). Условия приёма уточняйте на сайте филиала.',
      'branch.bach': 'Бакалавриат', 'branch.mag': 'Магистратура',
      'prog.eco': 'Экономика', 'prog.cs': 'Фундаментальная информатика и ИТ', 'prog.law': 'Юриспруденция', 'prog.orient': 'Востоковедение',

      'contact.kicker': 'Контакты', 'contact.title': 'Как с нами связаться',
      'contact.sub': 'Адреса, телефоны и соцсети университета в Санкт-Петербурге и филиала в Ташкенте.',
      'tab.spb': 'Санкт-Петербург', 'tab.tas': 'Ташкент',
      'c.addr': 'Адрес', 'c.phone': 'Телефон', 'c.mail': 'Эл. почта', 'c.site': 'Сайт', 'c.hours': 'Поступление',
      'spb.addr': '199034, Санкт-Петербург, Университетская наб., д. 7–9',
      'tas.addr': 'Ташкент, Мирабадский район, ул. Шахрисабз, 16 (ст. метро «Ойбек»)',
      'tas.hours': 'Сроки и список документов — на tashkent.spbu.ru',
      'map.y': 'Яндекс Карты', 'map.title': 'Карта', 'social.title': 'Мы в соцсетях',

      'f.about': 'Учебный проект электронной библиотеки для студентов и абитуриентов: книги по экономике, программированию и праву в свободном доступе.',
      'f.sections': 'Разделы', 'f.disclaimer': 'Неофициальный учебный проект, не является ресурсом СПбГУ. Официальный сайт — spbu.ru',
      'f.photos': 'Фото', 'f.ol': 'Данные о книгах предоставлены', 'f.ia': 'Полные тексты — Internet Archive',

      'cat.crumb': 'Каталог', 'cat.title': 'Каталог книг',
      'cat.desc': 'Фонд института и книги Open Library. Поиск по названию, автору и тексту страниц — на русском, узбекском и английском, кириллицей или латиницей.',
      'cat.genres': 'Жанры', 'cat.subs': 'Темы', 'sub.all': 'Все темы',
      'f.lang': 'Язык книги', 'f.langAll': 'Все языки',
      'f.field': 'Искать в', 'field.all': 'Везде', 'field.title': 'Названии', 'field.author': 'Авторе', 'field.subject': 'Теме',
      'f.years': 'Годы издания', 'f.from': 'с', 'f.to': 'по', 'f.yearsHint': 'Например, 1990–2024',
      'f.full': 'Только полные книги', 'f.fullHint': 'Можно читать целиком',
      'f.sort': 'Сортировка', 'sort.rel': 'По релевантности', 'sort.new': 'Сначала новые', 'sort.old': 'Сначала старые', 'sort.title': 'По названию',
      'f.reset': 'Сбросить', 'f.toggle': 'Фильтры',

      'res.searching': 'Ищем книги…', 'res.found': 'Найдено: {n}',
      'res.split': 'фонд института — {a}, Open Library — {b}',
      'res.shown': 'Показано {a} из {b}', 'res.more': 'Показать ещё', 'res.loadingMore': 'Загружаем…',
      'res.uzbNote': 'Книг на узбекском языке в Open Library пока мало. Попробуйте искать без фильтра языка или на русском и английском. Все книги фонда института доступны на узбекском.',
      'res.fullNote': 'Показаны только полные книги. Это в основном издания в общественном достоянии, поэтому новых книг среди них мало.',
      'res.showAll': 'Показать все книги',

      'shelf.local': 'Фонд института', 'shelf.localSub': 'Читаются на сайте полностью, на русском и узбекском',
      'shelf.seeAll': 'Смотреть все', 'shelf.count': 'В Open Library: {n}', 'shelf.empty': 'Под выбранные фильтры книг не нашлось.',
      'cont.title': 'Продолжить чтение',

      'badge.local': 'Фонд института', 'badge.full': 'Полная книга', 'badge.fragment': 'Только фрагмент', 'badge.none': 'Нет эл. версии',
      'act.read': 'Читать', 'act.readFree': 'Читать бесплатно', 'act.continue': 'Продолжить', 'act.pdf': 'Скачать PDF',
      'act.fragment': 'Фрагмент на Open Library', 'act.details': 'Подробнее', 'act.ol': 'Открыть на Open Library',
      'act.archive': 'Открыть на archive.org', 'act.detailsOf': 'Подробнее о книге',

      'empty.title': 'Ничего не найдено', 'empty.text': 'Попробуйте изменить запрос:',
      'empty.tip1': 'проверьте написание или используйте более общее слово;',
      'empty.tip2': 'введите английское название — в Open Library больше всего книг на английском;',
      'empty.tip3': 'расширьте диапазон лет или выберите «Все языки».',
      'empty.fullOff': 'Показать книги с ограниченным доступом', 'empty.reset': 'Сбросить фильтры',

      'err.title': 'Не удалось загрузить книги', 'err.retry': 'Повторить',
      'err.partial': 'Книги из Open Library не загрузились. Ниже — результаты из фонда института.',
      'err.offline': 'Нет подключения к интернету. Проверьте сеть и повторите попытку.',
      'err.timeout': 'Open Library не ответил за 10 секунд. Попробуйте ещё раз чуть позже.',
      'err.network': 'Не удалось связаться с Open Library. Проверьте интернет или повторите позже.',
      'err.rateLimited': 'Слишком много запросов к Open Library. Подождите минуту и повторите.',
      'err.server': 'Сервис Open Library временно недоступен. Повторите попытку позже.',
      'err.notFound': 'Книга не найдена в Open Library.',
      'err.http': 'Open Library вернул ошибку. Повторите попытку.',
      'err.parse': 'Open Library прислал некорректный ответ.',
      'err.badKey': 'Некорректный идентификатор книги.',
      'err.unknown': 'Что-то пошло не так. Повторите попытку.',

      'md.close': 'Закрыть', 'md.year': 'Первое издание', 'md.langs': 'Язык', 'md.editions': 'Изданий', 'md.pages': 'Страниц',
      'md.level': 'Уровень', 'md.chapters': 'Глав', 'md.subjects': 'Темы', 'md.desc': 'Описание', 'md.toc': 'Содержание',
      'md.noDesc': 'Описание для этой книги в Open Library пока не добавлено.',
      'md.descErr': 'Не удалось загрузить описание.', 'md.more': 'Показать полностью', 'md.less': 'Свернуть',
      'md.source': 'Источник данных: Open Library',
      'note.local': 'Книга из фонда института — доступна полностью: читайте на сайте или скачайте PDF.',
      'note.full': 'Полный текст в общественном достоянии: читайте прямо на сайте или скачайте PDF из Internet Archive.',
      'note.fragment': 'Только ознакомительный фрагмент. Полную версию Open Library выдаёт по своим правилам, обычно после регистрации.',
      'note.none': 'Электронной версии нет — доступны только сведения о книге.',
      'meta.noAuthor': 'Автор не указан', 'meta.noYear': 'Год не указан', 'meta.min': 'мин',
      'level.beg': 'Начальный', 'level.mid': 'Средний',

      'rd.toc': 'Содержание', 'rd.prev': 'Предыдущая глава', 'rd.next': 'Следующая глава', 'rd.close': 'Закрыть читалку',
      'rd.end': 'Вы дочитали книгу до конца!', 'rd.back': 'Вернуться в каталог', 'rd.chapter': 'Глава {i} из {n}',
      'rd.smaller': 'Уменьшить шрифт', 'rd.bigger': 'Увеличить шрифт',
      'rd.loading': 'Загружаем книгу из Internet Archive…',
      'rd.iaNote': 'Книга в общественном достоянии. Текст предоставлен Internet Archive.',
      'rd.iaFallback': 'Книга Internet Archive',
      'subj.insurance': 'Страхование', 'subj.marketing': 'Маркетинг', 'subj.economic history': 'История экономики',
      'subj.information technology': 'Информационные технологии', 'subj.management information systems': 'Информационные системы',
      'subj.conflict of laws': 'Международное частное право', 'subj.comparative law': 'Сравнительное правоведение',
      'subj.maritime law': 'Морское право', 'subj.jurisprudence': 'Теория и философия права', 'subj.political science': 'Политология',
      'subj.society': 'Общество', 'subj.notary': 'Нотариат',
      'type.textbook': 'Учебник', 'type.lectures': 'Курс лекций', 'type.monograph': 'Монография', 'type.journal': 'Научный журнал',
      'type.collection': 'Сборник трудов', 'type.laws': 'Законодательство', 'type.business': 'Деловая литература',
      'type.popular': 'Научно-популярная', 'type.stories': 'Сборник историй', 'type.guide': 'Учебный материал',
      'f.source': 'Источник', 'src.all': 'Все источники', 'src.local': 'Фонд института', 'src.ol': 'Open Library',
      'f.type': 'Тип издания', 'type.all': 'Любой тип',
      'f.typeNote': 'Тип издания указан только у книг фонда института, поэтому книги Open Library скрыты.',
      'search.didYouMean': 'Возможно, вы искали:', 'search.inText': 'Найдено в тексте',
      'hit.page': 'стр. {n}', 'hit.chapter': 'гл. {n}',
      'badge.pdf': 'PDF · {n} стр.',
      'note.localPdf': 'Ознакомительный фрагмент из фонда института ({n} стр.): обложка, титульный лист и содержание. Листайте на сайте или скачайте PDF.',
      'md.type': 'Тип', 'md.publisher': 'Издательство', 'md.pagesTitle': 'Страницы', 'md.hits': 'Найдено по запросу',
      'act.openPdf': 'Открыть PDF', 'act.readPage': 'Открыть',
      'rd.page': 'Стр. {i} из {n}', 'rd.prevPage': 'Предыдущая страница', 'rd.nextPage': 'Следующая страница',
      'rd.zoomIn': 'Увеличить', 'rd.zoomOut': 'Уменьшить', 'rd.fit': 'По ширине', 'rd.viewPages': 'Страницы', 'rd.viewPdf': 'PDF',
      'rd.view': 'Режим просмотра', 'rd.thumbs': 'Страницы',
      'rd.fragmentNote': 'Ознакомительный фрагмент: {n} стр. Полный текст книги — в библиотеке института.',
      'rd.pdfHint': 'Если PDF не отображается (так бывает на телефонах), нажмите «Открыть PDF» или переключитесь на «Страницы».',
      'new.kicker': 'Новые поступления', 'new.title': 'Новые книги в фонде института',
      'new.sub': 'Учебники, монографии и научные журналы. Откройте книгу и листайте страницы прямо на сайте.', 'new.all': 'Весь фонд',
      'prog.ibde': 'Международный бизнес в цифровой экономике', 'prog.pit': 'Программирование и информационные технологии',
      'prog.mpl': 'Международное частное право', 'prog.china': 'Современный Китай', 'prog.iede': 'Международное предпринимательство в цифровой экономике',
      'branch.photo1': 'Филиал СПбГУ в Ташкенте: начало занятий, октябрь 2023', 'branch.photo2': 'Филиал СПбГУ в Ташкенте, 2023',
      'branch.photo3': '«Молодёжный диалог» в филиале, август 2023', 'branch.credit': 'Фото: © СПбГУ, spbu.ru и econ.spbu.ru',
      'branch.addr': 'ул. Шахрисабз, 16 · м. «Ойбек»', 'branch.since': 'С 2023 года',
      'empty.tipScript': 'пишите кириллицей или латиницей — поиск понимает оба варианта;',
    },

    uz: {
      'doc.title': 'SPbDU elektron kutubxonasi',
      'skip': "Asosiy qismga o'tish",
      'logo.sub': 'Elektron kutubxona',
      'nav.home': 'Bosh sahifa', 'nav.catalog': 'Katalog', 'nav.contacts': 'Aloqa', 'nav.menu': 'Menyu',
      'theme.toggle': 'Mavzuni almashtirish', 'lang.group': 'Sayt tili',

      'hero.badge': '1724-yilda tashkil etilgan · Rossiyaning eng qadimiy universitetlaridan biri',
      'hero.title': '<em>SPbDU</em> elektron kutubxonasi',
      'hero.sub': "Iqtisodiyot, dasturlash va huquq bo'yicha kitoblar: institut fondi va Open Library'dagi minglab kitoblar. Rus, o'zbek va ingliz tillarida bepul onlayn o'qing.",
      'hero.cta.catalog': 'Kitoblar katalogi', 'hero.cta.genres': 'Janrlar', 'hero.cta.why': 'Nega aynan SPbDU',
      'hero.popular': 'Ommabop:',

      'search.label': 'Kitob qidirish', 'search.ph': 'Nomi, muallifi yoki mavzusi — masalan, «Python» yoki «Adam Smit»',
      'search.ph.short': 'Nomi, muallifi yoki mavzusi', 'search.btn': 'Qidirish',
      'search.min': 'Kamida {n} ta belgi kiriting', 'search.loading': 'Kitoblar qidirilmoqda…',
      'search.none': "Hech narsa topilmadi. Boshqa so'z yoki inglizcha nomni sinab ko'ring.",
      'search.all': 'Barcha natijalar', 'search.local': 'Institut fondi',

      'stat.1': 'tashkil etilgan yil', 'stat.2': 'yillik tarix', 'stat.3': 'fakultet va institut', 'stat.4': 'talaba',
      'about.kicker': 'Universitet haqida', 'about.title': 'Sankt-Peterburg davlat universiteti',
      'about.p1': "SPbDU tarixi Pyotr I ning 1724-yildagi farmonidan boshlanadi: unga ko'ra Fanlar akademiyasi bilan birga universitet va gimnaziya ta'sis etilgan. Bugun u Rossiyaning yetakchi klassik universitetlaridan biridir.",
      'about.p2': "Universitetning qalbi — Vasilyevskiy orolidagi O'n ikki kollegiya binosi. Bu 1722–1744-yillarda Domeniko Trezini loyihasi bo'yicha qurilgan Pyotr davri barokkosining eng yirik yodgorligidir. Asosiy kampuslar Vasilyevskiy orolida va Petergofda joylashgan.",
      'about.p3': 'Universitet 24 ta fakultet va institutni, 32 mingdan ortiq talabani hamda matematika va fizikadan tortib iqtisodiyot va huquqqacha jahon darajasidagi ilmiy maktablarni birlashtiradi.',
      'about.f1k': 'Shior', 'about.f1v': 'Hic tuta perennat — «Bu yerda omonlikda saqlanadi»',
      'about.f2k': 'Kampuslar', 'about.f2v': 'Vasilyevskiy oroli va Petergof',
      'about.f3k': 'Kutubxona', 'about.f3v': 'M. Gorkiy nomidagi ilmiy kutubxona',
      'about.f4k': 'Filial', 'about.f4v': "Toshkent, O'zbekiston",
      'about.badge': 'Pyotr I farmoni',
      'photo.cap1': "O'n ikki kollegiya binosi — universitetning bosh binosi",
      'photo.cap2': "Neva bo'yidagi Universitet sohili", 'photo.cap3': 'Universitet sohili',

      'fame.kicker': 'Nimasi bilan mashhur', 'fame.title': 'Uch asrlik kashfiyotlar',
      'fame.sub': "Bu yerda ilm-fanni o'zgartirgan kashfiyotlar qilingan, bitiruvchilar esa jahonning eng oliy mukofotlariga sazovor bo'lgan.",
      'fame.1t': 'Pyotr I farmoni', 'fame.1d': "Universitet tarixi 1724-yilda Fanlar akademiyasini universitet va gimnaziya bilan birga ta'sis etish haqidagi farmondan boshlanadi.",
      'fame.2t': 'Davriy qonun', 'fame.2d': 'Universitet professori Dmitriy Mendeleyev kimyoviy elementlarning davriy qonunini kashf etgan.',
      'fame.3t': "Radioning tug'ilishi", 'fame.3d': '1896-yilda universitet hududida Aleksandr Popov radiosignal uzatishni ommaviy namoyish etgan.',
      'fame.4t': 'Nobel mukofoti sovrindorlari', 'fame.4d': 'Bu yerda Ivan Pavlov, Lev Landau, Nikolay Semyonov, Aleksandr Proxorov, Aleksey Yekimov hamda iqtisodchilar Vasiliy Leontyev va Leonid Kantorovich tahsil olgan.',
      'fame.5t': 'Filds mukofoti', 'fame.5d': "Universitet bitiruvchisi Stanislav Smirnov 2010-yilda matematikadagi eng oliy mukofotga sazovor bo'lgan.",
      'fame.6t': 'ICPC chempionlari', 'fame.6d': "SPbDU jamoalari ICPC dasturlash bo'yicha jahon chempionatida ko'p marta g'olib bo'lgan.",

      'why.kicker': 'Qabul', 'why.title': "Nega SPbDUga o'qishga kirish kerak", 'why.sub': 'Uch yuz yillik tarixga ega universitetni tanlash uchun oltita sabab.',
      'why.1t': 'Nufuzli diplom', 'why.1d': "Rossiyaning yetakchi universitetlaridan biri diplomi ish beruvchilar tomonidan yuqori baholanadi. Toshkent filiali diplomi O'zbekistonda tan olinadi.",
      'why.2t': 'Kuchli ilmiy maktab', 'why.2d': "Fundamental tadqiqotlar, ilmiy park, o'z jurnallari va taniqli olim-o'qituvchilar.",
      'why.3t': 'Kuchli muhit', 'why.3d': "Yuqori tanlov: 2023-yilda qabul qilinganlarning o'rtacha imtihon bali 100 dan 90 atrofida bo'lgan. Atrofingizda — iqtidorli va maqsadli insonlar.",
      'why.4t': 'Xalqaro muhit', 'why.4d': "Har yili o'qish uchun 100 ga yaqin mamlakatdan abituriyentlar ariza topshiradi.",
      'why.5t': "Toshkentda ta'lim", 'why.5d': "Filial O'zbekistondan chiqmagan holda rus tilida SPbDU dasturlari bo'yicha ta'lim beradi.",
      'why.6t': 'Muzey-shahar', 'why.6d': "Sankt-Peterburgda o'qish — jahon ahamiyatiga ega muzeylar, teatrlar va me'morchilik orasida yashash demakdir.",

      'genres.kicker': 'Janrlar', 'genres.title': "Nima o'qishni tanlang",
      'genres.sub': "Bo'limlarni sichqoncha g'ildiragi, sudrash yoki barmoq bilan suring va kerakli janrni oching.",
      'genres.hint': 'Yonga suring', 'genres.all': 'Barcha kitoblar',
      'genres.all.d': "Institut fondi va Open Library kitoblari barcha bo'limlar bo'yicha bitta katalogda.",
      'genres.local': 'Institut fondida: {n}', 'genres.ol': '+ Open Library kitoblari', 'genres.open': 'Ochish',
      'genre.economics.desc': 'Mikro- va makroiqtisodiyot, moliya, menejment va moliyaviy savodxonlik.',
      'genre.programming.desc': "Dasturlash tillari, algoritmlar, ma'lumotlar tuzilmalari va ma'lumotlar bazalari.",
      'genre.law.desc': 'Davlat va huquq nazariyasi, fuqarolik, jinoyat, konstitutsiyaviy va xalqaro huquq.',

      'subj.finance': 'Moliya', 'subj.management': 'Menejment', 'subj.microeconomics': 'Mikroiqtisodiyot', 'subj.macroeconomics': 'Makroiqtisodiyot',
      'subj.python': 'Python', 'subj.javascript': 'JavaScript', 'subj.algorithms': 'Algoritmlar', 'subj.databases': "Ma'lumotlar bazalari",
      'subj.civil law': 'Fuqarolik huquqi', 'subj.criminal law': 'Jinoyat huquqi', 'subj.constitutional law': 'Konstitutsiyaviy huquq', 'subj.international law': 'Xalqaro huquq',
      'subj.computer networks': 'Kompyuter tarmoqlari',

      'branch.kicker': "O'zbekistondagi filial", 'branch.title': "SPbDUning Toshkentdagi filiali",
      'branch.p': "SPbDUning xorijdagi birinchi filiali 2023-yilda Toshkentda ochildi. Ta'lim rus tilida Sankt-Peterburg universiteti dasturlari asosida olib boriladi, bitiruvchilar SPbDU diplomini oladi. Filial yo'nalishlari — iqtisodiyot, dasturlash va huquq — kutubxonamiz bo'limlariga mos keladi.",
      'branch.cta': 'Filial sayti',
      'branch.note': "Dasturlar — tashkent.spbu.ru sayti ma'lumotlariga ko'ra (2026-yil noyabr). Qabul shartlarini filial saytida aniqlang.",
      'branch.bach': 'Bakalavriat', 'branch.mag': 'Magistratura',
      'prog.eco': 'Iqtisodiyot', 'prog.cs': 'Fundamental informatika va AT', 'prog.law': 'Yurisprudensiya', 'prog.orient': 'Sharqshunoslik',

      'contact.kicker': 'Aloqa', 'contact.title': "Biz bilan qanday bog'lanish mumkin",
      'contact.sub': 'Sankt-Peterburgdagi universitet va Toshkentdagi filialning manzillari, telefonlari va ijtimoiy tarmoqlari.',
      'tab.spb': 'Sankt-Peterburg', 'tab.tas': 'Toshkent',
      'c.addr': 'Manzil', 'c.phone': 'Telefon', 'c.mail': 'Elektron pochta', 'c.site': 'Sayt', 'c.hours': 'Qabul',
      'spb.addr': '199034, Sankt-Peterburg, Universitetskaya sohili, 7–9-uy',
      'tas.addr': "Toshkent, Mirobod tumani, Shahrisabz ko'chasi, 16 («Oybek» metro bekati)",
      'tas.hours': "Muddatlar va hujjatlar ro'yxati — tashkent.spbu.ru saytida",
      'map.y': 'Yandex Xaritalar', 'map.title': 'Xarita', 'social.title': 'Biz ijtimoiy tarmoqlarda',

      'f.about': "Talabalar va abituriyentlar uchun elektron kutubxona o'quv loyihasi: iqtisodiyot, dasturlash va huquq bo'yicha kitoblar ochiq foydalanishda.",
      'f.sections': "Bo'limlar", 'f.disclaimer': "Norasmiy o'quv loyihasi, SPbDU resursi emas. Rasmiy sayt — spbu.ru",
      'f.photos': 'Suratlar', 'f.ol': "Kitoblar haqidagi ma'lumotlar manbai", 'f.ia': "To'liq matnlar — Internet Archive",

      'cat.crumb': 'Katalog', 'cat.title': 'Kitoblar katalogi',
      'cat.desc': "Institut fondi va Open Library kitoblari. Nomi, muallifi va sahifalar matni bo'yicha qidiruv — rus, o'zbek va ingliz tillarida, kirill yoki lotin yozuvida.",
      'cat.genres': 'Janrlar', 'cat.subs': 'Mavzular', 'sub.all': 'Barcha mavzular',
      'f.lang': 'Kitob tili', 'f.langAll': 'Barcha tillar',
      'f.field': 'Qayerdan qidirish', 'field.all': 'Hamma joyda', 'field.title': 'Nomida', 'field.author': 'Muallifida', 'field.subject': 'Mavzusida',
      'f.years': 'Nashr yillari', 'f.from': 'dan', 'f.to': 'gacha', 'f.yearsHint': 'Masalan, 1990–2024',
      'f.full': "Faqat to'liq kitoblar", 'f.fullHint': "To'liq o'qish mumkin",
      'f.sort': 'Saralash', 'sort.rel': "Mosligi bo'yicha", 'sort.new': 'Avval yangilari', 'sort.old': 'Avval eskilari', 'sort.title': "Nomi bo'yicha",
      'f.reset': 'Tozalash', 'f.toggle': 'Filtrlar',

      'res.searching': 'Kitoblar qidirilmoqda…', 'res.found': 'Topildi: {n}',
      'res.split': 'institut fondi — {a}, Open Library — {b}',
      'res.shown': "{b} tadan {a} tasi ko'rsatildi", 'res.more': "Yana ko'rsatish", 'res.loadingMore': 'Yuklanmoqda…',
      'res.uzbNote': "Open Library'da o'zbek tilidagi kitoblar hozircha kam. Til filtrisiz yoki rus va ingliz tillarida qidirib ko'ring. Institut fondidagi barcha kitoblar o'zbek tilida mavjud.",
      'res.fullNote': "Faqat to'liq kitoblar ko'rsatilmoqda. Ular asosan ommaviy mulkka o'tgan nashrlar, shuning uchun yangi kitoblar kam.",
      'res.showAll': "Barcha kitoblarni ko'rsatish",

      'shelf.local': 'Institut fondi', 'shelf.localSub': "Saytda to'liq o'qiladi, rus va o'zbek tillarida",
      'shelf.seeAll': "Barchasini ko'rish", 'shelf.count': "Open Library'da: {n}", 'shelf.empty': "Tanlangan filtrlar bo'yicha kitob topilmadi.",
      'cont.title': "O'qishni davom ettirish",

      'badge.local': 'Institut fondi', 'badge.full': "To'liq kitob", 'badge.fragment': 'Faqat parcha', 'badge.none': "Elektron versiyasi yo'q",
      'act.read': "O'qish", 'act.readFree': "Bepul o'qish", 'act.continue': 'Davom ettirish', 'act.pdf': 'PDF yuklab olish',
      'act.fragment': "Open Library'dagi parcha", 'act.details': 'Batafsil', 'act.ol': "Open Library'da ochish",
      'act.archive': "archive.org'da ochish", 'act.detailsOf': 'Kitob haqida batafsil',

      'empty.title': 'Hech narsa topilmadi', 'empty.text': "So'rovni o'zgartirib ko'ring:",
      'empty.tip1': "imloni tekshiring yoki umumiyroq so'z ishlating;",
      'empty.tip2': "inglizcha nomini kiriting — Open Library'da eng ko'p kitoblar ingliz tilida;",
      'empty.tip3': "yillar oralig'ini kengaytiring yoki «Barcha tillar»ni tanlang.",
      'empty.fullOff': "Cheklangan kirishli kitoblarni ham ko'rsatish", 'empty.reset': 'Filtrlarni tozalash',

      'err.title': "Kitoblarni yuklab bo'lmadi", 'err.retry': 'Qayta urinish',
      'err.partial': "Open Library kitoblari yuklanmadi. Quyida — institut fondidagi natijalar.",
      'err.offline': "Internetga ulanish yo'q. Tarmoqni tekshiring va qayta urinib ko'ring.",
      'err.timeout': "Open Library 10 soniya ichida javob bermadi. Birozdan so'ng qayta urinib ko'ring.",
      'err.network': "Open Library bilan bog'lanib bo'lmadi. Internetni tekshiring yoki keyinroq urinib ko'ring.",
      'err.rateLimited': "Open Library'ga so'rovlar juda ko'p. Bir daqiqa kuting va qayta urinib ko'ring.",
      'err.server': "Open Library xizmati vaqtincha ishlamayapti. Keyinroq urinib ko'ring.",
      'err.notFound': "Kitob Open Library'da topilmadi.",
      'err.http': "Open Library xatolik qaytardi. Qayta urinib ko'ring.",
      'err.parse': "Open Library noto'g'ri javob yubordi.",
      'err.badKey': "Kitob identifikatori noto'g'ri.",
      'err.unknown': "Nimadir xato ketdi. Qayta urinib ko'ring.",

      'md.close': 'Yopish', 'md.year': 'Birinchi nashr', 'md.langs': 'Til', 'md.editions': 'Nashrlar', 'md.pages': 'Sahifalar',
      'md.level': 'Daraja', 'md.chapters': 'Boblar', 'md.subjects': 'Mavzular', 'md.desc': 'Tavsif', 'md.toc': 'Mundarija',
      'md.noDesc': "Bu kitob uchun Open Library'da hozircha tavsif qo'shilmagan.",
      'md.descErr': "Tavsifni yuklab bo'lmadi.", 'md.more': "To'liq ko'rsatish", 'md.less': "Qisqartirish",
      'md.source': "Ma'lumotlar manbai: Open Library",
      'note.local': "Institut fondidagi kitob — to'liq mavjud: saytda o'qing yoki PDF yuklab oling.",
      'note.full': "To'liq matn ommaviy mulkda: to'g'ridan-to'g'ri saytda o'qing yoki Internet Archive'dan PDF yuklab oling.",
      'note.fragment': "Faqat tanishuv parchasi. To'liq versiyani Open Library o'z qoidalariga ko'ra, odatda ro'yxatdan o'tgandan keyin beradi.",
      'note.none': "Elektron versiyasi yo'q — faqat kitob haqidagi ma'lumotlar mavjud.",
      'meta.noAuthor': "Muallif ko'rsatilmagan", 'meta.noYear': "Yili ko'rsatilmagan", 'meta.min': 'daq',
      'level.beg': "Boshlang'ich", 'level.mid': "O'rta",

      'rd.toc': 'Mundarija', 'rd.prev': 'Oldingi bob', 'rd.next': 'Keyingi bob', 'rd.close': "O'quvchini yopish",
      'rd.end': "Siz kitobni oxirigacha o'qidingiz!", 'rd.back': 'Katalogga qaytish', 'rd.chapter': '{i}-bob · jami {n}',
      'rd.smaller': 'Shriftni kichraytirish', 'rd.bigger': 'Shriftni kattalashtirish',
      'rd.loading': "Kitob Internet Archive'dan yuklanmoqda…",
      'rd.iaNote': "Kitob ommaviy mulkda. Matn Internet Archive tomonidan taqdim etilgan.",
      'rd.iaFallback': 'Internet Archive kitobi',
      'subj.insurance': "Sug'urta", 'subj.marketing': 'Marketing', 'subj.economic history': 'Iqtisodiyot tarixi',
      'subj.information technology': 'Axborot texnologiyalari', 'subj.management information systems': 'Axborot tizimlari',
      'subj.conflict of laws': 'Xalqaro xususiy huquq', 'subj.comparative law': 'Qiyosiy huquqshunoslik',
      'subj.maritime law': 'Dengiz huquqi', 'subj.jurisprudence': 'Huquq nazariyasi va falsafasi', 'subj.political science': 'Siyosatshunoslik',
      'subj.society': 'Jamiyat', 'subj.notary': 'Notariat',
      'type.textbook': 'Darslik', 'type.lectures': "Ma'ruzalar kursi", 'type.monograph': 'Monografiya', 'type.journal': 'Ilmiy jurnal',
      'type.collection': "Asarlar to'plami", 'type.laws': 'Qonunchilik', 'type.business': 'Biznes adabiyoti',
      'type.popular': 'Ilmiy-ommabop', 'type.stories': "Hikoyalar to'plami", 'type.guide': "O'quv materiali",
      'f.source': 'Manba', 'src.all': 'Barcha manbalar', 'src.local': 'Institut fondi', 'src.ol': 'Open Library',
      'f.type': 'Nashr turi', 'type.all': 'Har qanday tur',
      'f.typeNote': "Nashr turi faqat institut fondidagi kitoblarda ko'rsatilgan, shuning uchun Open Library kitoblari yashirildi.",
      'search.didYouMean': 'Balki siz buni qidirgandirsiz:', 'search.inText': 'Matndan topildi',
      'hit.page': '{n}-bet', 'hit.chapter': '{n}-bob',
      'badge.pdf': 'PDF · {n} bet',
      'note.localPdf': "Institut fondidan tanishuv parchasi ({n} bet): muqova, titul varag'i va mundarija. Saytda varaqlang yoki PDF yuklab oling.",
      'md.type': 'Turi', 'md.publisher': 'Nashriyot', 'md.pagesTitle': 'Sahifalar', 'md.hits': "So'rov bo'yicha topildi",
      'act.openPdf': 'PDF ochish', 'act.readPage': 'Ochish',
      'rd.page': '{i}-bet / {n}', 'rd.prevPage': 'Oldingi sahifa', 'rd.nextPage': 'Keyingi sahifa',
      'rd.zoomIn': 'Kattalashtirish', 'rd.zoomOut': 'Kichraytirish', 'rd.fit': "Kenglik bo'yicha", 'rd.viewPages': 'Sahifalar', 'rd.viewPdf': 'PDF',
      'rd.view': "Ko'rish rejimi", 'rd.thumbs': 'Sahifalar',
      'rd.fragmentNote': "Tanishuv parchasi: {n} bet. Kitobning to'liq matni — institut kutubxonasida.",
      'rd.pdfHint': "Agar PDF ko'rinmasa (telefonlarda shunday bo'ladi), «PDF ochish» tugmasini bosing yoki «Sahifalar» rejimiga o'ting.",
      'new.kicker': 'Yangi kelgan kitoblar', 'new.title': 'Institut fondidagi yangi kitoblar',
      'new.sub': "Darsliklar, monografiyalar va ilmiy jurnallar. Kitobni oching va sahifalarini to'g'ridan-to'g'ri saytda varaqlang.", 'new.all': 'Butun fond',
      'prog.ibde': 'Raqamli iqtisodiyotda xalqaro biznes', 'prog.pit': 'Dasturlash va axborot texnologiyalari',
      'prog.mpl': 'Xalqaro xususiy huquq', 'prog.china': 'Zamonaviy Xitoy', 'prog.iede': 'Raqamli iqtisodiyotda xalqaro tadbirkorlik',
      'branch.photo1': "SPbDU Toshkent filiali: mashg'ulotlar boshlanishi, 2023-yil oktabr", 'branch.photo2': 'SPbDU Toshkent filiali, 2023',
      'branch.photo3': "Filialda «Yoshlar muloqoti», 2023-yil avgust", 'branch.credit': 'Suratlar: © SPbDU, spbu.ru va econ.spbu.ru',
      'branch.addr': "Shahrisabz ko'chasi, 16 · «Oybek» metrosi", 'branch.since': '2023-yildan',
      'empty.tipScript': "kirill yoki lotin yozuvida yozing — qidiruv ikkalasini ham tushunadi;",
    },
  };

  let lang = NS.utils.store.get('eb-lang', 'ru');
  if (!DICT[lang]) lang = 'ru';
  const listeners = new Set();

  function t(key, vars) {
    let text = DICT[lang][key];
    if (text === undefined) text = DICT.ru[key];
    if (text === undefined) return key;
    if (vars) text = text.replace(/\{(\w+)\}/g, (m, name) => (vars[name] !== undefined ? String(vars[name]) : m));
    return text;
  }
  const has = (key) => DICT[lang][key] !== undefined || DICT.ru[key] !== undefined;

  /** Достаёт текущий язык из объекта вида { ru, uz }. */
  const L = (obj) => (obj ? (obj[lang] || obj.ru || '') : '');

  function plural(n, forms) {
    const a = n % 10;
    const b = n % 100;
    if (a === 1 && b !== 11) return forms[0];
    if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return forms[1];
    return forms[2];
  }
  const fmt = NS.utils.formatNumber;
  const countBooks = (n) => (lang === 'uz' ? `${fmt(n)} ta kitob` : `${fmt(n)} ${plural(n, ['книга', 'книги', 'книг'])}`);
  const countChapters = (n) => (lang === 'uz' ? `${n} bob` : `${n} ${plural(n, ['глава', 'главы', 'глав'])}`);

  const genreName = (genre) => (genre ? genre[lang] || genre.ru : '');
  const subjectLabel = (subject) => (has('subj.' + subject) ? t('subj.' + subject) : NS.utils.capitalize(subject));
  function languageName(code) {
    const item = NS.config.LANGUAGES.find((l) => l.code === code);
    return item ? item[lang] || item.ru : String(code || '').toUpperCase();
  }

  /** Переводит статичную разметку с атрибутами data-i18n*. */
  function applyStatic(root = document) {
    document.documentElement.lang = lang;
    document.title = t('doc.title');
    root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); }); // только свои строки из словаря
    root.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    root.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    root.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); });
  }

  function setLang(next) {
    if (!DICT[next] || next === lang) return;
    lang = next;
    NS.utils.store.set('eb-lang', next);
    applyStatic();
    listeners.forEach((fn) => fn(lang));
  }

  NS.i18n = {
    t, has, L, plural, countBooks, countChapters, genreName, subjectLabel, languageName, applyStatic, setLang,
    get lang() { return lang; },
    onChange: (fn) => listeners.add(fn),
    dictionaries: DICT,
  };
})(window.SPBU = window.SPBU || {});
