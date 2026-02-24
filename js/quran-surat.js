/* =====================================
   INIT + PARSE ID/SLUG
===================================== */

const raw = new URLSearchParams(location.search).get('id') || '1';
const id  = +raw.split('-')[0];

function slugify(str){
  return str.toLowerCase()
    .replace(/[^\w\s-]/g,'')
    .trim()
    .replace(/\s+/g,'-');
}

function goTo(namaLatin, nomor){
  location.href = `surat.html?id=${nomor}-${slugify(namaLatin)}`;
}


/* =====================================
   ELEMENTS
===================================== */

const titleLatin = document.getElementById('titleLatin');
const titleArab  = document.getElementById('titleArab');
const titleArti  = document.getElementById('titleArti');
const info       = document.getElementById('info');
const content    = document.getElementById('content');
const bismillah  = document.getElementById('bismillah');

const audio = document.getElementById('player');

/* QPLAYER */
const qpWrap   = document.getElementById('playerWrap');
const qpPlay   = document.getElementById('qpPlay');
const qpPrev   = document.getElementById('qpPrev');
const qpNext   = document.getElementById('qpNext');
const qpClose  = document.getElementById('qpClose');
const qpRepeat = document.getElementById('qpRepeat');
const qpVol    = document.getElementById('qpVol');
const qpWave   = document.getElementById('qpWave');
const qpBar    = document.getElementById('qpBar');
const qpInfo   = document.getElementById('qpInfo');
const iconPlay  = document.getElementById('qpIconPlay');
const iconPause = document.getElementById('qpIconPause');

/* NAV */
const navBtns  = document.querySelectorAll('.nav:first-of-type button');
const navBtnsB = document.querySelectorAll('#navBottom button');


/* =====================================
   STATE
===================================== */

let ayatEls=[];
let currentIndex=-1;

let allSurat=[];
let prevSurah=null;
let nextSurah=null;

let repeatOne=false;

const AUTO_NEXT_SURAH = true;


/* =====================================
   SVG ICONS
===================================== */

const iconPlayBtn = `
<svg viewBox="0 0 24 24" width="16">
<polygon points="8,5 19,12 8,19" fill="currentColor"/>
</svg>`;

const iconPauseBtn = `
<svg viewBox="0 0 24 24" width="16">
<rect x="6" y="5" width="4" height="14" fill="currentColor"/>
<rect x="14" y="5" width="4" height="14" fill="currentColor"/>
</svg>`;


/* =====================================
   PLAY AYAT
===================================== */

// default reciter
window.RECITER = window.RECITER || 'Ghamadi_40kbps';

const BASE_AUDIO_URL = 'https://everyayah.com/data/';

function playAyat(i){
  if(i<0 || i>=ayatEls.length) return;

  currentIndex=i;

  const file =
    `${String(id).padStart(3,'0')}${String(i+1).padStart(3,'0')}`;

  audio.src =
  `${BASE_AUDIO_URL}${window.RECITER}/${file}.mp3`;

  audio.play();

  highlight(i);
  updateInfo();

  qpWrap.classList.add('show');

  resetAllIcons();
  ayatEls[i].querySelector('.play').innerHTML = iconPauseBtn;

  localStorage.setItem(`lastAyatSurah${id}`,i);
}

function resetAllIcons(){
  document.querySelectorAll('.play')
    .forEach(b=>b.innerHTML=iconPlayBtn);
}


/* =====================================
   HIGHLIGHT
===================================== */

function highlight(i){
  ayatEls.forEach(e=>e.classList.remove('active'));
  ayatEls[i]?.classList.add('active');
  ayatEls[i]?.scrollIntoView({behavior:'smooth',block:'center'});
}


/* =====================================
   INFO TEXT (2 BARIS)
===================================== */

function updateInfo(){
  const total = ayatEls.length;
  const name  = titleLatin.textContent.split('. ')[1];

  let surahEl = qpInfo.querySelector('.qp-surah');
  let ayatEl  = qpInfo.querySelector('.qp-ayat');

  if(!surahEl){
    qpInfo.innerHTML = `
      <div class="qp-surah"></div>
      <div class="qp-ayat"></div>
    `;
    surahEl = qpInfo.querySelector('.qp-surah');
    ayatEl  = qpInfo.querySelector('.qp-ayat');
  }

  surahEl.textContent = name;
  ayatEl.textContent  = `Ayat ${currentIndex+1} / ${total}`;
}


/* =====================================
   AUDIO EVENTS
===================================== */

audio.onplay = ()=>{
  iconPlay.style.display='none';
  iconPause.style.display='block';
};

audio.onpause = ()=>{
  iconPlay.style.display='block';
  iconPause.style.display='none';
  resetAllIcons();
};

audio.ontimeupdate = ()=>{
  if(!audio.duration) return;
  qpBar.style.width =
    (audio.currentTime/audio.duration*100)+'%';
};

