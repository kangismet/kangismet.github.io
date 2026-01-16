/* ===== CONFIG ===== */
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzaIr7INm16-R0FdfhwYmXrYrOWFZiq3IxiEiik0oDI6KByQfTN3NucYMTl7vZrsxHn/exec";
const TOKEN = "KANGISMET123";
const ADMIN_PASSWORD = "mangahung";

/* ===== ELEMENT ===== */
const box = document.getElementById("uploaderBox");
const passInput = document.getElementById("passInput");
const unlockBtn = document.getElementById("unlockBtn");
const lockMsg = document.getElementById("lockMsg");

const fileInput = document.getElementById("file");
const uploadBtn = document.getElementById("uploadBtn");
const previewBox = document.getElementById("previewBox");
const codeBox = document.getElementById("codeBox");
const codeArea = document.getElementById("code");
const copyBtn = document.getElementById("copyBtn");
const modeSelect = document.getElementById("mode");
const captionInput = document.getElementById("caption");

document.getElementById("year").textContent = new Date().getFullYear();

/* ===== PASSWORD UNLOCK ===== */
if(sessionStorage.getItem("adminUnlocked")==="1"){
  box.classList.remove("locked");
  document.getElementById("lockBox").remove();
}

function unlock(){
  if(passInput.value === ADMIN_PASSWORD){
    sessionStorage.setItem("unlocked","1");
    uploaderBox.classList.remove("locked");
    document.getElementById("lockBox").remove();
  }else{
    lockMsg.textContent = "Password salah";
  }
}

/* klik tombol */
unlockBtn.onclick = unlock;

/* tekan ENTER */
passInput.addEventListener("keydown", e=>{
  if(e.key === "Enter"){
    e.preventDefault();
    unlock();
  }
});

/* auto unlock jika sudah session */
if(sessionStorage.getItem("unlocked")==="1"){
  uploaderBox.classList.remove("locked");
  document.getElementById("lockBox")?.remove();
}

/* ===== UI ===== */
modeSelect.onchange = ()=> {
  captionInput.hidden = modeSelect.value !== "figure";
};

/* ===== UPLOAD ===== */
uploadBtn.onclick = ()=>{
  const file = fileInput.files[0];
  if(!file) return alert("Pilih gambar dulu");

  previewBox.innerHTML = "Uploading…";

  const reader = new FileReader();
  reader.onload = async ()=>{
    const base64 = reader.result.split(",")[1];

    const form = new FormData();
    form.append("file",base64);
    form.append("name",file.name);
    form.append("type",file.type);
    form.append("token",TOKEN);

    const res = await fetch(GAS_ENDPOINT,{method:"POST",body:form});
    const json = await res.json();
    if(json.status!=="ok") return alert(json.message);

    const cdn = "https://lh3.googleusercontent.com/d/" + json.fileId;

    const img = new Image();
    img.src = cdn + "=w800";
    img.onload = ()=>{
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      previewBox.innerHTML="";
      previewBox.appendChild(img);

      const alt = esc(document.getElementById("alt").value||"");
      const cap = esc(captionInput.value||"");

      let html="";
      if(modeSelect.value==="img"){
        html = `<img src="${cdn}=w800" width="${w}" height="${h}" loading="lazy" decoding="async" alt="${alt}">`;
      }
      if(modeSelect.value==="figure"){
        html = `<figure>
  <img src="${cdn}=w800" width="${w}" height="${h}" loading="lazy" decoding="async" alt="${alt}">
  <figcaption>${cap}</figcaption>
</figure>`;
      }
      if(modeSelect.value==="picture"){
        html = `<picture>
  <source srcset="${cdn}=w400 400w, ${cdn}=w800 800w, ${cdn}=w1200 1200w"
          sizes="(max-width:768px) 100vw, 800px">
  <img src="${cdn}=w800" width="${w}" height="${h}" loading="lazy" decoding="async" alt="${alt}">
</picture>`;
      }

      codeArea.value = html;
      codeBox.hidden = false;
    };
  };
  reader.readAsDataURL(file);
};

/* ===== COPY ===== */
copyBtn.onclick = ()=>{
  navigator.clipboard.writeText(codeArea.value);
  copyBtn.textContent="Tersalin!";
  copyBtn.classList.add("copied");
  setTimeout(()=>{
    copyBtn.textContent="Copy";
    copyBtn.classList.remove("copied");
  },2000);
};

function esc(s){
  return s.replace(/[&<>"']/g,m=>(
    {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]
  ));
}