/* =========================
   GET URL PARAM
========================= */
function getQueryVariable(variable) {
  const params = new URLSearchParams(window.location.search);
  return params.get(variable);
}

/* =========================
   ON LOAD
========================= */
window.addEventListener("load", function () {
  let url = getQueryVariable("url");

  // hentikan kalau param url tidak ada
  if (!url) return;

  // pastikan pakai http / https
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  // set ke semua iframe / view
  for (let i = 1; i <= 10; i++) {
    const el = document.getElementById(i === 1 ? "view" : "view" + i);
    if (el) el.src = url;
  }
});

/* =========================
   ACCORDION
========================= */
const accordionBtns = document.querySelectorAll(".accordion");

accordionBtns.forEach((accordion) => {
  accordion.addEventListener("click", function () {
    this.classList.toggle("is-open");

    const content = this.nextElementSibling;

    if (!content) return;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

/* =========================
   SMOOTH SCROLL (jQuery)
========================= */
$('a[href*="#"]')
  .not('[href="#"]')
  .not('[href="#0"]')
  .on("click", function (event) {

    if (
      location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") &&
      location.hostname === this.hostname
    ) {
      let target = $(this.hash);
      target = target.length
        ? target
        : $("[name=" + this.hash.slice(1) + "]");

      if (target.length) {
        event.preventDefault();

        $("html, body").animate(
          { scrollTop: target.offset().top },
          1000,
          function () {
            target.attr("tabindex", "-1").focus();
          }
        );
      }
    }
  });
