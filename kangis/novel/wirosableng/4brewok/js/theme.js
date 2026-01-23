const content = document.getElementById("content");
const progress = document.querySelector(".progress span");
let currentBab = 0;
const totalBab = 17;

/* LOAD BAB */
async function loadBab(n){
  const res = await fetch(`bab/bab${n}.html`);
  content.innerHTML = await res.text();
  currentBab = n;
  localStorage.setItem("lastBab", n);
  updateNav();
  updateProgress();
}

/* COVER */
function showCover(){
  content.innerHTML = document.getElementById("cover").outerHTML;
  currentBab = 0;
  updateNav();
  updateProgress();
}

/* NAV STATE */
function updateNav(){
  document.querySelectorAll("nav a").forEach(a=>a.classList.remove("active"));
  if(currentBab===0){
    document.getElementById("link-cover").classList.add("active");
  }else{
    document.getElementById(`link-${currentBab}`).classList.add("active");
  }
}

/* PROGRESS */
function updateProgress(){
  if(currentBab===0){
    progress.style.width="0%";
  }else{
    progress.style.width=(currentBab/totalBab*100)+"%";
  }
}

/* BURGER */
function toggleNav(){
  nav.classList.toggle("open");
}

/* DARK MODE */
function toggleDark(){
  document.body.classList.toggle("dark");
  localStorage.setItem("dark",document.body.classList.contains("dark"));
}
if(localStorage.getItem("dark")==="true"){
  document.body.classList.add("dark");
}

/* SWIPE */
let startX=0;
document.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
document.addEventListener("touchend",e=>{
  let dx=e.changedTouches[0].clientX-startX;
  if(Math.abs(dx)<50) return;
  if(dx<0 && currentBab<totalBab) loadBab(currentBab+1);
  if(dx>0 && currentBab>1) loadBab(currentBab-1);
});

/* HINT SEKALI */
if(localStorage.getItem("hint")){
  hint.remove();
}else{
  setTimeout(()=>hint.remove(),3000);
  localStorage.setItem("hint",1);
}

/* AUTO LOAD LAST */
const last=localStorage.getItem("lastBab");
if(last){
  loadBab(+last);
}else{
  showCover();
}