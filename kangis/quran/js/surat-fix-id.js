/* ================= INIT ================= */
const id = +new URLSearchParams(location.search).get('id') || 1;

const titleLatin = document.getElementById('titleLatin');
const titleArab  = document.getElementById('titleArab');
const titleArti  = document.getElementById('titleArti');
const info       = document.getElementById('info');
const content    = document.getElementById('content');
const bismillah  = document.getElementById('bismillah');

const audio = document.getElementById('player');
const wrap  = document.getElementById('playerWrap');
const topBtn = document.querySelector('.top');

const navBtns  = document.querySelectorAll('.nav:first-of-type button');
const navBtnsB = document.querySelectorAll('#navBottom button');

let ayatEls = [];
let currentIndex = -1;
let prevSurah = null;
let nextSurah = null;

const AUTO_NEXT_SURAH = true;

/* ================= PLYR ================= */
const player = new Plyr(audio, {
  controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
  resetOnEnd: true
});

/* ================= MAPPING ================= */
const namaArab = {
  2:"ٱلْبَقَرَة",
  55:"ٱلرَّحْمَٰن",
  67:"ٱلْمُلْك",
  112:"ٱلْإِخْلَاص"
};

const artiSurat = {
  2:"Sapi Betina",
  8:"Harta Rampasan Perang",
  15:"Negeri Kaum Tsamud",
  17:"Perjalanan Malam",
  30:"Bangsa Romawi",
  32:"Sujud",
  34:"Negeri Saba",
  45:"Yang Berlutut",
  47:"Nabi Muhammad SAW",
  55:"Yang Maha Pengasih",
  60:"Perempuan yang Diuji",
  62:"Hari Jum'at",
  81:"Menggulung",
  87:"Yang Maha Tinggi",
  88:"Hari Pembalasan",
  93:"Waktu Dhuha",
  103:"Masa",
  106:"Suku Quraisy",
  108:"Nikmat yang Banyak",
  112:"Kemurnian Keesaan Allah",
  113:"Waktu Subuh"
};

/* ================= BACK TO TOP ================= */
window.addEventListener('scroll', () => {
  if (!topBtn) return;
  topBtn.style.display = scrollY > 500 ? 'block' : 'none';
});

function scrollToTop(){
  scrollTo({ top: 0, behavior: 'smooth' });
}

/* ================= AUDIO ================= */
function playAyat(i){
  if (i < 0 || i >= ayatEls.length) return;

  currentIndex = i;

  const file =
    `${String(id).padStart(3,'0')}${String(i+1).padStart(3,'0')}`;

  audio.src = `https://everyayah.com/data/Alafasy_64kbps/${file}.mp3`;
  wrap.classList.add('show');

  player.play();
  highlight(i);

  localStorage.setItem(`lastAyatSurah${id}`, i);
}

audio.addEventListener('ended', () => {
  if (currentIndex < ayatEls.length - 1) {
    playAyat(currentIndex + 1);
  } else if (AUTO_NEXT_SURAH && nextSurah) {
    location.href = `?id=${nextSurah}`;
  }
});

function closePlayer(){
  player.pause();
  audio.src = '';
  wrap.classList.remove('show');
}

/* ================= AYAT STATE ================= */
function setActiveAyat(i){
  if (i < 0 || i >= ayatEls.length) return;
  currentIndex = i;
  highlight(i);
}

function highlight(i){
  ayatEls.forEach(e => e.classList.remove('active'));
  const el = ayatEls[i];
  if (!el) return;

  el.classList.add('active');

  /* SMOOTH TANPA LOMPAT */
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}

/* ================= NAV ================= */
function go(n){
  if (n === -1 && prevSurah) location.href = `?id=${prevSurah}`;
  if (n === 1 && nextSurah) location.href = `?id=${nextSurah}`;
}

function setNav(btns, all){
  const prevSVG =
    `<svg width="16" viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6"
        fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`;

  const nextSVG =
    `<svg width="16" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6"
        fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`;

  if (prevSurah)
    btns[0].innerHTML = prevSVG + all[prevSurah - 1].nama_latin;

  if (nextSurah)
    btns[1].innerHTML = all[nextSurah - 1].nama_latin + nextSVG;
}

/* ================= LOAD ================= */
async function load(){
  const all = await (await fetch('https://equran.id/api/surat')).json();

  prevSurah = id > 1 ? id - 1 : null;
  nextSurah = id < 114 ? id + 1 : null;

  setNav(navBtns, all);
  setNav(navBtnsB, all);

  const s = await (await fetch(`https://equran.id/api/surat/${id}`)).json();

  titleLatin.textContent = `${s.nomor}. ${s.nama_latin}`;
  titleArab.textContent  = namaArab[s.nomor] || s.nama;
  titleArti.textContent  = `(${artiSurat[s.nomor] || s.arti})`;
  info.textContent       = `${s.jumlah_ayat} Ayat • ${s.tempat_turun}`;

  bismillah.textContent =
    (id !== 1 && id !== 9)
      ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
      : '';

  content.innerHTML = '';
  ayatEls = [];

  s.ayat.forEach((a, i) => {
    const el = document.createElement('div');
    el.className = 'ayat';
    el.innerHTML=`
      <button class="play">▶</button>
      <div class="arab">
  <span class="ayah-text">${a.ar}</span>
  ۝${toArabic(a.nomor)}
</div>
      <div class="arti">${a.idn}</div>
    `;
    el.querySelector('.play').onclick = () => playAyat(i);
    content.appendChild(el);
    ayatEls.push(el);
  });

  const last = localStorage.getItem(`lastAyatSurah${id}`);
  if (last !== null) setActiveAyat(+last);
}

function toArabic(n){
  return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}

load();
