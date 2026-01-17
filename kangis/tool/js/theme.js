    const yearEl = document.getElementById('year');
    yearEl.textContent = new Date().getFullYear();

    function toggleDark() {
      document.body.classList.toggle('dark');
      localStorage.setItem('darkMode', document.body.classList.contains('dark'));
    }

    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark');
    }