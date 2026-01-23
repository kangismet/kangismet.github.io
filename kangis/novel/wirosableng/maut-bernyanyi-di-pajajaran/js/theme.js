const content = document.getElementById("content");
const progress = document.querySelector(".progress span");
const nav = document.getElementById("nav");
const overlay = document.getElementById("overlay");
const coverSection = document.getElementById("cover-section");

let currentBab = 0;
const totalBab = 21;

// =========================
// LOAD BAB / COVER
// =========================
async function loadBab(n){
  try {
    const res = await fetch(`bab/bab${n}.html`);
    if(!res.ok) throw new Error("Bab tidak ditemukan");
    content.innerHTML = await res.text();
    currentBab = n;
    localStorage.setItem("lastBab", n);
    updateNav();
    updateProgress();
    if(window.innerWidth <= 768) closeNav();
  } catch(err){
    console.error(err);
    alert("Gagal memuat Bab " + n);
  }
}

function showCover(){
  content.innerHTML = coverSection.outerHTML;
  currentBab = 0;
  updateNav();
  updateProgress();
  if(window.innerWidth <= 768) closeNav();
}

// =========================
// UPDATE NAV & PROGRESS
// =========================
function updateNav(){
  document.querySelectorAll("nav a").forEach(a => a.classList.remove("active"));
  if(currentBab === 0) document.getElementById("link-cover").classList.add("active");
  else document.getElementById(`link-${currentBab}`).classList.add("active");
}

function updateProgress(){
  progress.style.width = currentBab === 0 ? "0%" : (currentBab / totalBab * 100) + "%";
}

// =========================
// DRAWER MOBILE
// =========================
function toggleNav(){
  nav.classList.toggle("open");
  overlay.classList.toggle("show");
}

function closeNav(){
  nav.classList.remove("open");
  overlay.classList.remove("show");
}

// auto close drawer saat klik link
document.querySelectorAll("nav a").forEach(a=>{
  a.addEventListener("click", ()=>{
    if(window.innerWidth <= 768) closeNav();
  });
});

// =========================
// DARK MODE
// =========================
function toggleDark(){
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
}

if(localStorage.getItem("dark") === "true") document.body.classList.add("dark");

// =========================
// SWIPE HORIZONTAL
// =========================
let startX = 0;
let startY = 0;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;

  // swipe horizontal minimal 50px dan lebih dominan dari vertikal
  if(Math.abs(dx) < 50) return;
  if(Math.abs(dx) < Math.abs(dy)) return;

  if(dx < 0 && currentBab < totalBab) loadBab(currentBab + 1);
  if(dx > 0 && currentBab > 1) loadBab(currentBab - 1);
});

// =========================
// HINT SEKALI
// =========================
const hintEl = document.getElementById("hint");
if(localStorage.getItem("hint")) hintEl.remove();
else{
  setTimeout(()=>hintEl.remove(), 4000);
  localStorage.setItem("hint", 1);
}

// =========================
// COVER CLICKABLE
// =========================
coverSection.addEventListener("click", e => {
  // pastikan klik bukan tombol internal
  if(e.target.tagName !== "BUTTON") loadBab(1);
});

// =========================
// AUTO LOAD LAST BAB
// =========================
const last = localStorage.getItem("lastBab");
if(last) loadBab(+last);
else showCover();
