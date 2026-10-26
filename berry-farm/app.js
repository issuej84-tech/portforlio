/* Логика сайта. Тексты и фото — в content.js, здесь обычно ничего менять не нужно. */
(function () {
  "use strict";

  var S = window.SITE;
  if (!S) {
    document.body.insertAdjacentHTML("afterbegin",
      '<p class="config-error">Не удалось прочитать content.js — проверьте кавычки и запятые в последней правке.</p>');
    return;
  }

  var C = S.contacts || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- helpers ----------
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function fill(slot, html) { $$('[data-slot="' + slot + '"]').forEach(function (el) { el.innerHTML = html; }); }
  function list(a) { return Array.isArray(a) ? a : []; }

  var ICONS = {
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    basket: '<path d="M3 10h18l-2 10H5L3 10z"/><path d="m8 10 4-6 4 6"/><path d="M9 14v3M15 14v3M12 14v3"/>',
    hand: '<path d="M8 13V6a1.5 1.5 0 0 1 3 0v6"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 8-7 8-3 0-4.5-1.5-6-4l-1.5-2.6a1.5 1.5 0 0 1 2.6-1.5L8 15"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19 13 11"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    truck: '<path d="M2 6h11v10H2z"/><path d="M13 9h4l4 4v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    cart: '<path d="M3 4h2l2.4 11h10.2L20 8H7"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    jar: '<path d="M8 3h8v3H8z"/><path d="M7 6h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M5 12h14"/>',
    star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    send: '<path d="M21 4 3 11l6 2 2 6 3-4 5 4z"/><path d="m9 13 12-9"/>',
    chat: '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  };
  function icon(name) {
    return '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || ICONS.star) + "</svg>";
  }

  var BERRY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.2c4.6 0 7.6 2.2 7.6 5.6 0 4.2-4.4 9.2-7.6 9.2s-7.6-5-7.6-9.2c0-3.4 3-5.6 7.6-5.6z" fill="#e2303f"/>' +
    '<g fill="#fde9a8"><ellipse cx="9" cy="11.5" rx=".55" ry=".8"/><ellipse cx="12" cy="10.8" rx=".55" ry=".8"/><ellipse cx="15" cy="11.5" rx=".55" ry=".8"/><ellipse cx="10.4" cy="14.6" rx=".55" ry=".8"/><ellipse cx="13.6" cy="14.6" rx=".55" ry=".8"/><ellipse cx="12" cy="17.8" rx=".55" ry=".8"/></g>' +
    '<path d="M12 8.6c-1.8.9-3.6.8-5.2-.2 1.2-1.2 3-1.6 4.6-1.2-.9-1.2-1.1-2.6-.6-4 1.3.9 1.9 2.3 1.8 3.7.7-1.3 2-2.1 3.5-2.2-.3 1.5-1.3 2.6-2.6 3.1 1.6-.1 3.1.6 4 1.9-1.9.6-3.8.2-5.5-1.1z" fill="#3d8b57"/></svg>';

  // ---------- общие блоки ----------
  var brand = S.brand || {};
  fill("logo", '<span class="logo-mark">' + BERRY + '</span><span class="logo-text"><b>' + esc(brand.name) + "</b><small>" + esc(brand.tagline) + "</small></span>");
  $$('[data-slot="logo"]').forEach(function (a) { a.setAttribute("aria-label", (brand.name || "") + " — на главную"); });

  var season = S.season || {};
  fill("season", season.text ? '<span class="dot' + (season.open ? " is-on" : "") + '"></span>' + esc(season.text) : "");

  $$('[data-slot="phone"]').forEach(function (a) {
    if (!C.phone) { a.hidden = true; return; }
    a.href = "tel:" + (C.phoneLink || C.phone);
    a.innerHTML = icon("phone") + "<span>" + esc(C.phone) + "</span>";
  });

  function messengerLinks(text) {
    var q = text ? "?text=" + encodeURIComponent(text) : "";
    var out = [];
    if (C.telegram) out.push({ label: "Telegram", icon: "send", href: "https://t.me/" + C.telegram.replace(/^@/, "") + q });
    if (C.whatsapp) out.push({ label: "WhatsApp", icon: "chat", href: "https://wa.me/" + String(C.whatsapp).replace(/\D/g, "") + q });
    return out;
  }
  var socialLinks = messengerLinks().concat(list(C.socials).map(function (s) { return { label: s.label, icon: "link", href: s.href }; }));
  fill("messengers", socialLinks.map(function (m) {
    return '<a class="round-link" href="' + esc(m.href) + '" target="_blank" rel="noopener" aria-label="' + esc(m.label) + '" title="' + esc(m.label) + '">' + icon(m.icon) + "</a>";
  }).join(""));

  // Свои разделы с addToMenu попадают в меню перед «Контактами»
  var menu = list(S.menu).slice();
  list(S.customSections).forEach(function (sec) {
    if (!sec.addToMenu || !sec.id) return;
    var item = { label: sec.menuLabel || sec.title, href: "#" + sec.id, icon: sec.icon || "star" };
    var at = menu.findIndex(function (m) { return m.href === "#contacts"; });
    at < 0 ? menu.push(item) : menu.splice(at, 0, item);
  });
  fill("menu", menu.map(function (m) {
    return '<a href="' + esc(m.href) + '">' + icon(m.icon) + "<span>" + esc(m.label) + "</span></a>";
  }).join(""));
  fill("top-menu", list(S.topMenu).map(function (m) { return '<a href="' + esc(m.href) + '">' + esc(m.label) + "</a>"; }).join(""));

  // ---------- первый экран ----------
  var hero = S.hero || {};
  fill("hero-title", esc(hero.title));
  fill("hero-hand", esc(hero.handwritten));
  fill("hero-text", esc(hero.text));
  function button(b, extra) {
    return '<a class="btn btn-' + esc(b.style || "primary") + (extra ? " " + extra : "") + '" href="' + esc(b.href || "#") + '"' +
      (b.method ? ' data-method="' + esc(b.method) + '"' : "") + (b.product ? ' data-product="' + esc(b.product) + '"' : "") + ">" + esc(b.label) + "</a>";
  }
  fill("hero-buttons", list(hero.buttons).map(function (b) { return button(b); }).join(""));

  var slides = list(S.slides);
  fill("slides", slides.map(function (s, i) {
    return '<img ' + (i === 0 ? 'src="' + esc(s.image) + '" fetchpriority="high"' : 'data-src="' + esc(s.image) + '"') +
      ' alt="' + esc(s.caption) + '" decoding="async"' + (i === 0 ? ' class="is-active"' : "") + ">";
  }).join(""));
  fill("slide-dots", slides.length > 1 ? slides.map(function (s, i) {
    return '<button type="button" aria-label="Фото ' + (i + 1) + " из " + slides.length + '"' + (i === 0 ? ' aria-current="true"' : "") + "><i></i></button>";
  }).join("") : "");

  (function slider() {
    var imgs = $$(".slides img"), dots = $$(".slide-dots button"), caption = $('[data-slot="slide-caption"]');
    var card = $(".hero-card"), current = 0, timer = null, DELAY = 6000;
    if (!imgs.length) return;
    function show(i) {
      current = (i + imgs.length) % imgs.length;
      imgs.forEach(function (img, k) {
        if (k === current && img.dataset.src) { img.src = img.dataset.src; img.removeAttribute("data-src"); }
        img.classList.toggle("is-active", k === current);
      });
      dots.forEach(function (d, k) { k === current ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current"); });
      if (caption) caption.textContent = slides[current].caption || "";
      restart();
    }
    function restart() {
      clearTimeout(timer);
      card.classList.remove("is-playing"); void card.offsetWidth;
      if (reduceMotion || imgs.length < 2 || card.matches(":hover") || document.hidden) return;
      card.classList.add("is-playing");
      timer = setTimeout(function () { show(current + 1); }, DELAY);
    }
    dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); }); });
    card.addEventListener("mouseenter", function () { clearTimeout(timer); card.classList.remove("is-playing"); });
    card.addEventListener("mouseleave", restart);
    document.addEventListener("visibilitychange", restart);
    var x0 = null;
    card.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    card.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    });
    // Остальные слайды грузим после загрузки страницы, чтобы первый экран открывался быстро
    window.addEventListener("load", function () {
      imgs.forEach(function (img) { if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute("data-src"); } });
    });
    show(0);
  })();

  fill("highlights", list(S.highlights).map(function (h) {
    return '<div class="highlight reveal">' + icon(h.icon) + "<div><b>" + esc(h.title) + "</b><span>" + esc(h.text) + "</span></div></div>";
  }).join(""));

  // ---------- продукция ----------
  var products = list(S.products);
  fill("product-filters", list(S.productCategories).map(function (c, i) {
    return '<button type="button" class="chip" data-filter="' + esc(c.id) + '" aria-pressed="' + (i === 0) + '">' + esc(c.label) + "</button>";
  }).join(""));
  fill("products", products.map(function (p) {
    var soon = p.available === false;
    return '<article class="product reveal' + (soon ? " is-soon" : "") + '" data-category="' + esc(p.category) + '">' +
      '<div class="product-img"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async">' +
      (p.badge ? '<span class="badge">' + esc(p.badge) + "</span>" : "") + "</div>" +
      '<div class="product-body"><h3>' + esc(p.title) + "</h3><p>" + esc(p.text) + "</p>" +
      '<div class="product-foot">' +
      (p.price ? '<p class="price">' + esc(p.price) + " <small>" + esc(p.unit) + "</small></p>" : "") +
      (soon ? '<span class="soon-note">Скоро в продаже</span>'
            : '<a class="btn btn-primary btn-sm" href="#order" data-product="' + esc(p.id) + '">Заказать</a>') +
      "</div></div></article>";
  }).join(""));
  $$(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.dataset.filter;
      $$(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      $$(".product").forEach(function (card) { card.hidden = f !== "all" && card.dataset.category !== f; });
    });
  });

  // ---------- самосбор ----------
  var pick = S.pick;
  if (pick) {
    fill("pick",
      '<div class="pick-main reveal">' +
        '<span class="tag tag-yellow">Самосбор</span>' +
        "<h2>" + esc(pick.title) + "</h2>" +
        '<p class="pick-text">' + esc(pick.text) + "</p>" +
        (pick.hours ? '<p class="pick-hours">' + icon("clock") + esc(pick.hours) + "</p>" : "") +
        (pick.button ? button(Object.assign({ style: "light" }, pick.button)) : "") +
      "</div>" +
      '<div class="pick-photos reveal">' +
        list(pick.images).slice(0, 2).map(function (src, i) {
          return '<img class="pick-photo pick-photo-' + (i + 1) + '" src="' + esc(src) + '" alt="Самосбор клубники" loading="lazy" decoding="async">';
        }).join("") +
        (pick.price ? '<div class="price-sticker"><b>' + esc(pick.price) + "</b><span>" + esc(pick.priceUnit) + "</span></div>" : "") +
      "</div>" +
      '<ol class="pick-steps">' + list(pick.steps).map(function (s, i) {
        return '<li class="reveal"><span class="step-n">' + (i + 1) + "</span><b>" + esc(s.title) + "</b><p>" + esc(s.text) + "</p></li>";
      }).join("") + "</ol>");
  } else {
    $("#pick").hidden = true;
  }

  // ---------- о нас ----------
  var about = S.about || {}, owner = about.owner || {};
  fill("about-title", esc(about.title));
  fill("about",
    '<figure class="owner reveal">' +
      (owner.photo ? '<img src="' + esc(owner.photo) + '" alt="' + esc(owner.name) + '" loading="lazy" decoding="async">' : "") +
      '<figcaption><span class="hand">' + esc(owner.name) + "</span><small>" + esc(owner.role) + "</small></figcaption>" +
    "</figure>" +
    '<div class="about-text reveal">' + list(about.paragraphs).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      (owner.quote ? '<blockquote><p>«' + esc(owner.quote) + '»</p><cite class="hand">— ' + esc(owner.name) + "</cite></blockquote>" : "") +
    "</div>");
  var thisYear = new Date().getFullYear();
  fill("timeline", list(about.timeline).map(function (t) {
    var future = Number(t.year) > thisYear;
    return '<li class="reveal' + (future ? " is-future" : "") + '"><span class="tl-year">' + esc(t.year) + "</span><b>" + esc(t.title) + "</b><p>" + esc(t.text) + "</p>" +
      (future ? '<span class="tl-plan">в планах</span>' : "") + "</li>";
  }).join(""));

  // ---------- галерея ----------
  var gallery = list(S.gallery);
  fill("gallery", gallery.map(function (g, i) {
    return '<button type="button" class="g-item reveal" data-index="' + i + '" aria-label="Открыть фото: ' + esc(g.alt) + '">' +
      '<img src="' + esc(g.image) + '" alt="' + esc(g.alt) + '" loading="lazy" decoding="async"></button>';
  }).join(""));

  (function lightbox() {
    var box = $(".lightbox"), img = $("img", box), idx = 0, opener = null;
    function show(i) { idx = (i + gallery.length) % gallery.length; img.src = gallery[idx].image; img.alt = gallery[idx].alt || ""; }
    function open(i, from) { opener = from; show(i); box.hidden = false; document.body.classList.add("no-scroll"); $(".lb-close", box).focus(); }
    function close() { box.hidden = true; document.body.classList.remove("no-scroll"); if (opener) opener.focus(); }
    $$(".g-item").forEach(function (b) { b.addEventListener("click", function () { open(Number(b.dataset.index), b); }); });
    box.addEventListener("click", function (e) {
      var a = e.target.closest("[data-action]");
      if (!a) { if (e.target === box) close(); return; }
      if (a.dataset.action === "lb-close") close();
      if (a.dataset.action === "lb-prev") show(idx - 1);
      if (a.dataset.action === "lb-next") show(idx + 1);
    });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "Tab") { // держим фокус внутри окна просмотра
        var f = $$(".lb-btn", box), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  })();

  // ---------- доставка ----------
  var delivery = S.delivery || {};
  fill("delivery",
    (delivery.image ? '<div class="delivery-photo reveal"><img src="' + esc(delivery.image) + '" alt="Ящики с клубникой" loading="lazy" decoding="async"></div>' : "") +
    '<div class="delivery-list">' + list(delivery.items).map(function (d) {
      return '<article class="delivery-card reveal" id="delivery-' + esc(d.id) + '">' +
        '<span class="delivery-icon">' + icon(d.icon) + "</span>" +
        "<div><h3>" + esc(d.title) + "</h3><p>" + esc(d.text) + "</p>" +
        '<ul class="pills">' + list(d.details).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></article>";
    }).join("") + "</div>");

  // ---------- свои разделы ----------
  fill("custom-sections", list(S.customSections).map(function (sec) {
    return '<section class="section" id="' + esc(sec.id) + '"><div class="custom reveal">' +
      (sec.image ? '<img src="' + esc(sec.image) + '" alt="' + esc(sec.title) + '" loading="lazy" decoding="async">' : "") +
      '<div class="custom-body">' + (sec.label ? '<span class="tag tag-pink">' + esc(sec.label) + "</span>" : "") +
      "<h2>" + esc(sec.title) + "</h2><p>" + esc(sec.text) + "</p>" +
      (sec.button ? button(Object.assign({ style: "primary" }, sec.button)) : "") + "</div></div></section>";
  }).join(""));

  // ---------- форма заказа ----------
  var form = $("#order-form"), done = $('[data-slot="order-done"]'), errorBox = $(".form-error", form);
  var methods = list(S.orderMethods);
  fill("order-products",
    products.filter(function (p) { return p.available !== false; }).map(function (p) {
      return '<option value="' + esc(p.id) + '">' + esc(p.title) + (p.price ? " — " + esc(p.price) + " " + esc(p.unit) : "") + "</option>";
    }).join("") + '<option value="other">Другое — напишу в комментарии</option>');
  fill("order-methods", methods.map(function (m, i) {
    return '<label><input type="radio" name="method" value="' + esc(m.id) + '"' + (i === 0 ? " checked" : "") + "><span>" + esc(m.label) + "</span></label>";
  }).join(""));
  var addressField = $("[data-address]", form);
  function syncAddress() {
    var m = methods.find(function (x) { return x.id === (form.method && form.method.value); });
    addressField.hidden = !(m && m.needsAddress);
  }
  form.addEventListener("change", syncAddress);
  syncAddress();

  // Кнопки с data-product / data-method заранее заполняют форму
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-product], [data-method]");
    if (!a) return;
    if (a.dataset.product && form.product.querySelector('option[value="' + a.dataset.product + '"]')) form.product.value = a.dataset.product;
    if (a.dataset.method) {
      var r = form.querySelector('input[name="method"][value="' + a.dataset.method + '"]');
      if (r) { r.checked = true; syncAddress(); }
    }
    showForm();
  });

  function showForm() { done.hidden = true; form.hidden = false; }
  function formatDate(v) { var p = v.split("-"); return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : v; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim(), phone = form.phone.value.trim();
    var bad = !name ? form.name : phone.replace(/\D/g, "").length < 10 ? form.phone : null;
    $$(".is-invalid", form).forEach(function (el) { el.classList.remove("is-invalid"); el.removeAttribute("aria-invalid"); });
    if (bad) {
      bad.classList.add("is-invalid"); bad.setAttribute("aria-invalid", "true"); bad.focus();
      errorBox.textContent = bad === form.name ? "Укажите, как к вам обращаться." : "Проверьте номер телефона — нужно не меньше 10 цифр.";
      errorBox.hidden = false;
      return;
    }
    errorBox.hidden = true;
    var method = methods.find(function (m) { return m.id === form.method.value; }) || {};
    var product = form.product.options[form.product.selectedIndex];
    var lines = [
      "Заявка с сайта «" + (brand.name || "") + "»",
      "Имя: " + name,
      "Телефон: " + phone,
      "Заказ: " + (product ? product.text : ""),
      form.qty.value.trim() && "Количество: " + form.qty.value.trim(),
      "Получение: " + (method.label || ""),
      method.needsAddress && form.address.value.trim() && "Адрес: " + form.address.value.trim(),
      form.date.value && "Дата: " + formatDate(form.date.value),
      form.comment.value.trim() && "Комментарий: " + form.comment.value.trim(),
    ].filter(Boolean);
    var text = lines.join("\n");
    var channels = messengerLinks(text);

    done.innerHTML =
      '<span class="done-mark">✓</span><h3>Заявка готова</h3>' +
      "<p>" + (channels.length
        ? "Нажмите, куда отправить: откроется мессенджер с уже написанным сообщением."
        : "Скопируйте текст и отправьте нам удобным способом или позвоните.") + "</p>" +
      '<pre class="done-text"></pre>' +
      '<div class="done-actions">' +
        channels.map(function (c) { return '<a class="btn btn-primary" href="' + esc(c.href) + '" target="_blank" rel="noopener">' + icon(c.icon) + esc(c.label) + "</a>"; }).join("") +
        (C.phone ? '<a class="btn btn-outline" href="tel:' + esc(C.phoneLink || C.phone) + '">' + icon("phone") + "Позвонить</a>" : "") +
        '<button type="button" class="btn btn-outline" data-copy>' + icon("copy") + "<span>Скопировать</span></button>" +
      "</div>" +
      '<button type="button" class="link-btn" data-edit>← Изменить заявку</button>';
    $(".done-text", done).textContent = text;
    form.hidden = true; done.hidden = false;
    $("h3", done).setAttribute("tabindex", "-1"); $("h3", done).focus();

    $("[data-copy]", done).addEventListener("click", function () {
      var label = $("span", this);
      copyText(text).then(function () { label.textContent = "Скопировано"; }, function () { label.textContent = "Не удалось"; });
    });
    $("[data-edit]", done).addEventListener("click", function () { showForm(); form.name.focus(); });
  });

  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (ok, fail) {
      var ta = document.createElement("textarea");
      ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? ok() : fail(); } catch (err) { fail(err); }
      ta.remove();
    });
  }

  // ---------- контакты ----------
  var contactCards = [
    C.address && { icon: "pin", title: "Адрес", html: esc(C.address) },
    C.phone && { icon: "phone", title: "Телефон", html: '<a href="tel:' + esc(C.phoneLink || C.phone) + '">' + esc(C.phone) + "</a>" },
    C.hours && { icon: "clock", title: "Часы работы", html: esc(C.hours) },
    C.email && { icon: "mail", title: "Почта", html: '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>" },
    socialLinks.length && { icon: "send", title: "Мессенджеры и соцсети", html: socialLinks.map(function (m) { return '<a href="' + esc(m.href) + '" target="_blank" rel="noopener">' + esc(m.label) + "</a>"; }).join(" · ") },
  ].filter(Boolean);
  fill("contacts",
    '<div class="contact-cards">' + contactCards.map(function (c) {
      return '<div class="contact-card reveal">' + icon(c.icon) + "<div><small>" + esc(c.title) + "</small><p>" + c.html + "</p></div></div>";
    }).join("") + "</div>" +
    (C.mapEmbed ? '<div class="map reveal"><iframe src="' + esc(C.mapEmbed) + '" title="Карта: как к нам доехать" loading="lazy" allowfullscreen></iframe></div>' : ""));

  // ---------- подвал ----------
  var credits = S.credits;
  fill("footer",
    '<div class="footer-inner">' +
      '<a class="logo" href="#top">' + '<span class="logo-mark">' + BERRY + '</span><span class="logo-text"><b>' + esc(brand.name) + "</b><small>" + esc(brand.tagline) + "</small></span></a>" +
      '<nav class="footer-nav">' + menu.map(function (m) { return '<a href="' + esc(m.href) + '">' + esc(m.label) + "</a>"; }).join("") + "</nav>" +
      '<p class="footer-meta">© ' + thisYear + " " + esc(brand.name) +
        (credits && credits.href ? ' · <a href="' + esc(credits.href) + '">' + esc(credits.label) + "</a>" : "") + "</p>" +
    "</div>");

  // ---------- мобильное меню ----------
  var burger = $(".burger"), scrim = $(".scrim"), sidebar = $("#sidebar");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    scrim.hidden = !open;
  }
  burger.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
  scrim.addEventListener("click", function () { setMenu(false); });
  sidebar.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); burger.focus(); } });

  // ---------- типографика: предлоги и тире не остаются в конце строки ----------
  (function typograph() {
    var re = /(^|[\s(«"])([А-Яа-яЁё]{1,2})\s+(?=\S)/g, nodes = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return n.parentNode.closest("script, style, pre, textarea, option") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; },
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      // дважды — чтобы поймать идущие подряд короткие слова («и в лес»)
      var v = n.nodeValue, t = v.replace(re, "$1$2\u00a0").replace(re, "$1$2\u00a0").replace(/\s+—/g, "\u00a0—");
      if (t !== v) n.nodeValue = t;
    });
  })();

  // ---------- подсветка пункта меню и появление блоков ----------
  if ("IntersectionObserver" in window) {
    var links = $$(".side-nav a, .top-nav a");
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.classList.contains("hero") ? "#top" : "#" + en.target.id;
        links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").concat([$(".hero")]).forEach(function (s) { spy.observe(s); });

    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); reveal.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    if (!reduceMotion) { document.documentElement.classList.add("js-reveal"); $$(".reveal").forEach(function (el) { reveal.observe(el); }); }
  }
})();
