(function () {
  "use strict";

  const content = window.FARM_CONTENT || { products: [], contacts: {} };
  const products = content.products;
  const grid = document.querySelector("#product-grid");
  const orderDialog = document.querySelector("#order-dialog");
  const galleryDialog = document.querySelector("#gallery-dialog");
  const privacyDialog = document.querySelector("#privacy-dialog");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function arrowIcon() {
    return '<svg class="icon" aria-hidden="true"><use href="#i-arrow-up"/></svg>';
  }

  function renderProducts(filter = "all") {
    grid.innerHTML = "";
    products.forEach((product, index) => {
      if (filter !== "all" && product.category !== filter) return;
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="product-tag">${product.tag}</span>
        </div>
        <div class="product-body">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-bottom">
            <span class="product-unit">${product.unit}<br>Цена по запросу</span>
            <button class="product-order" type="button" data-product-index="${index}" aria-label="${product.picking ? "Записаться на самосбор" : "Заказать: " + product.name}">${arrowIcon()}</button>
          </div>
        </div>`;
      grid.append(card);
    });
  }

  renderProducts();

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      renderProducts(button.dataset.filter);
    });
  });

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-index]");
    if (!button) return;
    const product = products[Number(button.dataset.productIndex)];
    openOrder(product.name, Boolean(product.picking));
  });

  const productSelects = [document.querySelector("#dialog-product"), document.querySelector("#contact-product")];
  productSelects.forEach((select) => {
    products.forEach((product) => select.add(new Option(product.name, product.name)));
  });

  function setContact(id, value, fallback) {
    document.querySelector(id).textContent = value || fallback;
  }
  setContact("#contact-phone", content.contacts.phone, "Телефон будет добавлен");
  setContact("#contact-address", content.contacts.address, "Адрес будет добавлен");
  setContact("#contact-hours", content.contacts.hours, "Уточняйте при записи");
  document.querySelector("#year").textContent = new Date().getFullYear();

  function openOrder(productName = "", picking = false, method = "") {
    closeMenu();
    const form = document.querySelector("#dialog-form");
    form.reset();
    form.requestType.value = picking ? "Запись на самосбор" : "Заказ ягод";
    form.product.value = picking ? "Самосбор клубники" : productName;
    document.querySelector("#dialog-title").innerHTML = picking ? "Записаться <em>на самосбор</em>" : "Заказать <em>ягоды</em>";
    orderDialog.querySelector(":scope > p").textContent = picking
      ? "Выберите самосбор и оставьте контакты — дату визита согласуем при подтверждении."
      : "Оставьте контакты, и мы уточним детали заказа.";
    if (method) {
      const radio = form.querySelector(`input[name="method"][value="${method === "pickup" ? "Самовывоз" : "Доставка"}"]`);
      if (radio) radio.checked = true;
    }
    form.querySelector(".form-result").hidden = true;
    orderDialog.showModal();
  }

  document.querySelectorAll("[data-order]").forEach((button) => {
    button.addEventListener("click", () => openOrder("", false, button.dataset.method));
  });
  document.querySelectorAll("[data-picking]").forEach((button) => {
    button.addEventListener("click", () => openOrder("Самосбор клубники", true));
  });
  document.querySelector("[data-close-dialog]").addEventListener("click", () => orderDialog.close());

  [orderDialog, galleryDialog, privacyDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");
  function closeMenu() {
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Открыть меню");
    menuButton.querySelector("use").setAttribute("href", "#i-menu");
    document.body.classList.remove("menu-open");
  }
  menuButton.addEventListener("click", () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute("aria-label", opening ? "Закрыть меню" : "Открыть меню");
    menuButton.querySelector("use").setAttribute("href", opening ? "#i-close" : "#i-menu");
    document.body.classList.toggle("menu-open", opening);
  });
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 820) closeMenu(); });

  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll("[data-slide]")];
  let activeSlide = 0;
  let sliderTimer;
  function showSlide(index) {
    activeSlide = index;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-pressed", String(i === index));
    });
    document.querySelector("#slide-current").textContent = String(index + 1).padStart(2, "0");
  }
  function startSlider() {
    if (reduceMotion) return;
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => showSlide((activeSlide + 1) % slides.length), 5500);
  }
  dots.forEach((dot) => dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slide));
    startSlider();
  }));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(sliderTimer);
    else startSlider();
  });
  startSlider();

  document.querySelectorAll("[data-gallery]").forEach((button) => {
    button.addEventListener("click", () => {
      const image = galleryDialog.querySelector("img");
      image.src = button.dataset.gallery;
      image.alt = button.dataset.caption;
      galleryDialog.querySelector("p").textContent = button.dataset.caption;
      galleryDialog.showModal();
    });
  });
  document.querySelector("[data-close-gallery]").addEventListener("click", () => galleryDialog.close());
  document.querySelectorAll("[data-privacy]").forEach((button) => button.addEventListener("click", () => privacyDialog.showModal()));
  document.querySelector("[data-close-privacy]").addEventListener("click", () => privacyDialog.close());

  function requestText(form) {
    const data = new FormData(form);
    const lines = [data.get("requestType"), `Имя: ${data.get("name")}`, `Телефон: ${data.get("phone")}`];
    if (data.get("product")) lines.push(`Продукция: ${data.get("product")}`);
    if (data.get("method")) lines.push(`Получение: ${data.get("method")}`);
    if (data.get("comment")) lines.push(`Комментарий: ${data.get("comment")}`);
    return lines.join("\n");
  }

  async function copyText(text, button) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    button.textContent = "Заявка скопирована";
  }

  document.querySelectorAll(".order-form").forEach((form) => {
    const phone = form.querySelector('input[name="phone"]');
    phone.addEventListener("input", () => phone.setCustomValidity(""));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const digits = phone.value.replace(/\D/g, "");
      if (digits.length < 10) {
        phone.setCustomValidity("Введите номер телефона минимум из 10 цифр");
        phone.reportValidity();
        return;
      }
      if (!form.reportValidity()) return;
      const text = requestText(form);
      const result = form.querySelector(".form-result");
      result.innerHTML = "<strong>Заявка подготовлена</strong>Демо-режим: данные никуда не отправлены. Скопируйте заявку, чтобы передать её владельцу фермы.<br>";
      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "copy-request";
      copyButton.textContent = "Скопировать текст заявки";
      copyButton.addEventListener("click", () => copyText(text, copyButton));
      result.append(copyButton);
      result.hidden = false;
      result.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
  });
})();
