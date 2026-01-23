const content=document.getElementById("content");
const progress=document.querySelector(".progress span");
const nav=document.getElementById("nav");
const overlay=document.getElementById("overlay");
let currentBab=0;
const totalBab=17;

async function loadBab(n){
  const res=await fetch(`bab/bab${n}.html`);
  content.innerHTML=await res.text();
  currentBab=n;
  localStorage.setItem("lastBab",n);
  updateNav();
  updateProgress();
  if(window.innerWidth<=768) closeNav();
}

function showCover(){
  const cover=document.getElementById("cover-section");
  content.innerHTML=cover.outerHTML;
  currentBab=0;
  updateNav();
  updateProgress();
  if(window.innerWidth<=768) closeNav();
}

function updateNav(){
  document.querySelectorAll("nav a").forEach(a=>a.classList.remove("active"));
  if(currentBab===0) document.getElementById("link-cover").classList.add("active");
  else document.getElementById(`link-${currentBab}`).classList.add("active");
}

function updateProgress(){
  progress.style.width = currentBab===0 ? "0%" : (currentBab/totalBab*100)+"%";
}

function toggleNav(){
  nav.classList.toggle("open");
  overlay.classList.toggle("show");
}
function closeNav(){
  nav.classList.remove("open");
  overlay.classList.remove("show");
}

function toggleDark(){
  document.body.classList.toggle("dark");
  localStorage.setItem("dark",document.body.classList.contains("dark"));
}

if(localStorage.getItem("dark")==="true") document.body.classList.add("dark");

/* SWIPE */
let startX=0;
document.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
document.addEventListener("touchend",e=>{
  let dx=e.changedTouches[0].clientX-startX;
  if(Math.abs(dx)<50) return;
  if(dx<0&&currentBab<totalBab) loadBab(currentBab+1);
  if(dx>0&&currentBab>1) loadBab(currentBab-1);
});

/* HINT SEKALI */
if(localStorage.getItem("hint")) document.getElementById("hint").remove();
else{
  setTimeout(()=>document.getElementById("hint").remove(),4000);
  localStorage.setItem("hint",1);
}

/* AUTO LOAD LAST */
const last=localStorage.getItem("lastBab");
if(last) loadBab(+last);
else showCover();

/* Auto close drawer on link click */
document.querySelectorAll("nav a").forEach(a=>{
  a.addEventListener("click",()=>{if(window.innerWidth<=768) closeNav();});
});