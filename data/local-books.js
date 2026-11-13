/**
 * Фонд института — книги, которые открываются в читалке сайта.
 *
 * Это JSON-данные, обёрнутые в window.LOCAL_BOOKS = [...]. Так сайт работает даже при
 * открытии index.html двойным кликом (браузер не даёт читать .json-файлы с диска).
 *
 * Два формата книг:
 *   format: "text" — книга набрана текстом: chapters [{ title:{ru,uz}, content:{ ru:[абзац|{code}], uz:[...] } }],
 *                    pdf: { ru, uz } — PDF-версии.
 *   format: "pdf"  — скан PDF: pdf, cover, pagesDir (страницы 1.jpg, 2.jpg…), pageCount, ratios (высота/ширина),
 *                    fragment: true — ознакомительный фрагмент (обложка, титульный лист, оглавление).
 *
 * Общие поля: id, genre (из js/config.js), type (textbook, journal, monograph, lectures, collection,
 * laws, popular, business, stories, guide), subjects (темы = подкатегории жанра), level, year,
 * languages (MARC-коды: rus, uzb, eng, ger), title / author / description { ru, uz }, publisher.
 *
 * Как добавить PDF-книгу: см. README.md, раздел «Как добавить книгу в фонд».
 */
window.LOCAL_BOOKS = [
 {
  "id": "eco-basics",
  "genre": "economics",
  "subjects": [
   "microeconomics",
   "macroeconomics"
  ],
  "level": "beg",
  "year": 2026,
  "languages": [
   "rus",
   "uzb"
  ],
  "title": {
   "ru": "Основы экономики",
   "uz": "Iqtisodiyot asoslari"
  },
  "author": {
   "ru": "Редакция электронной библиотеки",
   "uz": "Elektron kutubxona tahririyati"
  },
  "description": {
   "ru": "Ключевые идеи экономики: выбор, спрос и предложение, деньги и инфляция.",
   "uz": "Iqtisodiyotning asosiy g'oyalari: tanlov, talab va taklif, pul va inflyatsiya."
  },
  "pdf": {
   "ru": "books/eco-basics.ru.pdf",
   "uz": "books/eco-basics.uz.pdf"
  },
  "chapters": [
   {
    "title": {
     "ru": "Что изучает экономика",
     "uz": "Iqtisodiyot nimani o'rganadi"
    },
    "content": {
     "ru": [
      "Экономика — наука о том, как люди, компании и государства распределяют ограниченные ресурсы между безграничными потребностями. Время, деньги, земля, труд и знания всегда в дефиците, поэтому любое решение — это выбор.",
      "Ключевое понятие экономики — альтернативная стоимость: ценность лучшей из упущенных возможностей. Если студент тратит вечер на подработку, его альтернативной стоимостью может быть подготовка к экзамену или отдых.",
      "Экономику принято делить на микроэкономику, изучающую поведение отдельных покупателей и фирм, и макроэкономику, которая рассматривает страну целиком: производство, занятость, цены и экономический рост."
     ],
     "uz": [
      "Iqtisodiyot — odamlar, kompaniyalar va davlatlar cheklangan resurslarni cheksiz ehtiyojlar o'rtasida qanday taqsimlashini o'rganadigan fan. Vaqt, pul, yer, mehnat va bilim doimo yetishmaydi, shuning uchun har bir qaror — bu tanlovdir.",
      "Iqtisodiyotning asosiy tushunchasi — muqobil xarajat, ya'ni qo'ldan boy berilgan eng yaxshi imkoniyatning qiymati. Agar talaba kechqurunni qo'shimcha ishga sarflasa, uning muqobil xarajati imtihonga tayyorgarlik yoki dam olish bo'lishi mumkin.",
      "Iqtisodiyot odatda mikroiqtisodiyot va makroiqtisodiyotga bo'linadi. Mikroiqtisodiyot alohida xaridorlar va firmalarning xulq-atvorini, makroiqtisodiyot esa butun mamlakatni — ishlab chiqarish, bandlik, narxlar va iqtisodiy o'sishni o'rganadi."
     ]
    }
   },
   {
    "title": {
     "ru": "Спрос и предложение",
     "uz": "Talab va taklif"
    },
    "content": {
     "ru": [
      "Спрос показывает, сколько товара покупатели готовы приобрести по разным ценам. Обычно чем выше цена, тем меньше желающих купить — это закон спроса.",
      "Предложение отражает, сколько товара продавцы готовы продать по разным ценам. Высокая цена делает производство выгоднее, поэтому предложение растёт вместе с ценой.",
      "Точка, где кривые спроса и предложения пересекаются, называется равновесием. Если цена выше равновесной, возникает избыток товара, если ниже — дефицит. Рынок постоянно стремится к равновесию."
     ],
     "uz": [
      "Talab xaridorlar turli narxlarda qancha tovar sotib olishga tayyor ekanini ko'rsatadi. Odatda narx qanchalik yuqori bo'lsa, sotib olishni istovchilar shunchalik kam bo'ladi — bu talab qonunidir.",
      "Taklif sotuvchilar turli narxlarda qancha tovar sotishga tayyor ekanini aks ettiradi. Yuqori narx ishlab chiqarishni foydaliroq qiladi, shuning uchun taklif narx bilan birga o'sadi.",
      "Talab va taklif egri chiziqlari kesishgan nuqta muvozanat deb ataladi. Narx muvozanatdan yuqori bo'lsa, tovar ortiqchaligi, past bo'lsa — taqchillik yuzaga keladi. Bozor doimo muvozanatga intiladi."
     ]
    }
   },
   {
    "title": {
     "ru": "Деньги и инфляция",
     "uz": "Pul va inflyatsiya"
    },
    "content": {
     "ru": [
      "Деньги выполняют три функции: служат средством обмена, мерой стоимости и средством сбережения. Без денег людям пришлось бы искать партнёра для прямого обмена товарами.",
      "Инфляция — это устойчивый рост общего уровня цен. Когда цены растут, на ту же сумму можно купить меньше товаров, то есть покупательная способность денег снижается.",
      "Умеренная инфляция считается нормальной для растущей экономики, а высокая опасна: она обесценивает сбережения и мешает планировать. Поэтому центральные банки стремятся удерживать её на низком и предсказуемом уровне."
     ],
     "uz": [
      "Pul uchta vazifani bajaradi: ayirboshlash vositasi, qiymat o'lchovi va jamg'arish vositasi. Pul bo'lmaganida odamlar tovarlarni bevosita almashtirish uchun sherik qidirishga majbur bo'lar edi.",
      "Inflyatsiya — narxlar umumiy darajasining barqaror o'sishi. Narxlar oshganda o'sha summaga kamroq tovar sotib olish mumkin, ya'ni pulning xarid qobiliyati pasayadi.",
      "O'rtacha inflyatsiya o'sib borayotgan iqtisodiyot uchun odatiy hisoblanadi, yuqori inflyatsiya esa xavfli: u jamg'armalarni qadrsizlantiradi va rejalashtirishga xalaqit beradi. Shuning uchun markaziy banklar uni past va bashorat qilinadigan darajada ushlab turishga harakat qiladi."
     ]
    }
   }
  ],
  "format": "text",
  "type": "guide",
  "publisher": "Редакция электронной библиотеки"
 },
 {
  "id": "eco-macro",
  "genre": "economics",
  "subjects": [
   "macroeconomics"
  ],
  "level": "mid",
  "year": 2026,
  "languages": [
   "rus",
   "uzb"
  ],
  "title": {
   "ru": "Макроэкономика простыми словами",
   "uz": "Makroiqtisodiyot oddiy tilda"
  },
  "author": {
   "ru": "Редакция электронной библиотеки",
   "uz": "Elektron kutubxona tahririyati"
  },
  "description": {
   "ru": "ВВП, безработица и роль центрального банка — без сложных формул.",
   "uz": "YaIM, ishsizlik va markaziy bankning roli — murakkab formulalarsiz."
  },
  "pdf": {
   "ru": "books/eco-macro.ru.pdf",
   "uz": "books/eco-macro.uz.pdf"
  },
  "chapters": [
   {
    "title": {
     "ru": "ВВП: мера экономики",
     "uz": "YaIM: iqtisodiyot o'lchovi"
    },
    "content": {
     "ru": [
      "Валовой внутренний продукт (ВВП) — рыночная стоимость всех конечных товаров и услуг, произведённых в стране за год. Это главный показатель размера экономики.",
      "ВВП можно посчитать тремя способами: по расходам (потребление, инвестиции, государственные расходы и чистый экспорт), по доходам и по добавленной стоимости. При правильном расчёте все три способа дают одинаковый результат.",
      "Чтобы сравнивать уровень жизни, используют ВВП на душу населения, а чтобы убрать влияние роста цен — реальный ВВП, рассчитанный в постоянных ценах."
     ],
     "uz": [
      "Yalpi ichki mahsulot (YaIM) — mamlakatda bir yil davomida ishlab chiqarilgan barcha yakuniy tovar va xizmatlarning bozor qiymati. Bu iqtisodiyot hajmining asosiy ko'rsatkichidir.",
      "YaIMni uch usulda hisoblash mumkin: xarajatlar bo'yicha (iste'mol, investitsiyalar, davlat xarajatlari va sof eksport), daromadlar bo'yicha va qo'shilgan qiymat bo'yicha. To'g'ri hisoblanganda uchala usul bir xil natija beradi.",
      "Turmush darajasini solishtirish uchun aholi jon boshiga YaIM, narxlar o'sishi ta'sirini chiqarib tashlash uchun esa doimiy narxlarda hisoblangan real YaIM qo'llaniladi."
     ]
    }
   },
   {
    "title": {
     "ru": "Занятость и безработица",
     "uz": "Bandlik va ishsizlik"
    },
    "content": {
     "ru": [
      "Безработным считается человек, который не имеет работы, ищет её и готов приступить. Уровень безработицы — доля безработных среди всей рабочей силы.",
      "Экономисты выделяют фрикционную безработицу (поиск нового места), структурную (несоответствие навыков требованиям рынка) и циклическую, которая растёт во время спадов.",
      "Полное отсутствие безработицы невозможно: людям всегда нужно время, чтобы сменить работу. Поэтому задача экономической политики — не обнулить её, а снизить до естественного уровня."
     ],
     "uz": [
      "Ishsiz deb ishi yo'q, ish qidirayotgan va ishga kirishishga tayyor bo'lgan shaxs hisoblanadi. Ishsizlik darajasi — butun ishchi kuchi ichida ishsizlarning ulushi.",
      "Iqtisodchilar friksion ishsizlik (yangi ish joyini qidirish), tarkibiy ishsizlik (ko'nikmalarning bozor talablariga mos kelmasligi) va tanazzul davrida o'sadigan tsiklik ishsizlikni ajratadi.",
      "Ishsizlikning umuman bo'lmasligi mumkin emas: odamlarga ishni almashtirish uchun doimo vaqt kerak. Shuning uchun iqtisodiy siyosatning vazifasi uni nolga tushirish emas, balki tabiiy darajagacha kamaytirishdir."
     ]
    }
   },
   {
    "title": {
     "ru": "Центральный банк и ставка",
     "uz": "Markaziy bank va foiz stavkasi"
    },
    "content": {
     "ru": [
      "Центральный банк отвечает за стабильность национальной валюты. Его главный инструмент — ключевая ставка, по которой он кредитует коммерческие банки.",
      "Когда ставка повышается, кредиты дорожают, люди меньше занимают и больше сберегают — спрос и инфляция замедляются. Снижение ставки, наоборот, стимулирует займы, инвестиции и потребление.",
      "Решения центрального банка действуют с задержкой в несколько кварталов, поэтому регулятор ориентируется на прогнозы, а не только на текущие данные."
     ],
     "uz": [
      "Markaziy bank milliy valyutaning barqarorligi uchun javob beradi. Uning asosiy vositasi — tijorat banklariga kredit beriladigan asosiy stavka.",
      "Stavka oshirilganda kreditlar qimmatlashadi, odamlar kamroq qarz olib, ko'proq jamg'aradi — talab va inflyatsiya sekinlashadi. Stavkaning pasaytirilishi esa, aksincha, qarz olish, investitsiya va iste'molni rag'batlantiradi.",
      "Markaziy bank qarorlari bir necha chorak kechikish bilan ta'sir qiladi, shuning uchun regulyator faqat joriy ma'lumotlarga emas, prognozlarga ham tayanadi."
     ]
    }
   }
  ],
  "format": "text",
  "type": "guide",
  "publisher": "Редакция электронной библиотеки"
 },
 {
  "id": "eco-fin",
  "genre": "economics",
  "subjects": [
   "finance"
  ],
  "level": "beg",
  "year": 2026,
  "languages": [
   "rus",
   "uzb"
  ],
  "title": {
   "ru": "Финансовая грамотность",
   "uz": "Moliyaviy savodxonlik"
  },
  "author": {
   "ru": "Редакция электронной библиотеки",
   "uz": "Elektron kutubxona tahririyati"
  },
  "description": {
   "ru": "Бюджет, сбережения, сложный процент и разумное отношение к кредитам.",
   "uz": "Byudjet, jamg'arma, murakkab foiz va kreditlarga oqilona munosabat."
  },
  "pdf": {
   "ru": "books/eco-fin.ru.pdf",
   "uz": "books/eco-fin.uz.pdf"
  },
  "chapters": [
   {
    "title": {
     "ru": "Личный бюджет",
     "uz": "Shaxsiy byudjet"
    },
    "content": {
     "ru": [
      "Личный бюджет — план доходов и расходов на месяц. Он помогает понять, куда уходят деньги, и принимать решения осознанно.",
      "Популярное правило «50/30/20»: половина дохода — на обязательные расходы, 30% — на желания, 20% — на сбережения и погашение долгов. Пропорции можно менять, главное — записывать траты.",
      "Начните с простого: в течение месяца фиксируйте все покупки, затем разделите их на категории. Уже через несколько недель станет видно, на чём можно экономить без потери качества жизни."
     ],
     "uz": [
      "Shaxsiy byudjet — bir oylik daromad va xarajatlar rejasi. U pul qayerga ketayotganini tushunishga va ongli qarorlar qabul qilishga yordam beradi.",
      "Mashhur «50/30/20» qoidasi: daromadning yarmi — majburiy xarajatlarga, 30% — istaklarga, 20% — jamg'arma va qarzlarni to'lashga. Nisbatlarni o'zgartirish mumkin, eng muhimi — xarajatlarni yozib borish.",
      "Oddiydan boshlang: bir oy davomida barcha xaridlarni qayd eting, so'ngra ularni toifalarga ajrating. Bir necha haftadan so'ng hayot sifatini yo'qotmasdan nimani tejash mumkinligi ko'rinadi."
     ]
    }
   },
   {
    "title": {
     "ru": "Сбережения и сложный процент",
     "uz": "Jamg'arma va murakkab foiz"
    },
    "content": {
     "ru": [
      "Сложный процент — это начисление процентов не только на исходную сумму, но и на уже накопленные проценты. Со временем рост ускоряется, как снежный ком.",
      "Пример: 1 000 000 сумов под 10% годовых через год превратятся в 1 100 000, а через десять лет при ежегодной капитализации — примерно в 2 594 000.",
      "Главные союзники сбережений — время и регулярность. Небольшие, но постоянные взносы, начатые рано, часто дают больший результат, чем крупные суммы, отложенные поздно."
     ],
     "uz": [
      "Murakkab foiz — foizlarning nafaqat dastlabki summaga, balki allaqachon to'plangan foizlarga ham hisoblanishi. Vaqt o'tishi bilan o'sish qor uyumi kabi tezlashadi.",
      "Misol: yillik 10% bilan qo'yilgan 1 000 000 so'm bir yildan keyin 1 100 000 so'mga, har yili kapitallashtirilsa, o'n yildan keyin esa taxminan 2 594 000 so'mga aylanadi.",
      "Jamg'armaning asosiy ittifoqchilari — vaqt va muntazamlik. Erta boshlangan kichik, ammo doimiy badallar ko'pincha kech jamg'arilgan katta summalardan ko'ra yaxshiroq natija beradi."
     ]
    }
   },
   {
    "title": {
     "ru": "Кредиты и риски",
     "uz": "Kreditlar va xavflar"
    },
    "content": {
     "ru": [
      "Кредит позволяет получить вещь сегодня, но заплатить за неё больше в будущем. Перед оформлением важно смотреть на полную стоимость кредита, а не только на размер ежемесячного платежа.",
      "Безопасная долговая нагрузка — когда платежи по всем кредитам не превышают примерно трети дохода. Если больше, любая непредвиденная трата может привести к просрочке.",
      "Остерегайтесь мошенников: банк никогда не просит сообщить код из СМС или пароль. При малейшем сомнении положите трубку и перезвоните в банк по официальному номеру."
     ],
     "uz": [
      "Kredit narsani bugun olish imkonini beradi, ammo kelajakda uning uchun ko'proq to'lashga to'g'ri keladi. Rasmiylashtirishdan oldin faqat oylik to'lov miqdoriga emas, kreditning to'liq qiymatiga qarash muhim.",
      "Xavfsiz qarz yuki — barcha kreditlar bo'yicha to'lovlar daromadning taxminan uchdan biridan oshmaganda. Agar ko'proq bo'lsa, har qanday kutilmagan xarajat to'lovning kechikishiga olib kelishi mumkin.",
      "Firibgarlardan ehtiyot bo'ling: bank hech qachon SMS kodi yoki parolni so'ramaydi. Ozgina shubha tug'ilsa, go'shakni qo'ying va bankka rasmiy raqam orqali qayta qo'ng'iroq qiling."
     ]
    }
   }
  ],
  "format": "text",
  "type": "guide",
  "publisher": "Редакция электронной библиотеки"
 },
 {
  "id": "inf-prog",
  "genre": "programming",
  "subjects": [
   "python"
  ],
  "level": "beg",
  "year": 2026,
  "languages": [
   "rus",
   "uzb"
  ],
  "title": {
   "ru": "Введение в программирование",
   "uz": "Dasturlashga kirish"
  },
  "author": {
   "ru": "Редакция электронной библиотеки",
   "uz": "Elektron kutubxona tahririyati"
  },
  "description": {
   "ru": "Алгоритмы, переменные, условия и циклы с примерами на Python.",
   "uz": "Python misollarida algoritmlar, o'zgaruvchilar, shartlar va sikllar."
  },
  "pdf": {
   "ru": "books/inf-prog.ru.pdf",
   "uz": "books/inf-prog.uz.pdf"
  },
  "chapters": [
   {
    "title": {
     "ru": "Что такое алгоритм",
     "uz": "Algoritm nima"
    },
    "content": {
     "ru": [
      "Алгоритм — это точная последовательность шагов, которая приводит к решению задачи. Рецепт блюда, маршрут до университета или инструкция к прибору — тоже алгоритмы.",
      "Хороший алгоритм конечен (завершается), определён (каждый шаг понятен однозначно) и результативен (даёт ответ). Программа — это алгоритм, записанный на языке, понятном компьютеру.",
      "Прежде чем писать код, полезно описать решение словами или блок-схемой. Так проще найти ошибки в логике, пока их исправление ещё ничего не стоит."
     ],
     "uz": [
      "Algoritm — masalani yechishga olib keladigan qadamlarning aniq ketma-ketligi. Taom retsepti, universitetgacha bo'lgan yo'l yoki qurilma yo'riqnomasi ham algoritmdir.",
      "Yaxshi algoritm chekli (tugaydi), aniq (har bir qadam bir ma'noda tushuniladi) va natijali (javob beradi) bo'ladi. Dastur — kompyuter tushunadigan tilda yozilgan algoritm.",
      "Kod yozishdan oldin yechimni so'zlar yoki blok-sxema bilan tasvirlash foydali. Shunda mantiqdagi xatolarni ularni tuzatish hali arzon bo'lgan paytda topish osonroq."
     ]
    }
   },
   {
    "title": {
     "ru": "Переменные и типы данных",
     "uz": "O'zgaruvchilar va ma'lumot turlari"
    },
    "content": {
     "ru": [
      "Переменная — это именованная ячейка памяти, в которой хранится значение. У каждого значения есть тип: целое число, дробное число, строка текста или логическое значение «истина/ложь».",
      {
       "code": "name = \"Алия\"\nage = 19\ngpa = 4.7\nis_student = True\nprint(name, \"—\", age, \"лет\")"
      },
      "Тип определяет, какие операции допустимы. Числа можно складывать и умножать, строки — соединять. Попытка сложить число со строкой во многих языках приведёт к ошибке."
     ],
     "uz": [
      "O'zgaruvchi — qiymat saqlanadigan nomlangan xotira katagi. Har bir qiymatning turi bor: butun son, kasr son, matn satri yoki «rost/yolg'on» mantiqiy qiymati.",
      {
       "code": "name = \"Aliya\"\nage = 19\ngpa = 4.7\nis_student = True\nprint(name, \"—\", age, \"yosh\")"
      },
      "Tur qaysi amallar ruxsat etilganini belgilaydi. Sonlarni qo'shish va ko'paytirish, satrlarni esa birlashtirish mumkin. Ko'plab tillarda sonni satr bilan qo'shishga urinish xatoga olib keladi."
     ]
    }
   },
   {
    "title": {
     "ru": "Условия и циклы",
     "uz": "Shartlar va sikllar"
    },
    "content": {
     "ru": [
      "Условия позволяют программе выбирать действие: если выполняется одно условие — делаем одно, иначе — другое. Циклы повторяют действия, пока это необходимо.",
      {
       "code": "for score in [56, 71, 88, 93]:\n    if score >= 86:\n        print(score, \"— отлично\")\n    elif score >= 71:\n        print(score, \"— хорошо\")\n    else:\n        print(score, \"— удовлетворительно\")"
      },
      "Сочетая условия и циклы, можно решить почти любую вычислительную задачу. Важно следить, чтобы цикл обязательно заканчивался, иначе программа «зависнет»."
     ],
     "uz": [
      "Shartlar dasturga harakatni tanlash imkonini beradi: agar bir shart bajarilsa — bir ish, aks holda — boshqa ish qilinadi. Sikllar esa harakatlarni kerak bo'lguncha takrorlaydi.",
      {
       "code": "for score in [56, 71, 88, 93]:\n    if score >= 86:\n        print(score, \"— a'lo\")\n    elif score >= 71:\n        print(score, \"— yaxshi\")\n    else:\n        print(score, \"— qoniqarli\")"
      },
      "Shartlar va sikllarni birlashtirib, deyarli har qanday hisoblash masalasini yechish mumkin. Sikl albatta tugashini kuzatib borish muhim, aks holda dastur «qotib qoladi»."
     ]
    }
   }
  ],
  "format": "text",
  "type": "guide",
  "publisher": "Редакция электронной библиотеки"
 },
 {
  "id": "inf-algo",
  "genre": "programming",
  "subjects": [
   "algorithms",
   "python"
  ],
  "level": "mid",
  "year": 2026,
  "languages": [
   "rus",
   "uzb"
  ],
  "title": {
   "ru": "Алгоритмы и структуры данных",
   "uz": "Algoritmlar va ma'lumotlar tuzilmalari"
  },
  "author": {
   "ru": "Редакция электронной библиотеки",
   "uz": "Elektron kutubxona tahririyati"
  },
  "description": {
   "ru": "Сложность алгоритмов, базовые структуры данных и бинарный поиск.",
   "uz": "Algoritmlar murakkabligi, asosiy ma'lumotlar tuzilmalari va ikkilik qidiruv."
  },
  "pdf": {
   "ru": "books/inf-algo.ru.pdf",
   "uz": "books/inf-algo.uz.pdf"
  },
  "chapters": [
   {
    "title": {
     "ru": "Сложность алгоритмов",
     "uz": "Algoritmlar murakkabligi"
    },
    "content": {
     "ru": [
      "Чтобы сравнивать алгоритмы, оценивают, как растёт время работы при увеличении объёма данных. Для этого используют нотацию «O большое».",
      "O(1) — время не зависит от размера данных, O(n) — растёт пропорционально, O(n²) — квадратично, O(log n) — очень медленно. Поиск в несортированном списке требует O(n), а бинарный поиск — O(log n).",
      "Для миллиона элементов разница огромна: линейный поиск может потребовать миллион проверок, а бинарный — около двадцати."
     ],
     "uz": [
      "Algoritmlarni solishtirish uchun ma'lumotlar hajmi oshganda ishlash vaqti qanday o'sishi baholanadi. Buning uchun «katta O» belgilanishi qo'llaniladi.",
      "O(1) — vaqt ma'lumotlar hajmiga bog'liq emas, O(n) — mutanosib o'sadi, O(n²) — kvadratik, O(log n) — juda sekin o'sadi. Saralanmagan ro'yxatda qidirish O(n), ikkilik qidiruv esa O(log n) talab qiladi.",
      "Million element uchun farq juda katta: chiziqli qidiruv million marta tekshirishni talab qilishi mumkin, ikkilik qidiruv esa taxminan yigirma marta."
     ]
    }
   },
   {
    "title": {
     "ru": "Массивы, стеки и очереди",
     "uz": "Massivlar, steklar va navbatlar"
    },
    "content": {
     "ru": [
      "Массив хранит элементы подряд и даёт мгновенный доступ по индексу. Но вставка в середину требует сдвига всех последующих элементов.",
      "Стек работает по принципу «последним пришёл — первым ушёл»: так устроена кнопка «Отменить» в редакторах. Очередь — «первым пришёл — первым ушёл»: так обрабатываются задания на печать.",
      "Выбор структуры данных часто важнее выбора языка программирования: правильная структура делает программу и быстрее, и проще."
     ],
     "uz": [
      "Massiv elementlarni ketma-ket saqlaydi va indeks bo'yicha bir zumda murojaat qilish imkonini beradi. Ammo o'rtaga element qo'shish keyingi barcha elementlarni surishni talab qiladi.",
      "Stek «oxirgi kelgan — birinchi ketadi» tamoyili bo'yicha ishlaydi: muharrirlardagi «Bekor qilish» tugmasi shunday tuzilgan. Navbat esa «birinchi kelgan — birinchi ketadi» tamoyilida ishlaydi: chop etish topshiriqlari shu tarzda bajariladi.",
      "Ma'lumotlar tuzilmasini tanlash ko'pincha dasturlash tilini tanlashdan muhimroq: to'g'ri tuzilma dasturni ham tezroq, ham soddaroq qiladi."
     ]
    }
   },
   {
    "title": {
     "ru": "Бинарный поиск",
     "uz": "Ikkilik qidiruv"
    },
    "content": {
     "ru": [
      "Бинарный поиск работает только с отсортированными данными. На каждом шаге он сравнивает искомое значение с серединой и отбрасывает ту половину, где ответа быть не может.",
      {
       "code": "def binary_search(arr, x):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == x:\n            return mid\n        if arr[mid] < x:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1"
      },
      "Тот же принцип «деления пополам» люди используют интуитивно, когда ищут слово в бумажном словаре."
     ],
     "uz": [
      "Ikkilik qidiruv faqat saralangan ma'lumotlar bilan ishlaydi. Har bir qadamda u izlanayotgan qiymatni o'rtadagi element bilan solishtiradi va javob bo'lishi mumkin bo'lmagan yarmini tashlab yuboradi.",
      {
       "code": "def binary_search(arr, x):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == x:\n            return mid\n        if arr[mid] < x:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1"
      },
      "Xuddi shu «teng ikkiga bo'lish» tamoyilidan odamlar qog'oz lug'atdan so'z qidirganda beixtiyor foydalanadi."
     ]
    }
   }
  ],
  "format": "text",
  "type": "guide",
  "publisher": "Редакция электронной библиотеки"
 },
 {
  "id": "inf-net",
  "genre": "programming",
  "subjects": [
   "computer networks"
  ],
  "level": "beg",
  "year": 2026,
  "languages": [
   "rus",
   "uzb"
  ],
  "title": {
   "ru": "Компьютерные сети и интернет",
   "uz": "Kompyuter tarmoqlari va internet"
  },
  "author": {
   "ru": "Редакция электронной библиотеки",
   "uz": "Elektron kutubxona tahririyati"
  },
  "description": {
   "ru": "Как устроен интернет: пакеты, IP, DNS, HTTP и безопасность.",
   "uz": "Internet qanday ishlaydi: paketlar, IP, DNS, HTTP va xavfsizlik."
  },
  "pdf": {
   "ru": "books/inf-net.ru.pdf",
   "uz": "books/inf-net.uz.pdf"
  },
  "chapters": [
   {
    "title": {
     "ru": "Как устроен интернет",
     "uz": "Internet qanday tuzilgan"
    },
    "content": {
     "ru": [
      "Интернет — это сеть сетей: миллионы локальных сетей соединены между собой через провайдеров и магистральные каналы, включая подводные оптические кабели.",
      "Данные передаются небольшими порциями — пакетами. Каждый пакет может пройти своим маршрутом, а на стороне получателя они снова собираются в исходное сообщение.",
      "Правила обмена данными называются протоколами. Базовый набор протоколов интернета — TCP/IP: IP отвечает за адресацию и маршрутизацию, TCP — за надёжную доставку."
     ],
     "uz": [
      "Internet — tarmoqlar tarmog'i: millionlab lokal tarmoqlar provayderlar va magistral kanallar, jumladan suv osti optik kabellari orqali o'zaro bog'langan.",
      "Ma'lumotlar kichik qismlarda — paketlarda uzatiladi. Har bir paket o'z yo'nalishi bo'yicha o'tishi mumkin, qabul qiluvchi tomonda esa ular yana dastlabki xabarga yig'iladi.",
      "Ma'lumot almashish qoidalari protokollar deb ataladi. Internetning asosiy protokollar to'plami — TCP/IP: IP manzillash va marshrutlash uchun, TCP esa ishonchli yetkazib berish uchun javob beradi."
     ]
    }
   },
   {
    "title": {
     "ru": "IP-адреса и DNS",
     "uz": "IP-manzillar va DNS"
    },
    "content": {
     "ru": [
      "У каждого устройства в сети есть IP-адрес, например 93.184.216.34. Людям трудно запоминать такие числа, поэтому придумали доменные имена.",
      "DNS — «телефонная книга» интернета. Когда вы вводите адрес сайта, браузер спрашивает у DNS-сервера соответствующий IP-адрес и только затем подключается к серверу.",
      "Из-за нехватки адресов старого формата IPv4 (их около 4,3 млрд) постепенно внедряется IPv6, где количество адресов практически неограниченно."
     ],
     "uz": [
      "Tarmoqdagi har bir qurilmaning IP-manzili bor, masalan 93.184.216.34. Odamlar uchun bunday raqamlarni eslab qolish qiyin, shuning uchun domen nomlari o'ylab topilgan.",
      "DNS — internetning «telefon kitobi». Sayt manzilini kiritganingizda brauzer DNS-serverdan tegishli IP-manzilni so'raydi va shundan keyingina serverga ulanadi.",
      "Eski IPv4 formatidagi manzillar (taxminan 4,3 mlrd) yetishmagani sababli manzillar soni amalda cheksiz bo'lgan IPv6 bosqichma-bosqich joriy etilmoqda."
     ]
    }
   },
   {
    "title": {
     "ru": "HTTP и безопасность",
     "uz": "HTTP va xavfsizlik"
    },
    "content": {
     "ru": [
      "Браузер и сервер общаются по протоколу HTTP: браузер отправляет запрос, сервер возвращает ответ с кодом состояния — например, 200 (успех) или 404 (страница не найдена).",
      "HTTPS — защищённая версия HTTP. Данные шифруются, поэтому посторонний не сможет прочитать пароль или номер карты при передаче. Значок замка в адресной строке говорит о защищённом соединении.",
      "Базовые правила цифровой гигиены: уникальные пароли, двухфакторная аутентификация, своевременное обновление программ и осторожность с подозрительными ссылками."
     ],
     "uz": [
      "Brauzer va server HTTP protokoli orqali muloqot qiladi: brauzer so'rov yuboradi, server esa holat kodi bilan javob qaytaradi — masalan, 200 (muvaffaqiyat) yoki 404 (sahifa topilmadi).",
      "HTTPS — HTTPning himoyalangan versiyasi. Ma'lumotlar shifrlanadi, shuning uchun begona shaxs uzatish paytida parol yoki karta raqamini o'qiy olmaydi. Manzil satridagi qulf belgisi himoyalangan ulanishdan dalolat beradi.",
      "Raqamli gigiyenaning asosiy qoidalari: takrorlanmas parollar, ikki bosqichli autentifikatsiya, dasturlarni o'z vaqtida yangilash va shubhali havolalarga ehtiyotkorlik."
     ]
    }
   }
  ],
  "format": "text",
  "type": "guide",
  "publisher": "Редакция электронной библиотеки"
 },
 {
  "id": "law-theory",
  "genre": "law",
  "subjects": [],
  "level": "beg",
  "year": 2026,
  "languages": [
   "rus",
   "uzb"
  ],
  "title": {
   "ru": "Теория государства и права",
   "uz": "Davlat va huquq nazariyasi"
  },
  "author": {
   "ru": "Редакция электронной библиотеки",
   "uz": "Elektron kutubxona tahririyati"
  },
  "description": {
   "ru": "Понятие права, нормы, источники и правоотношения.",
   "uz": "Huquq tushunchasi, normalar, manbalar va huquqiy munosabatlar."
  },
  "pdf": {
   "ru": "books/law-theory.ru.pdf",
   "uz": "books/law-theory.uz.pdf"
  },
  "chapters": [
   {
    "title": {
     "ru": "Понятие и признаки права",
     "uz": "Huquq tushunchasi va belgilari"
    },
    "content": {
     "ru": [
      "Право — система общеобязательных правил поведения, установленных или санкционированных государством и обеспеченных его защитой. Оно регулирует наиболее важные общественные отношения.",
      "Признаки права: нормативность (общие правила для неопределённого круга лиц), формальная определённость (закрепление в официальных источниках), системность и государственная обеспеченность.",
      "Право отличается от морали: моральные нормы держатся на совести и общественном мнении, а правовые — на возможности государственного принуждения."
     ],
     "uz": [
      "Huquq — davlat tomonidan o'rnatilgan yoki ruxsat etilgan va uning himoyasi bilan ta'minlangan umummajburiy xulq-atvor qoidalari tizimi. U eng muhim ijtimoiy munosabatlarni tartibga soladi.",
      "Huquq belgilari: normativlik (noaniq doiradagi shaxslar uchun umumiy qoidalar), rasmiy aniqlik (rasmiy manbalarda mustahkamlanganlik), tizimlilik va davlat tomonidan ta'minlanganlik.",
      "Huquq axloqdan farq qiladi: axloqiy normalar vijdon va jamoatchilik fikriga tayanadi, huquqiy normalar esa davlat majburlovi imkoniyatiga asoslanadi."
     ]
    }
   },
   {
    "title": {
     "ru": "Норма права и источники",
     "uz": "Huquq normasi va manbalari"
    },
    "content": {
     "ru": [
      "Норма права обычно состоит из трёх элементов: гипотезы (условия применения), диспозиции (самого правила поведения) и санкции (последствий нарушения).",
      "Основные источники права: нормативный правовой акт (закон, указ, постановление), правовой обычай, судебный прецедент и нормативный договор. В странах романо-германской правовой семьи главным источником является закон.",
      "Нормативные акты образуют иерархию: на вершине — конституция, ниже — законы, затем подзаконные акты. Нижестоящий акт не может противоречить вышестоящему."
     ],
     "uz": [
      "Huquq normasi odatda uchta elementdan iborat: gipoteza (qo'llash shartlari), dispozitsiya (xulq-atvor qoidasining o'zi) va sanksiya (buzilish oqibatlari).",
      "Huquqning asosiy manbalari: normativ-huquqiy hujjat (qonun, farmon, qaror), huquqiy odat, sud pretsedenti va normativ shartnoma. Roman-german huquq oilasiga mansub mamlakatlarda asosiy manba qonun hisoblanadi.",
      "Normativ hujjatlar ierarxiyani tashkil etadi: eng yuqorida — konstitutsiya, undan pastda — qonunlar, so'ngra qonunosti hujjatlari. Quyi hujjat yuqori hujjatga zid bo'lishi mumkin emas."
     ]
    }
   },
   {
    "title": {
     "ru": "Правоотношения",
     "uz": "Huquqiy munosabatlar"
    },
    "content": {
     "ru": [
      "Правоотношение — общественная связь, урегулированная нормой права, в которой стороны обладают взаимными правами и обязанностями.",
      "Его структура: субъекты (физические и юридические лица, государство), объект (то, ради чего возникает отношение, — вещь, услуга, нематериальное благо) и содержание (права и обязанности сторон).",
      "Правоотношения возникают, изменяются и прекращаются на основании юридических фактов — событий (например, рождения человека) и действий (например, заключения договора)."
     ],
     "uz": [
      "Huquqiy munosabat — huquq normasi bilan tartibga solingan, tomonlar o'zaro huquq va majburiyatlarga ega bo'lgan ijtimoiy aloqa.",
      "Uning tuzilishi: subyektlar (jismoniy va yuridik shaxslar, davlat), obyekt (munosabat nima uchun yuzaga kelsa — narsa, xizmat, nomoddiy ne'mat) va mazmun (tomonlarning huquq va majburiyatlari).",
      "Huquqiy munosabatlar yuridik faktlar — hodisalar (masalan, insonning tug'ilishi) va harakatlar (masalan, shartnoma tuzish) asosida vujudga keladi, o'zgaradi va tugaydi."
     ]
    }
   }
  ],
  "format": "text",
  "type": "guide",
  "publisher": "Редакция электронной библиотеки"
 },
 {
  "id": "law-const",
  "genre": "law",
  "subjects": [
   "constitutional law"
  ],
  "level": "mid",
  "year": 2026,
  "languages": [
   "rus",
   "uzb"
  ],
  "title": {
   "ru": "Конституционное право",
   "uz": "Konstitutsiyaviy huquq"
  },
  "author": {
   "ru": "Редакция электронной библиотеки",
   "uz": "Elektron kutubxona tahririyati"
  },
  "description": {
   "ru": "Конституция, права человека и разделение властей.",
   "uz": "Konstitutsiya, inson huquqlari va hokimiyatlar bo'linishi."
  },
  "pdf": {
   "ru": "books/law-const.ru.pdf",
   "uz": "books/law-const.uz.pdf"
  },
  "chapters": [
   {
    "title": {
     "ru": "Конституция — основной закон",
     "uz": "Konstitutsiya — asosiy qonun"
    },
    "content": {
     "ru": [
      "Конституция — основной закон государства, обладающий высшей юридической силой. Она закрепляет основы конституционного строя, права и свободы человека, устройство государственной власти.",
      "Особенности конституции: верховенство, прямое действие и особый, усложнённый порядок изменения. Все остальные законы должны ей соответствовать.",
      "Соблюдение конституции обеспечивают органы конституционного контроля — конституционные суды, которые проверяют законы на соответствие основному закону."
     ],
     "uz": [
      "Konstitutsiya — eng oliy yuridik kuchga ega bo'lgan davlatning asosiy qonuni. U konstitutsiyaviy tuzum asoslarini, inson huquq va erkinliklarini, davlat hokimiyatining tuzilishini mustahkamlaydi.",
      "Konstitutsiyaning xususiyatlari: ustunlik, to'g'ridan-to'g'ri amal qilish va alohida, murakkablashtirilgan o'zgartirish tartibi. Boshqa barcha qonunlar unga mos bo'lishi kerak.",
      "Konstitutsiyaga rioya etilishini konstitutsiyaviy nazorat organlari — qonunlarning asosiy qonunga muvofiqligini tekshiradigan konstitutsiyaviy sudlar ta'minlaydi."
     ]
    }
   },
   {
    "title": {
     "ru": "Права и свободы человека",
     "uz": "Inson huquqlari va erkinliklari"
    },
    "content": {
     "ru": [
      "Права человека принято делить на личные (право на жизнь, свободу, неприкосновенность), политические (избирательное право, свобода объединений), социально-экономические (право на труд, образование, охрану здоровья) и культурные.",
      "Основные права неотчуждаемы и принадлежат каждому от рождения. Государство обязано их признавать, соблюдать и защищать.",
      "Осуществление прав одного человека не должно нарушать права и свободы других. Ограничения допускаются только законом и лишь в той мере, в какой это необходимо для защиты конституционно значимых ценностей."
     ],
     "uz": [
      "Inson huquqlari odatda shaxsiy (yashash, erkinlik, daxlsizlik huquqi), siyosiy (saylov huquqi, birlashmalar erkinligi), ijtimoiy-iqtisodiy (mehnat, ta'lim, sog'liqni saqlash huquqi) va madaniy huquqlarga bo'linadi.",
      "Asosiy huquqlar ajralmas bo'lib, tug'ilganidan boshlab har kimga tegishli. Davlat ularni tan olishi, ularga rioya qilishi va ularni himoya qilishi shart.",
      "Bir insonning huquqlarini amalga oshirish boshqalarning huquq va erkinliklarini buzmasligi kerak. Cheklovlarga faqat qonun bilan va konstitutsiyaviy ahamiyatga ega qadriyatlarni himoya qilish uchun zarur bo'lgan darajadagina yo'l qo'yiladi."
     ]
    }
   },
   {
    "title": {
     "ru": "Разделение властей",
     "uz": "Hokimiyatlar bo'linishi"
    },
    "content": {
     "ru": [
      "Принцип разделения властей предполагает, что государственная власть делится на законодательную, исполнительную и судебную. Эту идею детально обосновал французский мыслитель Шарль Монтескьё в XVIII веке.",
      "Законодательная власть принимает законы, исполнительная организует их исполнение, судебная разрешает споры и защищает права.",
      "Ветви власти самостоятельны, но взаимно контролируют друг друга — это система «сдержек и противовесов», которая препятствует концентрации власти в одних руках."
     ],
     "uz": [
      "Hokimiyatlar bo'linishi tamoyili davlat hokimiyati qonun chiqaruvchi, ijro etuvchi va sud hokimiyatlariga bo'linishini nazarda tutadi. Bu g'oyani XVIII asrda fransuz mutafakkiri Sharl Monteskyo batafsil asoslab bergan.",
      "Qonun chiqaruvchi hokimiyat qonunlar qabul qiladi, ijro etuvchi hokimiyat ularning ijrosini tashkil etadi, sud hokimiyati esa nizolarni hal qiladi va huquqlarni himoya qiladi.",
      "Hokimiyat tarmoqlari mustaqil, ammo bir-birini o'zaro nazorat qiladi — bu hokimiyatning bir qo'lda to'planishiga yo'l qo'ymaydigan «tiyib turish va muvozanatlar» tizimidir."
     ]
    }
   }
  ],
  "format": "text",
  "type": "guide",
  "publisher": "Редакция электронной библиотеки"
 },
 {
  "id": "law-civil",
  "genre": "law",
  "subjects": [
   "civil law"
  ],
  "level": "mid",
  "year": 2026,
  "languages": [
   "rus",
   "uzb"
  ],
  "title": {
   "ru": "Основы гражданского права",
   "uz": "Fuqarolik huquqi asoslari"
  },
  "author": {
   "ru": "Редакция электронной библиотеки",
   "uz": "Elektron kutubxona tahririyati"
  },
  "description": {
   "ru": "Субъекты гражданского права, договор и право собственности.",
   "uz": "Fuqarolik huquqi subyektlari, shartnoma va mulk huquqi."
  },
  "pdf": {
   "ru": "books/law-civil.ru.pdf",
   "uz": "books/law-civil.uz.pdf"
  },
  "chapters": [
   {
    "title": {
     "ru": "Субъекты гражданского права",
     "uz": "Fuqarolik huquqi subyektlari"
    },
    "content": {
     "ru": [
      "Участниками гражданских отношений являются физические лица (граждане), юридические лица (организации) и публично-правовые образования.",
      "Правоспособность — способность иметь права и обязанности — возникает у гражданина с рождения. Дееспособность — способность своими действиями приобретать и осуществлять права — в полном объёме обычно наступает с 18 лет.",
      "Юридическое лицо имеет обособленное имущество, отвечает им по своим обязательствам и может от своего имени выступать в суде."
     ],
     "uz": [
      "Fuqarolik munosabatlarining ishtirokchilari jismoniy shaxslar (fuqarolar), yuridik shaxslar (tashkilotlar) va ommaviy-huquqiy tuzilmalardir.",
      "Huquq layoqati — huquq va majburiyatlarga ega bo'lish qobiliyati — fuqaroda tug'ilgan paytdan boshlab vujudga keladi. Muomala layoqati — o'z harakatlari bilan huquqlarni egallash va amalga oshirish qobiliyati — to'liq hajmda odatda 18 yoshdan boshlanadi.",
      "Yuridik shaxs alohida mol-mulkka ega bo'ladi, o'z majburiyatlari bo'yicha shu mol-mulk bilan javob beradi va sudda o'z nomidan ishtirok eta oladi."
     ]
    }
   },
   {
    "title": {
     "ru": "Гражданско-правовой договор",
     "uz": "Fuqarolik-huquqiy shartnoma"
    },
    "content": {
     "ru": [
      "Договор — соглашение двух или более лиц об установлении, изменении или прекращении гражданских прав и обязанностей. Это главный инструмент имущественного оборота.",
      "Договор считается заключённым, когда стороны достигли согласия по всем существенным условиям, прежде всего о предмете. Для некоторых договоров закон требует письменной или нотариальной формы.",
      "Ключевой принцип — свобода договора: стороны сами решают, заключать ли договор, с кем и на каких условиях, но в рамках закона."
     ],
     "uz": [
      "Shartnoma — ikki yoki undan ortiq shaxsning fuqarolik huquq va majburiyatlarini belgilash, o'zgartirish yoki bekor qilish to'g'risidagi kelishuvi. Bu mulkiy muomalaning asosiy vositasidir.",
      "Tomonlar barcha muhim shartlar, eng avvalo shartnoma predmeti bo'yicha kelishuvga erishganda shartnoma tuzilgan hisoblanadi. Ayrim shartnomalar uchun qonun yozma yoki notarial shaklni talab qiladi.",
      "Asosiy tamoyil — shartnoma erkinligi: tomonlar shartnoma tuzish-tuzmaslikni, kim bilan va qanday shartlarda tuzishni o'zlari hal qiladi, biroq qonun doirasida."
     ]
    }
   },
   {
    "title": {
     "ru": "Право собственности",
     "uz": "Mulk huquqi"
    },
    "content": {
     "ru": [
      "Право собственности включает три правомочия: владение (фактическое обладание вещью), пользование (извлечение её полезных свойств) и распоряжение (определение юридической судьбы вещи — продажа, дарение, завещание).",
      "Собственник может защищать своё право с помощью виндикационного иска (истребование вещи из чужого незаконного владения) и негаторного иска (устранение нарушений, не связанных с лишением владения).",
      "Право собственности не абсолютно: собственник не должен нарушать права других лиц и требования закона, например экологические и градостроительные нормы."
     ],
     "uz": [
      "Mulk huquqi uchta vakolatni o'z ichiga oladi: egalik qilish (narsaga amalda ega bo'lish), foydalanish (uning foydali xususiyatlarini olish) va tasarruf etish (narsaning yuridik taqdirini belgilash — sotish, hadya qilish, vasiyat qilish).",
      "Mulkdor o'z huquqini vindikatsion da'vo (narsani o'zganing g'ayriqonuniy egaligidan talab qilib olish) va negator da'vo (egalikdan mahrum qilish bilan bog'liq bo'lmagan buzilishlarni bartaraf etish) yordamida himoya qilishi mumkin.",
      "Mulk huquqi mutlaq emas: mulkdor boshqa shaxslarning huquqlarini va qonun talablarini, masalan, ekologik va shaharsozlik normalarini buzmasligi kerak."
     ]
    }
   }
  ],
  "format": "text",
  "type": "guide",
  "publisher": "Редакция электронной библиотеки"
 },
 {
  "id": "insurance-chernova-t1",
  "genre": "economics",
  "type": "textbook",
  "year": 2010,
  "languages": [
   "rus"
  ],
  "subjects": [
   "insurance",
   "finance"
  ],
  "title": {
   "ru": "Страхование: экономика, организация, управление. Том 1",
   "uz": "Sug'urta: iqtisodiyot, tashkil etish, boshqaruv. 1-jild"
  },
  "author": {
   "ru": "Под ред. Г. В. Черновой",
   "uz": "G. V. Chernova tahriri ostida"
  },
  "publisher": "Экономика · Учебники экономического факультета СПбГУ",
  "description": {
   "ru": "Учебник экономического факультета СПбГУ о сущности страхования, страховании как методе управления риском, классификации страховой деятельности, страховом продукте, договоре страхования и структуре страхового рынка.",
   "uz": "SPbDU iqtisodiyot fakulteti darsligi: sug'urtaning mohiyati, xavfni boshqarish usuli sifatida sug'urta, sug'urta faoliyati tasnifi, sug'urta mahsuloti, sug'urta shartnomasi va sug'urta bozori tuzilmasi."
  },
  "format": "pdf",
  "pdf": "books/pdf/insurance-chernova-t1.pdf",
  "cover": "books/covers/insurance-chernova-t1.jpg",
  "pagesDir": "books/pages/insurance-chernova-t1",
  "pageCount": 11,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "history-economic-thought",
  "genre": "economics",
  "type": "textbook",
  "year": 2014,
  "languages": [
   "rus"
  ],
  "subjects": [
   "economic history"
  ],
  "title": {
   "ru": "История экономических учений",
   "uz": "Iqtisodiy ta'limotlar tarixi"
  },
  "author": {
   "ru": "И. А. Благих, А. Н. Дубянский; под ред. А. Н. Дубянского",
   "uz": "I. A. Blagix, A. N. Dubyanskiy; A. N. Dubyanskiy tahriri ostida"
  },
  "publisher": "Юрайт, Москва · Учебник для академического бакалавриата",
  "description": {
   "ru": "Учебник СПбГУ, допущенный для студентов экономических направлений: развитие экономической мысли от философов древности до первых научных школ, классическая политэкономия, марксизм и экономические учения XIX–XX веков.",
   "uz": "Iqtisodiy yo'nalish talabalari uchun SPbDU darsligi: qadimgi faylasuflardan birinchi ilmiy maktablargacha iqtisodiy fikr rivoji, klassik siyosiy iqtisod, marksizm va XIX–XX asrlar iqtisodiy ta'limotlari."
  },
  "format": "pdf",
  "pdf": "books/pdf/history-economic-thought.pdf",
  "cover": "books/covers/history-economic-thought.jpg",
  "pagesDir": "books/pages/history-economic-thought",
  "pageCount": 7,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "internationales-marketing",
  "genre": "economics",
  "type": "textbook",
  "year": null,
  "languages": [
   "ger",
   "eng"
  ],
  "subjects": [
   "marketing",
   "management"
  ],
  "title": {
   "ru": "Internationales Marketing in Transformationsländern",
   "uz": "Internationales Marketing in Transformationsländern"
  },
  "author": {
   "ru": "Kerstin Pezoldt, Alexandra Koval (при участии С. Сутырина, О. Трофименко, Л. Поповой)",
   "uz": "Kerstin Pezoldt, Alexandra Koval (S. Sutyrin, O. Trofimenko, L. Popova ishtirokida)"
  },
  "publisher": "UVK Verlag, München · utb.",
  "description": {
   "ru": "Немецкоязычный учебник по международному маркетингу в странах с переходной экономикой (часть глав на английском): основы международного маркетинга, цифровизация, теория трансформации, анализ рынков и маркетинговые стратегии.",
   "uz": "O'tish iqtisodiyotidagi mamlakatlarda xalqaro marketing bo'yicha nemis tilidagi darslik (ayrim boblar ingliz tilida): xalqaro marketing asoslari, raqamlashtirish, transformatsiya nazariyasi, bozor tahlili va marketing strategiyalari."
  },
  "format": "pdf",
  "pdf": "books/pdf/internationales-marketing.pdf",
  "cover": "books/covers/internationales-marketing.jpg",
  "pagesDir": "books/pages/internationales-marketing",
  "pageCount": 4,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "peregovory-s-monstrami",
  "genre": "economics",
  "type": "business",
  "year": null,
  "languages": [
   "rus"
  ],
  "subjects": [
   "management"
  ],
  "title": {
   "ru": "Переговоры с монстрами. Как договориться с сильными мира сего",
   "uz": "Kuchlilar bilan muzokaralar: dunyoning qudratli kishilari bilan qanday kelishish mumkin"
  },
  "author": {
   "ru": "Игорь Рызов",
   "uz": "Igor Rizov"
  },
  "publisher": "Кремлёвская школа переговоров",
  "description": {
   "ru": "Деловая книга эксперта по переговорам о том, как договариваться с теми, кто сильнее: давление, манипуляции и способы сохранить свою позицию. В фрагменте — обложка и список литературы.",
   "uz": "Muzokaralar bo'yicha ekspertning o'zidan kuchliroq tomon bilan kelishish, bosim va manipulyatsiyalarga qarshi turish haqidagi biznes kitobi. Parchada — muqova va adabiyotlar ro'yxati."
  },
  "format": "pdf",
  "pdf": "books/pdf/peregovory-s-monstrami.pdf",
  "cover": "books/covers/peregovory-s-monstrami.jpg",
  "pagesDir": "books/pages/peregovory-s-monstrami",
  "pageCount": 4,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "ponyat-uzbekistan",
  "genre": "economics",
  "type": "popular",
  "year": 2026,
  "languages": [
   "rus"
  ],
  "subjects": [
   "society"
  ],
  "title": {
   "ru": "Понять Узбекистан. Записки странствующих социологов",
   "uz": "O'zbekistonni tushunish. Sayohatchi sotsiologlar qaydlari"
  },
  "author": {
   "ru": "Сергей Борисов, Юлия Юшкова-Борисова",
   "uz": "Sergey Borisov, Yuliya Yushkova-Borisova"
  },
  "publisher": "Москва",
  "description": {
   "ru": "Социологические записки об Узбекистане: история государственности, внутреннее разнообразие страны, ценности, базар и экономика повседневности, ремёсла и традиции. Книга отнесена к разделу «Экономика» как исследование общества и хозяйственной жизни страны.",
   "uz": "O'zbekiston haqida sotsiologik qaydlar: davlatchilik tarixi, mamlakatning ichki xilma-xilligi, qadriyatlar, bozor va kundalik iqtisodiyot, hunarmandchilik va an'analar. Kitob jamiyat va xo'jalik hayoti tadqiqoti sifatida «Iqtisodiyot» bo'limiga kiritilgan."
  },
  "format": "pdf",
  "pdf": "books/pdf/ponyat-uzbekistan.pdf",
  "cover": "books/covers/ponyat-uzbekistan.jpg",
  "pagesDir": "books/pages/ponyat-uzbekistan",
  "pageCount": 6,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "electronic-document-systems",
  "genre": "programming",
  "type": "textbook",
  "year": null,
  "languages": [
   "rus"
  ],
  "subjects": [
   "management information systems",
   "information technology"
  ],
  "title": {
   "ru": "Системы электронного документооборота",
   "uz": "Elektron hujjat aylanishi tizimlari"
  },
  "author": {
   "ru": "А. А. Мусалиев, Б. А. Бегалов, Е. А. Мохова",
   "uz": "A. A. Musaliyev, B. A. Begalov, Ye. A. Moxova"
  },
  "publisher": "Ташкентский государственный экономический университет, Ташкент",
  "description": {
   "ru": "Учебное пособие о концепции и технологиях систем электронного документооборота (СЭД): классификация и свойства СЭД, ECM-системы, анализ мирового и российского рынка, выбор и внедрение СЭД, электронный документооборот в государственном управлении.",
   "uz": "Elektron hujjat aylanishi tizimlari (EHAT) konsepsiyasi va texnologiyalari haqida o'quv qo'llanma: EHAT tasnifi va xususiyatlari, ECM-tizimlar, jahon va Rossiya bozori tahlili, EHATni tanlash va joriy etish, davlat boshqaruvida elektron hujjat aylanishi."
  },
  "format": "pdf",
  "pdf": "books/pdf/electronic-document-systems.pdf",
  "cover": "books/covers/electronic-document-systems.jpg",
  "pagesDir": "books/pages/electronic-document-systems",
  "pageCount": 4,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "digital-strategy",
  "genre": "programming",
  "type": "textbook",
  "year": 2024,
  "languages": [
   "uzb"
  ],
  "subjects": [
   "management information systems",
   "information technology"
  ],
  "title": {
   "ru": "Рақамли стратегия ва ахборот тизимлари (Цифровая стратегия и информационные системы)",
   "uz": "Raqamli strategiya va axborot tizimlari"
  },
  "author": {
   "ru": "Б. А. Бегалов, Р. А. Дадабаева",
   "uz": "B. A. Begalov, R. A. Dadabayeva"
  },
  "publisher": "Oltin qalam nashriyoti, Тошкент · ТДИУ",
  "description": {
   "ru": "Учебник на узбекском языке для магистрантов специальности «Цифровая экономика»: бизнес-модели и конкурентные стратегии, информационные системы в организации, электронный бизнес, управление ИТ-проектами и цифровая трансформация.",
   "uz": "«Raqamli iqtisodiyot» mutaxassisligi magistrlari uchun darslik: biznes-modellar va raqobatbardosh strategiyalar, tashkilotda axborot tizimlari, elektron biznes, AT loyihalarini boshqarish va raqamli transformatsiya."
  },
  "format": "pdf",
  "pdf": "books/pdf/digital-strategy.pdf",
  "cover": "books/covers/digital-strategy.jpg",
  "pagesDir": "books/pages/digital-strategy",
  "pageCount": 5,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "pravovedenie-67-4",
  "genre": "law",
  "type": "journal",
  "year": 2023,
  "languages": [
   "rus",
   "eng"
  ],
  "subjects": [
   "comparative law",
   "constitutional law",
   "civil law"
  ],
  "title": {
   "ru": "Правоведение. Т. 67, № 4 (2023)",
   "uz": "Pravovedeniye. 67-jild, 4-son (2023)"
  },
  "author": {
   "ru": "Научно-теоретический журнал СПбГУ",
   "uz": "SPbDU ilmiy-nazariy jurnali"
  },
  "publisher": "Санкт-Петербургский государственный университет",
  "description": {
   "ru": "Выпуск «Comparemus!» памяти профессора Г. Креспи Регицци: конституционное регулирование интернет-платформ в США, развитие российского административного права, реестры недвижимости Германии и России, санкции и договорные обязательства.",
   "uz": "Professor G. Krespi Regitstsi xotirasiga bag'ishlangan «Comparemus!» soni: AQShda internet-platformalarni konstitutsiyaviy tartibga solish, Rossiya ma'muriy huquqi, Germaniya va Rossiya ko'chmas mulk reyestrlari, sanksiyalar va shartnoma majburiyatlari."
  },
  "format": "pdf",
  "pdf": "books/pdf/pravovedenie-67-4.pdf",
  "cover": "books/covers/pravovedenie-67-4.jpg",
  "pagesDir": "books/pages/pravovedenie-67-4",
  "pageCount": 2,
  "ratios": [
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "pravovedenie-67-1",
  "genre": "law",
  "type": "journal",
  "year": 2023,
  "languages": [
   "rus",
   "eng"
  ],
  "subjects": [
   "comparative law",
   "civil law",
   "criminal law"
  ],
  "title": {
   "ru": "Правоведение. Т. 67, № 1 (2023)",
   "uz": "Pravovedeniye. 67-jild, 1-son (2023)"
  },
  "author": {
   "ru": "Научно-теоретический журнал СПбГУ",
   "uz": "SPbDU ilmiy-nazariy jurnali"
  },
  "publisher": "Санкт-Петербургский государственный университет",
  "description": {
   "ru": "Тематический выпуск «Смешанные юрисдикции. Часть I»: право Луизианы, Квебека и Шотландии, трасты, доктрина заблуждения, отпадение цели договора.",
   "uz": "«Aralash yurisdiksiyalar. I qism» mavzuli soni: Luiziana, Kvebek va Shotlandiya huquqi, trastlar, adashish doktrinasi, shartnoma maqsadining yo'qolishi."
  },
  "format": "pdf",
  "pdf": "books/pdf/pravovedenie-67-1.pdf",
  "cover": "books/covers/pravovedenie-67-1.jpg",
  "pagesDir": "books/pages/pravovedenie-67-1",
  "pageCount": 2,
  "ratios": [
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "pravovedenie-66-3",
  "genre": "law",
  "type": "journal",
  "year": 2022,
  "languages": [
   "rus",
   "eng"
  ],
  "subjects": [
   "comparative law",
   "civil law"
  ],
  "title": {
   "ru": "Правоведение. Т. 66, № 3 (2022)",
   "uz": "Pravovedeniye. 66-jild, 3-son (2022)"
  },
  "author": {
   "ru": "Научно-теоретический журнал СПбГУ",
   "uz": "SPbDU ilmiy-nazariy jurnali"
  },
  "publisher": "Санкт-Петербургский государственный университет",
  "description": {
   "ru": "Выпуск о праве Республики Корея: семейное право, общая собственность, аренда «чонсе», наследование, внедоговорная ответственность в двух Кореях, ипотека морских судов.",
   "uz": "Koreya Respublikasi huquqiga bag'ishlangan son: oila huquqi, umumiy mulk, «chonse» ijarasi, meros, ikki Koreyada shartnomadan tashqari javobgarlik, dengiz kemalari ipotekasi."
  },
  "format": "pdf",
  "pdf": "books/pdf/pravovedenie-66-3.pdf",
  "cover": "books/covers/pravovedenie-66-3.jpg",
  "pagesDir": "books/pages/pravovedenie-66-3",
  "pageCount": 2,
  "ratios": [
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "pravovedenie-66-2",
  "genre": "law",
  "type": "journal",
  "year": 2022,
  "languages": [
   "rus",
   "eng"
  ],
  "subjects": [
   "comparative law",
   "civil law"
  ],
  "title": {
   "ru": "Правоведение. Т. 66, № 2 (2022)",
   "uz": "Pravovedeniye. 66-jild, 2-son (2022)"
  },
  "author": {
   "ru": "Научно-теоретический журнал СПбГУ",
   "uz": "SPbDU ilmiy-nazariy jurnali"
  },
  "publisher": "Санкт-Петербургский государственный университет",
  "description": {
   "ru": "Статьи по сравнительному гражданскому праву: функции регистрационной системы, доктрина заблуждения, купля-продажа в исламской традиции, договор репо, защита добросовестного приобретателя недвижимости в КНР.",
   "uz": "Qiyosiy fuqarolik huquqi bo'yicha maqolalar: ro'yxatga olish tizimining vazifalari, adashish doktrinasi, islom an'anasida oldi-sotdi, repo shartnomasi, XXRda ko'chmas mulkni insofli oluvchini himoya qilish."
  },
  "format": "pdf",
  "pdf": "books/pdf/pravovedenie-66-2.pdf",
  "cover": "books/covers/pravovedenie-66-2.jpg",
  "pagesDir": "books/pages/pravovedenie-66-2",
  "pageCount": 2,
  "ratios": [
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "monitoring-pravoprimeneniya",
  "genre": "law",
  "type": "collection",
  "year": null,
  "languages": [
   "rus"
  ],
  "subjects": [
   "jurisprudence",
   "civil law"
  ],
  "title": {
   "ru": "Мониторинг правоприменения 2022–2023. Труды экспертов СПбГУ",
   "uz": "Huquqni qo'llash monitoringi 2022–2023. SPbDU ekspertlari asarlari"
  },
  "author": {
   "ru": "Под науч. ред. С. А. Белова, Н. М. Кропачева",
   "uz": "S. A. Belov, N. M. Kropachev ilmiy tahriri ostida"
  },
  "publisher": "Издательство Санкт-Петербургского университета",
  "description": {
   "ru": "Сборник экспертных исследований правоприменительной практики: трудовое и социальное право, административное право и процесс, гражданское право, цифровые технологии и практика Конституционного суда.",
   "uz": "Huquqni qo'llash amaliyoti bo'yicha ekspert tadqiqotlari to'plami: mehnat va ijtimoiy huquq, ma'muriy huquq va jarayon, fuqarolik huquqi, raqamli texnologiyalar va Konstitutsiyaviy sud amaliyoti."
  },
  "format": "pdf",
  "pdf": "books/pdf/monitoring-pravoprimeneniya.pdf",
  "cover": "books/covers/monitoring-pravoprimeneniya.jpg",
  "pagesDir": "books/pages/monitoring-pravoprimeneniya",
  "pageCount": 5,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "transnational-relations",
  "genre": "law",
  "type": "monograph",
  "year": null,
  "languages": [
   "rus"
  ],
  "subjects": [
   "international law",
   "conflict of laws"
  ],
  "title": {
   "ru": "Правовое регулирование транснациональных отношений",
   "uz": "Transmilliy munosabatlarni huquqiy tartibga solish"
  },
  "author": {
   "ru": "Л. Н. Галенская",
   "uz": "L. N. Galenskaya"
  },
  "publisher": "Издательство Санкт-Петербургского университета",
  "description": {
   "ru": "Система правового регулирования международных отношений, принципы и субъекты транснационального права, правовое положение юридических и физических лиц, международных организаций и ТНК, источники и применение транснационального права.",
   "uz": "Xalqaro munosabatlarni huquqiy tartibga solish tizimi, transmilliy huquq tamoyillari va subyektlari, yuridik va jismoniy shaxslar, xalqaro tashkilotlar va TMKlarning huquqiy holati, transmilliy huquq manbalari."
  },
  "format": "pdf",
  "pdf": "books/pdf/transnational-relations.pdf",
  "cover": "books/covers/transnational-relations.jpg",
  "pagesDir": "books/pages/transnational-relations",
  "pageCount": 4,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "private-international-law",
  "genre": "law",
  "type": "lectures",
  "year": 1999,
  "languages": [
   "rus"
  ],
  "subjects": [
   "conflict of laws",
   "international law"
  ],
  "title": {
   "ru": "Международное частное право. Курс лекций",
   "uz": "Xalqaro xususiy huquq. Ma'ruzalar kursi"
  },
  "author": {
   "ru": "В. П. Звеков",
   "uz": "V. P. Zvekov"
  },
  "publisher": "НОРМА — ИНФРА-М, Москва",
  "description": {
   "ru": "Классический курс лекций: предмет и метод международного частного права, коллизионное и материальное право, источники, коллизионные нормы и их применение, международный гражданский процесс.",
   "uz": "Klassik ma'ruzalar kursi: xalqaro xususiy huquq predmeti va usuli, kolliziya va moddiy huquq, manbalar, kolliziya normalari va ularni qo'llash, xalqaro fuqarolik jarayoni."
  },
  "format": "pdf",
  "pdf": "books/pdf/private-international-law.pdf",
  "cover": "books/covers/private-international-law.jpg",
  "pagesDir": "books/pages/private-international-law",
  "pageCount": 10,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "philosophy-of-law",
  "genre": "law",
  "type": "monograph",
  "year": 2026,
  "languages": [
   "rus"
  ],
  "subjects": [
   "jurisprudence"
  ],
  "title": {
   "ru": "Коммуникативная философия права. Введение в философскую антропологию права и морали",
   "uz": "Huquqning kommunikativ falsafasi. Huquq va axloq falsafiy antropologiyasiga kirish"
  },
  "author": {
   "ru": "А. В. Поляков",
   "uz": "A. V. Polyakov"
  },
  "publisher": "НОРМА, Москва",
  "description": {
   "ru": "Монография о коммуникативной антропологии права: персонализм, взаимное правовое признание, борьба за признание в истории идей, коммуникативные ценности русской философии права и универсальные правовые ценности.",
   "uz": "Huquqning kommunikativ antropologiyasi haqida monografiya: personalizm, o'zaro huquqiy tan olish, g'oyalar tarixida tan olinish uchun kurash, rus huquq falsafasining kommunikativ qadriyatlari."
  },
  "format": "pdf",
  "pdf": "books/pdf/philosophy-of-law.pdf",
  "cover": "books/covers/philosophy-of-law.jpg",
  "pagesDir": "books/pages/philosophy-of-law",
  "pageCount": 4,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "morskoe-pravo-2022-4",
  "genre": "law",
  "type": "journal",
  "year": 2022,
  "languages": [
   "rus",
   "eng"
  ],
  "subjects": [
   "maritime law",
   "international law"
  ],
  "title": {
   "ru": "Морское право / Maritime Law Journal. Выпуск 4/2022",
   "uz": "Dengiz huquqi / Maritime Law Journal. 4/2022-son"
  },
  "author": {
   "ru": "Гл. ред. К. И. Краснокутский",
   "uz": "Bosh muharrir K. I. Krasnokutskiy"
  },
  "publisher": "Ассоциация морского права RUMLA",
  "description": {
   "ru": "Первый в России двуязычный (русско-английский) журнал о морском праве: новости CMI, обзор судебной практики, статьи о перевозке грузов и аресте судов, унификация морского права.",
   "uz": "Rossiyadagi birinchi ikki tilli (rus-ingliz) dengiz huquqi jurnali: CMI yangiliklari, sud amaliyoti sharhi, yuk tashish va kemalarni hibsga olish haqidagi maqolalar, dengiz huquqini unifikatsiya qilish."
  },
  "format": "pdf",
  "pdf": "books/pdf/morskoe-pravo-2022-4.pdf",
  "cover": "books/covers/morskoe-pravo-2022-4.jpg",
  "pagesDir": "books/pages/morskoe-pravo-2022-4",
  "pageCount": 4,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "uzbekistan-laws-1992",
  "genre": "law",
  "type": "laws",
  "year": 1992,
  "languages": [
   "uzb",
   "rus"
  ],
  "subjects": [
   "civil law",
   "constitutional law"
  ],
  "title": {
   "ru": "Республика Узбекистан. Законы и указы (Ўзбекистон Республикаси. Қонун ва фармонлар)",
   "uz": "O'zbekiston Respublikasi. Qonun va farmonlar"
  },
  "author": {
   "ru": "Сборник нормативных актов",
   "uz": "Normativ hujjatlar to'plami"
  },
  "publisher": "Ўзбекистон, Ташкент",
  "description": {
   "ru": "Двуязычный сборник первых законов независимого Узбекистана: о внешнеэкономической деятельности, иностранных инвестициях, собственности, гражданстве, разгосударствлении и приватизации, предприятиях, банках и налогах.",
   "uz": "Mustaqil O'zbekistonning ilk qonunlari ikki tilli to'plami: tashqi iqtisodiy faoliyat, xorijiy investitsiyalar, mulk, fuqarolik, davlat tasarrufidan chiqarish va xususiylashtirish, korxonalar, banklar va soliqlar to'g'risida."
  },
  "format": "pdf",
  "pdf": "books/pdf/uzbekistan-laws-1992.pdf",
  "cover": "books/covers/uzbekistan-laws-1992.jpg",
  "pagesDir": "books/pages/uzbekistan-laws-1992",
  "pageCount": 3,
  "ratios": [
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "notarius-kundaligi",
  "genre": "law",
  "type": "stories",
  "year": 2022,
  "languages": [
   "uzb"
  ],
  "subjects": [
   "civil law",
   "notary"
  ],
  "title": {
   "ru": "Нотариус кундалиги (Дневник нотариуса)",
   "uz": "Notarius kundaligi"
  },
  "author": {
   "ru": "Нотариальная палата Узбекистана",
   "uz": "O'zbekiston Notarial palatasi"
  },
  "publisher": "«Азмир нашр принт», Тошкент",
  "description": {
   "ru": "Сборник на узбекском языке: истории из практики нотариусов Узбекистана, роль нотариата в формировании имиджа нового Узбекистана, история института нотариата.",
   "uz": "O'zbekiston notariuslari amaliyotidan hayotiy hikoyalar to'plami: Yangi O'zbekiston imijini shakllantirishda notariatning o'rni, notariat instituti tarixi."
  },
  "format": "pdf",
  "pdf": "books/pdf/notarius-kundaligi.pdf",
  "cover": "books/covers/notarius-kundaligi.jpg",
  "pagesDir": "books/pages/notarius-kundaligi",
  "pageCount": 9,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 },
 {
  "id": "siyosatshunoslik",
  "genre": "law",
  "type": "textbook",
  "year": 2024,
  "languages": [
   "uzb"
  ],
  "subjects": [
   "political science"
  ],
  "title": {
   "ru": "Сиёсатшунослик (Политология)",
   "uz": "Siyosatshunoslik"
  },
  "author": {
   "ru": "Мукимжон Киргизбоев",
   "uz": "Muqimjon Qirg'izboyev"
  },
  "publisher": "«Sharq», Тошкент · Университет журналистики и массовых коммуникаций Узбекистана",
  "description": {
   "ru": "Учебник по политологии на узбекском языке для вузов: методология науки, политика и власть, политическая система и институты, политические процессы, политическая культура, мировая политика и политическая система Нового Узбекистана. Отнесён к разделу «Право» как наука о государстве и власти.",
   "uz": "Oliy o'quv yurtlari uchun siyosatshunoslik darsligi: fan metodologiyasi, siyosat va hokimiyat, siyosiy tizim va institutlar, siyosiy jarayonlar, siyosiy madaniyat, jahon siyosati va Yangi O'zbekiston siyosiy tizimi. Davlat va hokimiyat haqidagi fan sifatida «Huquq» bo'limiga kiritilgan."
  },
  "format": "pdf",
  "pdf": "books/pdf/siyosatshunoslik.pdf",
  "cover": "books/covers/siyosatshunoslik.jpg",
  "pagesDir": "books/pages/siyosatshunoslik",
  "pageCount": 4,
  "ratios": [
   1.4153,
   1.4153,
   1.4153,
   1.4153
  ],
  "fragment": true,
  "added": "2026-11"
 }
];
