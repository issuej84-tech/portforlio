/* Цветовые варианты для согласования: ?theme=berry, meadow или sunshine. */
(function () {
  var theme = new URLSearchParams(window.location.search).get("theme");
  document.documentElement.dataset.theme = ["berry", "meadow", "sunshine"].indexOf(theme) >= 0 ? theme : "berry";
})();
