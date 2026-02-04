const listEl = document.getElementById('list');
let data = [];

// load data surat
async function load(){
  const r = await fetch('https://equran.id/api/surat');
  data = await r.json();
  render(data);
}

// render grid card
function render(arr){
  listEl.innerHTML = '';
  arr.forEach(s => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <b>${s.nomor}. ${s.nama_latin}</b>
      <div class="arab">${s.nama}</div>
      <div class="meta">${s.jumlah_ayat} ayat • ${s.tempat_turun}</div>
    `;
    el.onclick = () => location.href = `surat.html?id=${s.nomor}`;
    listEl.appendChild(el);
  });
}

// back to top
const btn = document.querySelector('.top');
window.addEventListener('scroll', () => {
  btn.style.display = window.scrollY > 400 ? 'block' : 'none';
});
function scrollToTop(){
  scrollTo({top:0,behavior:'smooth'});
}

// footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

load();
