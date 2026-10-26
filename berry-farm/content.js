/*
  ============================================================
  ВЕСЬ ТЕКСТ САЙТА — ЗДЕСЬ.
  Меняйте значения в кавычках, сохраняйте файл и обновляйте страницу.
  Подробная инструкция: README.md в этой же папке.

  Правила, чтобы ничего не сломать:
  • текст всегда в кавычках: "вот так";
  • после каждого элемента списка или поля — запятая;
  • фото кладите в папку img/ и пишите путь: "img/имя-файла.webp".
  ============================================================
*/

window.SITE = {

  // ---------- Название и контакты ----------
  brand: {
    name: "Ягодная поляна",
    tagline: "фермерская клубника",
  },

  contacts: {
    phone: "+7 (900) 000-00-00",      // как показывать на сайте
    phoneLink: "+79000000000",        // для кнопки «Позвонить» — только цифры и +
    telegram: "",                     // ник без @, например "berry_farm". Пусто — кнопки нет
    whatsapp: "",                     // номер цифрами, например "79000000000". Пусто — кнопки нет
    email: "",
    address: "Московская область, д. Пример, ул. Полевая, 1",
    hours: "В сезон ежедневно 8:00–20:00",
    // Карта: откройте yandex.ru/maps, найдите ферму → «Поделиться» → «Виджет с картой» → скопируйте ссылку из src="..."
    mapEmbed: "https://yandex.ru/map-widget/v1/?ll=37.617635%2C55.755814&z=9",
    socials: [
      // { label: "ВКонтакте", href: "https://vk.com/..." },
    ],
  },

  // Плашка вверху. open: true — зелёная мигающая точка, false — серая
  season: { open: true, text: "Сезон клубники открыт" },

  // ---------- Левое меню (добавить кнопку = добавить строку) ----------
  // icon: home, basket, hand, leaf, camera, truck, cart, pin, jar, star, phone
  menu: [
    { label: "Главная",   href: "#top",      icon: "home" },
    { label: "Продукция", href: "#products", icon: "basket" },
    { label: "Самосбор",  href: "#pick",     icon: "hand" },
    { label: "О нас",     href: "#about",    icon: "leaf" },
    { label: "Галерея",   href: "#gallery",  icon: "camera" },
    { label: "Доставка",  href: "#delivery", icon: "truck" },
    { label: "Заказать",  href: "#order",    icon: "cart" },
    { label: "Контакты",  href: "#contacts", icon: "pin" },
  ],

  // ---------- Верхнее меню ----------
  topMenu: [
    { label: "Цены",     href: "#products" },
    { label: "Самосбор", href: "#pick" },
    { label: "Галерея",  href: "#gallery" },
    { label: "Контакты", href: "#contacts" },
  ],

  // ---------- Первый экран ----------
  hero: {
    title: "Клубника с поля — к вашему столу",
    handwritten: "собрано сегодня утром",
    text: "Свежая ягода с нашего поля, самосбор для всей семьи и домашние заготовки круглый год.",
    // style: primary (красная), light (белая), ghost (прозрачная)
    // method: pickup / courier / pick — сразу выбирает способ получения в форме заказа
    buttons: [
      { label: "Посмотреть продукцию", href: "#products", style: "primary" },
      { label: "Заказать",  href: "#order",    style: "light" },
      { label: "Самовывоз", href: "#order",    style: "ghost", method: "pickup" },
      { label: "Доставка",  href: "#order",    style: "ghost", method: "courier" },
    ],
  },

  // Фото, которые плавно сменяют друг друга на первом экране
  slides: [
    { image: "img/hero-field.webp",      caption: "Наше клубничное поле" },
    { image: "img/hero-greenhouse.webp", caption: "Теплицы: ягода зреет даже в дождливое лето" },
    { image: "img/hero-berry.webp",      caption: "Собираем только спелую ягоду" },
    { image: "img/hero-crate.webp",      caption: "Утренний сбор — в тот же день у вас" },
    { image: "img/hero-bowl.webp",       caption: "Самосбор: приезжайте и собирайте сами" },
  ],

  // Полоса с преимуществами под первым экраном
  highlights: [
    { icon: "sun",    title: "Сбор каждое утро", text: "Ягода попадает к вам в день сбора" },
    { icon: "hand",   title: "Самосбор на поле", text: "Приезжайте всей семьёй" },
    { icon: "truck",  title: "Доставка",         text: "По городу и области" },
    { icon: "jar",    title: "Заготовки",        text: "Варенье, джем и заморозка круглый год" },
  ],

  // ---------- Продукция ----------
  productCategories: [
    { id: "all",       label: "Всё" },
    { id: "fresh",     label: "Свежие ягоды" },
    { id: "preserves", label: "Заготовки" },
  ],

  // available: false — карточка с плашкой «Скоро» без кнопки заказа
  products: [
    { id: "strawberry", category: "fresh", title: "Клубника свежая", text: "Крупная сладкая ягода утреннего сбора.", price: "600 ₽", unit: "за кг", image: "img/p-strawberry.webp", badge: "Сезон" },
    { id: "frozen", category: "preserves", title: "Клубника замороженная", text: "Шоковая заморозка целой ягодой — для смузи, выпечки и десертов.", price: "450 ₽", unit: "за кг", image: "img/p-frozen.webp" },
    { id: "varenie", category: "preserves", title: "Варенье из клубники", text: "Варим небольшими партиями, ягода остаётся целой.", price: "450 ₽", unit: "банка 0,5 л", image: "img/p-varenie.webp" },
    { id: "jam", category: "preserves", title: "Клубничный джем", text: "Густой джем для тостов, блинов и сырников.", price: "390 ₽", unit: "банка 300 г", image: "img/p-jam.webp" },
    { id: "dried", category: "preserves", title: "Сушёная клубника", text: "Хрустящие ягоды без сахара — полезный перекус.", price: "350 ₽", unit: "за 100 г", image: "img/p-dried.webp" },
    { id: "raspberry", category: "fresh", title: "Малина", text: "Высаживаем малинник — первый урожай уже скоро.", price: "", unit: "", image: "img/p-raspberry.webp", badge: "Скоро · 2028", available: false },
    { id: "blueberry", category: "fresh", title: "Голубика", text: "Готовим участок под голубику.", price: "", unit: "", image: "img/p-blueberry.webp", badge: "Скоро · 2029", available: false },
  ],

  // ---------- Самосбор ----------
  pick: {
    title: "Соберите клубнику сами",
    text: "Приезжайте на поле с детьми и друзьями: выдадим корзинки, покажем грядки со спелой ягодой. Собранное взвешиваем и оплачиваете по весу.",
    price: "350 ₽",
    priceUnit: "за кг",
    hours: "Июнь — июль, ежедневно 8:00–20:00",
    steps: [
      { title: "Запишитесь", text: "Оставьте заявку или позвоните — подскажем лучший день" },
      { title: "Приезжайте", text: "Корзинки и перчатки выдадим на месте" },
      { title: "Собирайте",  text: "Пробовать ягоду на грядке можно!" },
      { title: "Взвешиваем", text: "Оплата по весу наличными или картой" },
    ],
    images: ["img/pick-1.webp", "img/pick-2.webp"],
    button: { label: "Записаться на самосбор", href: "#order", method: "pick" },
  },

  // ---------- О нас ----------
  about: {
    title: "Как всё начиналось",
    paragraphs: [
      "Мы — небольшая семейная ферма. Всё началось с желания выращивать ягоду, которую не стыдно дать собственным детям: спелую, ароматную и собранную в тот же день.",
      "Первым делом мы посадили клубнику. Дальше — малина и голубика: шаг за шагом расширяем поле и будем рассказывать здесь, как растёт наша ферма.",
    ],
    owner: {
      name: "Имя Фамилия",
      role: "основатель фермы",
      photo: "img/about-owner.webp",   // замените на фото владельца
      quote: "Хочу, чтобы каждая ягода была такой, как в детстве у бабушки на даче.",
    },
    timeline: [
      { year: "2026", title: "Начало", text: "Подготовили поле и высадили клубнику" },
      { year: "2027", title: "Первый урожай", text: "Продажа ягоды, самосбор и заготовки" },
      { year: "2028", title: "Малина", text: "Первый сбор малины" },
      { year: "2029", title: "Голубика", text: "Первый сбор голубики" },
    ],
  },

  // ---------- Галерея ----------
  gallery: [
    { image: "img/g-rows.webp",    alt: "Ряды клубники на поле" },
    { image: "img/g-hand.webp",    alt: "Горсть спелой клубники" },
    { image: "img/g-tunnels.webp", alt: "Теплицы для клубники" },
    { image: "img/g-crates.webp",  alt: "Ящики с собранной ягодой" },
    { image: "img/g-bloom.webp",   alt: "Клубника цветёт в теплице" },
    { image: "img/g-kid.webp",     alt: "Ребёнок собирает клубнику" },
    { image: "img/g-people.webp",  alt: "Гости на самосборе" },
    { image: "img/g-flower.webp",  alt: "Цветок клубники" },
    { image: "img/g-basket.webp",  alt: "Корзинка клубники" },
    { image: "img/g-picking.webp", alt: "Сбор ягоды в тарелку" },
  ],

  // ---------- Доставка и самовывоз ----------
  delivery: {
    image: "img/delivery.webp",
    items: [
      { id: "pickup",  icon: "pin",    title: "Самовывоз с фермы", text: "Заберите заказ сами — соберём к вашему приезду.", details: ["В сезон ежедневно 8:00–20:00", "Бесплатно"] },
      { id: "courier", icon: "truck",  title: "Доставка по городу", text: "Привезём в день сбора, пока ягода свежая.", details: ["От 3 кг — бесплатно", "До 3 кг — 300 ₽"] },
      { id: "region",  icon: "basket", title: "Заготовки по России", text: "Варенье, джем и сушёную ягоду отправим транспортной компанией.", details: ["СДЭК / Почта России", "По тарифу перевозчика"] },
    ],
  },

  // Способы получения в форме заказа. needsAddress: true — появится поле «Адрес»
  orderMethods: [
    { id: "pickup",  label: "Самовывоз" },
    { id: "courier", label: "Доставка", needsAddress: true },
    { id: "pick",    label: "Самосбор на поле" },
  ],

  // Ссылка в подвале на авторов фото. Когда замените все фото на свои — удалите этот блок
  credits: { label: "Фото: Wikimedia Commons — авторы и лицензии", href: "credits.html" },

  // ---------- Свои разделы ----------
  // Новый раздел = скопируйте пример ниже, уберите // в начале строк и поменяйте текст.
  // addToMenu: true — кнопка раздела сама появится в левом меню.
  customSections: [
    // {
    //   id: "excursions",
    //   title: "Экскурсии на ферму",
    //   label: "Новое",
    //   text: "Проводим экскурсии для школ и детских садов.",
    //   image: "img/g-people.webp",
    //   button: { label: "Записаться", href: "#order" },
    //   addToMenu: true,
    //   icon: "star",
    // },
  ],
};
