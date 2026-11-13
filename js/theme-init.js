/* Применяем тему до отрисовки страницы, чтобы не было «вспышки» светлого фона. */
(function () {
  var theme = null;
  try { theme = JSON.parse(localStorage.getItem('eb-theme')); } catch (e) { /* хранилище недоступно */ }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
})();