audio.onended = ()=>{
  if(repeatOne){
    audio.currentTime=0;
    audio.play();
    return;
  }

  if(currentIndex < ayatEls.length-1){
    playAyat(currentIndex+1);
  }
  else if(AUTO_NEXT_SURAH && nextSurah){
    go(1);
  }
};


/* =====================================
   QPLAYER CONTROLS (FIXED)
===================================== */

qpPlay.onclick = ()=>{
  if(currentIndex === -1){
    playAyat(0);
    return;
  }
  audio.paused ? audio.play() : audio.pause();
};

qpPrev.onclick = ()=>{
  if(currentIndex === -1){
    playAyat(0);
    return;
  }
  if(currentIndex>0){
    playAyat(currentIndex-1);
  }
};

qpNext.onclick = ()=>{
  if(currentIndex === -1){
    playAyat(0);
    return;
  }
  if(currentIndex<ayatEls.length-1){
    playAyat(currentIndex+1);
  }
};

qpClose.onclick = ()=>{
  audio.pause();
  qpWrap.classList.remove('show');
};

qpRepeat.onclick = ()=>{
  repeatOne=!repeatOne;
  qpRepeat.style.opacity = repeatOne?1:.4;
};

qpVol.oninput = e=>{
  audio.volume = e.target.value;
  qpVol.style.setProperty('--val', e.target.value*100);
};

qpWave.onclick = e=>{
  const r = qpWave.getBoundingClientRect();
  const p = (e.clientX-r.left)/r.width;
  audio.currentTime = p*audio.duration;
};


/* =====================================
   NAVIGATION SURAT
===================================== */

function go(dir){

  if(dir===-1 && prevSurah)
    goTo(allSurat[prevSurah-1].namaLatin, prevSurah);

  if(dir===1 && nextSurah)
    goTo(allSurat[nextSurah-1].namaLatin, nextSurah);
}

function setNav(btns){

  if(!btns || !btns.length) return;

  if(prevSurah){
    btns[0].onclick = ()=>go(-1);
    btns[0].innerHTML = `
      <svg viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           stroke-width="2"
           stroke-linecap="round"
           stroke-linejoin="round"
           width="16">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      ${allSurat[prevSurah-1].namaLatin}
    `;
  }

  if(nextSurah){
    btns[1].onclick = ()=>go(1);
    btns[1].innerHTML = `
      ${allSurat[nextSurah-1].namaLatin}
      <svg viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           stroke-width="2"
           stroke-linecap="round"
           stroke-linejoin="round"
           width="16">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    `;
  }
}

/* =====================================
   LOAD DATA (API V2)
===================================== */

async function load(){

  const listJson = await (await fetch('https://equran.id/api/v2/surat')).json();
  allSurat = listJson.data;

  prevSurah = id>1 ? id-1 : null;
  nextSurah = id<114 ? id+1 : null;

  setNav(navBtns);
  setNav(navBtnsB);
  


  const detailJson = await (await fetch(`https://equran.id/api/v2/surat/${id}`)).json();
  const s = detailJson.data;

  titleLatin.textContent = `${s.nomor}. ${s.namaLatin}`;
  titleArab.textContent  = s.nama;
  titleArti.textContent  = `(${s.arti})`;
  info.innerHTML       = `${s.jumlahAyat} Ayat • ${s.tempatTurun}`;

  bismillah.innerHTML =
    (id!==1 && id!==9)
      ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
      : '';

  content.innerHTML='';
  ayatEls=[];

  s.ayat.forEach((a,i)=>{

    const el=document.createElement('div');
    el.className='ayat';

    el.innerHTML=`
      <button class="play">${iconPlayBtn}</button>
      <div class="arab">
        <span class="ayah-text">${a.teksArab}</span>
        <span class="ayah-num">${toArabic(a.nomorAyat)}</span>
      </div>
      <div class="latin">${a.teksLatin}</div>
      <div class="arti">${a.teksIndonesia}</div>
    `;

    const btn = el.querySelector('.play');

    btn.onclick=()=>{
      if(currentIndex===i && !audio.paused){
        audio.pause();
      }else{
        playAyat(i);
      }
    };

    content.appendChild(el);
    ayatEls.push(el);
  });

  const last = localStorage.getItem(`lastAyatSurah${id}`);
  if(last!==null) highlight(+last);

  initDropdown();
}


/* =====================================
   DROPDOWN
===================================== */

function initDropdown(){

  const select = document.getElementById('suratSelect');

  allSurat.forEach(s=>{
    const opt=document.createElement('option');
    opt.value=s.nomor;
    opt.textContent=`${s.nomor}. ${s.namaLatin}`;
    if(s.nomor===id) opt.selected=true;
    select.appendChild(opt);
  });

  select.onchange=e=>{
    const n=+e.target.value;
    goTo(allSurat[n-1].namaLatin,n);
  };
}


/* =====================================
   UTIL
===================================== */

function toArabic(n){
  return n.toString().replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
}

load();