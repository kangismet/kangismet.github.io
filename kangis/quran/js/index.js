/* ======================================================
   ELEMENT
====================================================== */
const listEl = document.getElementById('list');
let data = [];


/* ======================================================
   SLUG (SEO friendly)
====================================================== */
function slugify(text){
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9\s-]/g,'')
    .replace(/\s+/g,'-')
    .replace(/-+/g,'-');
}


/* ======================================================
   LOAD DATA
====================================================== */
async function load(){
  const r = await fetch('https://equran.id/api/surat');
  data = await r.json();
  render(data);
}


/* ======================================================
   RENDER CARD GRID
====================================================== */
function render(arr){

  listEl.innerHTML = '';

  arr.forEach(s => {

    const el = document.createElement('div');
    el.className = 'card';

    el.innerHTML = `
      <b>${s.nomor}. ${s.nama_latin}</b>
      <div class="arab">${s.nama}</div>
      <div class="meta">
        ${s.jumlah_ayat} ayat • ${s.tempat_turun}
      </div>
    `;

    /* ==============================
       TANPA WORKER → pakai query
       hasil:
       surat.html?id=2-al-baqarah
    ============================== */
    el.onclick = () =>
      location.href =
        `surat.html?id=${s.nomor}-${slugify(s.nama_latin)}`;

    listEl.appendChild(el);
  });
}


/* ======================================================
   DARK MODE
====================================================== */
function toggleDark(){

  const dark = document.body.classList.toggle('dark');

  localStorage.setItem('dark', dark);

  document.querySelector('.toggle').textContent =
    dark ? '☀' : '🌙';
}

if(localStorage.getItem('dark') === 'true'){
  document.body.classList.add('dark');
}


/* ======================================================
   BACK TO TOP
====================================================== */
const btn = document.querySelector('.top');

window.addEventListener('scroll', () => {
  btn.style.display =
    window.scrollY > 400 ? 'block' : 'none';
});

function scrollToTop(){
  window.scrollTo({top:0, behavior:'smooth'});
}


/* ======================================================
   START
====================================================== */
load();