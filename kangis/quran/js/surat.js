/* ======================================================
   ROUTER + SLUG
====================================================== */

function slugify(text){
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9\s-]/g,'')
    .replace(/\s+/g,'-')
    .replace(/-+/g,'-');
}

function resolveSurahId(){
  const raw = new URLSearchParams(location.search).get('id') || '1';
  return parseInt(raw.split('-')[0], 10);
}

const id = resolveSurahId();


/* ======================================================
   ELEMENTS
====================================================== */

const titleLatin = document.getElementById('titleLatin');
const titleArab  = document.getElementById('titleArab');
const titleArti  = document.getElementById('titleArti');
const info       = document.getElementById('info');
const content    = document.getElementById('content');
const bismillah  = document.getElementById('bismillah');

const audio  = document.getElementById('player');
const wrap   = document.getElementById('playerWrap');
const topBtn = document.querySelector('.top');

const navBtns  = document.querySelectorAll('.nav:first-of-type button');
const navBtnsB = document.querySelectorAll('#navBottom button');


/* ======================================================
   STATE
====================================================== */

let ayatEls = [];
let currentIndex = -1;

let prevSurah = null;
let nextSurah = null;
let allSurah  = [];

const AUTO_NEXT_SURAH = true;


/* ======================================================
   PLAYER
====================================================== */

const player = new Plyr(audio, {
  controls:['play','progress','current-time','mute','volume'],
  resetOnEnd:true
});


/* ======================================================
   BACK TO TOP
====================================================== */

window.addEventListener('scroll',()=>{
  if(!topBtn) return;
  topBtn.style.display = scrollY>500?'block':'none';
});

function scrollToTop(){
  scrollTo({top:0,behavior:'smooth'});
}


/* ======================================================
   AUDIO CONTROL
====================================================== */

function playAyat(i){

  if(i<0 || i>=ayatEls.length) return;

  currentIndex = i;

  const file =
    `${String(id).padStart(3,'0')}${String(i+1).padStart(3,'0')}`;

  audio.src =
    `https://everyayah.com/data/Alafasy_64kbps/${file}.mp3`;

  wrap.classList.add('show');

  player.play();

  highlight(i);

  localStorage.setItem(`lastAyatSurah${id}`, i);
}


/* ===== autoplay ===== */

audio.addEventListener('ended',()=>{

  // lanjut ayat
  if(currentIndex < ayatEls.length-1){
    playAyat(currentIndex+1);
    return;
  }

  // lanjut surat (FIX TANPA /surat/)
  if(AUTO_NEXT_SURAH && nextSurah){
    const s = allSurah[nextSurah-1];

    location.href =
      `surat.html?id=${nextSurah}-${slugify(s.nama_latin)}`;
  }
});

function closePlayer(){
  player.pause();
  audio.src='';
  wrap.classList.remove('show');
}


/* ======================================================
   AYAT STATE
====================================================== */

function setActiveAyat(i){
  if(i<0 || i>=ayatEls.length) return;
  currentIndex=i;
  highlight(i);
}

function highlight(i){

  ayatEls.forEach(e=>e.classList.remove('active'));

  const el = ayatEls[i];
  if(!el) return;

  el.classList.add('active');

  el.scrollIntoView({
    behavior:'smooth',
    block:'nearest'
  });
}


/* ======================================================
   NAVIGATION
====================================================== */

function go(n){

  // prev
  if(n===-1 && prevSurah){
    const s = allSurah[prevSurah-1];

    location.href =
      `surat.html?id=${prevSurah}-${slugify(s.nama_latin)}`;
  }

  // next
  if(n===1 && nextSurah){
    const s = allSurah[nextSurah-1];

    location.href =
      `surat.html?id=${nextSurah}-${slugify(s.nama_latin)}`;
  }
}


function setNav(btns){

  if(!btns.length) return;

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

  if(prevSurah)
    btns[0].innerHTML =
      prevSVG + allSurah[prevSurah-1].nama_latin;

  if(nextSurah)
    btns[1].innerHTML =
      allSurah[nextSurah-1].nama_latin + nextSVG;
}


/* ======================================================
   LOAD DATA
====================================================== */

async function load(){

  allSurah =
    await (await fetch('https://equran.id/api/surat')).json();

  prevSurah = id>1 ? id-1 : null;
  nextSurah = id<114 ? id+1 : null;

  setNav(navBtns);
  setNav(navBtnsB);

  const s =
    await (await fetch(`https://equran.id/api/surat/${id}`)).json();


  /* ===== HEADER ===== */

  titleLatin.textContent = `${s.nomor}. ${s.nama_latin}`;
  titleArab.textContent  = s.nama;
  titleArti.textContent  = `(${s.arti})`;
  info.textContent       =
    `${s.jumlah_ayat} Ayat • ${s.tempat_turun}`;


  /* ===== SEO ===== */

  document.title =
    `${s.nama_latin} (${s.nama}) - Al Quran Digital 30 Juz`;

  const canonical =
    document.querySelector("link[rel='canonical']");
  if(canonical) canonical.href = location.href;


  /* ===== BISMILLAH ===== */

  bismillah.textContent =
    (id!==1 && id!==9)
      ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
      : '';


  /* ===== AYAT ===== */

  content.innerHTML='';
  ayatEls=[];

  s.ayat.forEach((a,i)=>{

    const el=document.createElement('div');
    el.className='ayat';

    el.innerHTML=`
      <button class="play">▶</button>
      <div class="arab">
        <span class="ayah-text">${a.ar}</span>
        ۝${toArabic(a.nomor)}
      </div>
      <div class="arti">${a.idn}</div>
    `;

    el.querySelector('.play').onclick=()=>playAyat(i);

    content.appendChild(el);
    ayatEls.push(el);
  });


  /* ===== restore last ===== */

  const last =
    localStorage.getItem(`lastAyatSurah${id}`);

  if(last!==null) setActiveAyat(+last);
}


/* ======================================================
   UTILS
====================================================== */

function toArabic(n){
  return n.toString()
    .replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
}


/* ======================================================
   START
====================================================== */

load();
