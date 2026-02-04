/* INIT */
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

let ayatEls=[], currentIndex=-1, prevSurah=null, nextSurah=null;
const AUTO_NEXT_SURAH = true;

/* MAPPING */
const namaArab = {
  2:'ٱلْبَقَرَة',
  55:'ٱلرَّحْمَٰن',
  67:'ٱلْمُلْك',
  112:'ٱلْإِخْلَاص'
};
const artiSurat = {
  2:'Sapi Betina',
  114:'Manusia'
};

/* TOP */
window.addEventListener('scroll',()=>{
  topBtn.style.display = scrollY > 500 ? 'block' : 'none';
});
function scrollToTop(){
  scrollTo({top:0,behavior:'smooth'});
}

/* AUDIO */
function playAyat(i){
  if(i<0 || i>=ayatEls.length) return;

  currentIndex=i;
  const file=`${String(id).padStart(3,'0')}${String(i+1).padStart(3,'0')}`;
  audio.src=`https://everyayah.com/data/Alafasy_128kbps/${file}.mp3`;
  wrap.classList.add('show');
  audio.play();
  highlight(i);
  localStorage.setItem(`lastAyatSurah${id}`,i);
}

audio.onended=()=>{
  if(currentIndex < ayatEls.length-1){
    playAyat(currentIndex+1);
  }else if(AUTO_NEXT_SURAH && nextSurah){
    location.href=`?id=${nextSurah}`;
  }
};

function closePlayer(){
  audio.pause();
  audio.src='';
  wrap.classList.remove('show');
}

/* AYAT STATE */
function setActiveAyat(i){
  if(i<0 || i>=ayatEls.length) return;
  currentIndex=i;
  highlight(i);
}

function highlight(i){
  ayatEls.forEach(e=>e.classList.remove('active'));
  ayatEls[i]?.classList.add('active');
  ayatEls[i]?.scrollIntoView({behavior:'smooth',block:'center'});
}

/* NAV */
function go(n){
  if(n===-1 && prevSurah) location.href=`?id=${prevSurah}`;
  if(n===1 && nextSurah) location.href=`?id=${nextSurah}`;
}

function setNav(btns,all){
  const prevSVG=`<svg width="16" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
  const nextSVG=`<svg width="16" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
  if(prevSurah) btns[0].innerHTML=prevSVG+all[prevSurah-1].nama_latin;
  if(nextSurah) btns[1].innerHTML=all[nextSurah-1].nama_latin+nextSVG;
}

/* LOAD */
async function load(){
  const all = await (await fetch('https://equran.id/api/surat')).json();

  prevSurah = id>1 ? id-1 : null;
  nextSurah = id<114 ? id+1 : null;

  setNav(navBtns,all);
  setNav(navBtnsB,all);

  const s = await (await fetch(`https://equran.id/api/surat/${id}`)).json();

  titleLatin.textContent = `${s.nomor}. ${s.nama_latin}`;
  titleArab.textContent  = namaArab[s.nomor] || s.nama;
  titleArti.textContent  = `(${artiSurat[s.nomor] || s.arti})`;
  info.textContent       = `${s.jumlah_ayat} Ayat • ${s.tempat_turun}`;

  bismillah.textContent =
    (id!==1 && id!==9)
      ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
      : '';

  content.innerHTML='';
  ayatEls=[];

  s.ayat.forEach((a,i)=>{
    const el=document.createElement('div');
    el.className='ayat';
    el.innerHTML=`
      <button class="play">▶</button>
      <div class="arab">${a.ar} ۝${toArabic(a.nomor)}</div>
      <div class="arti">${a.idn}</div>
    `;
    el.querySelector('.play').onclick=()=>playAyat(i);
    content.appendChild(el);
    ayatEls.push(el);
  });

  const last = localStorage.getItem(`lastAyatSurah${id}`);
  if(last!==null) setActiveAyat(+last);
}

function toArabic(n){
  return n.toString().replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
}

load();
