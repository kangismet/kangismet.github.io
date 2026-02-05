(function () {
  const KEY = 'dark';
  const toggleBtn = document.querySelector('.toggle');

  function apply(dark) {
    document.body.classList.toggle('dark', dark);
    if (toggleBtn) toggleBtn.textContent = dark ? '☀' : '🌙';
  }

  // restore saat load
  const saved = localStorage.getItem(KEY) === 'true';
  apply(saved);

  // expose global
  window.toggleDark = function () {
    const dark = !document.body.classList.contains('dark');
    localStorage.setItem(KEY, dark);
    apply(dark);
  };
})();

/* ===============================
   Footer year
================================ */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();