/* ===== CONFIG ===== */
const GAS_URL = "https://script.google.com/macros/s/AKfycbzaIr7INm16-R0FdfhwYmXrYrOWFZiq3IxiEiik0oDI6KByQfTN3NucYMTl7vZrsxHn/exec";
const UPLOAD_TOKEN = "KANGISMET123";
const ADMIN_PASSWORD = "mangahung";

/* ===== ELEMENTS ===== */
const uploaderBox = document.getElementById("uploaderBox");
const lockBox = document.getElementById("lockBox");
const passInput = document.getElementById("passInput");
const unlockBtn = document.getElementById("unlockBtn");
const lockMsg = document.getElementById("lockMsg");

const fileInput = document.getElementById("file");
const uploadBtn = document.getElementById("uploadBtn");
const spinner = document.getElementById("spinner");
const previewImg = document.getElementById("previewImg");
const previewText = document.getElementById("previewText");

const codeBox = document.getElementById("codeBox");
const codeArea = document.getElementById("code");
const copyBtn = document.getElementById("copyBtn");

/* ===== PASSWORD ===== */
function unlock(){
  if(passInput.value === ADMIN_PASSWORD){
    sessionStorage.setItem("unlocked","1");
    uploaderBox.classList.remove("locked");
    lockBox.remove();
  }else{
    lockMsg.textContent="Password salah";
  }
}
unlockBtn.onclick=unlock;
passInput.addEventListener("keydown",e=>{
  if(e.key==="Enter"){e.preventDefault();unlock();}
});

if(sessionStorage.getItem("unlocked")==="1"){
  uploaderBox.classList.remove("locked");
  lockBox.remove();
}

/* ===== UPLOAD ===== */
uploadBtn.onclick=()=>{
  const file=fileInput.files[0];
  if(!file){alert("Pilih gambar");return}

  spinner.hidden=false;
  previewText.hidden=true;
  previewImg.hidden=true;
  codeBox.hidden=true;

  const reader=new FileReader();
  reader.onload=async()=>{
    const img=new Image();
    img.onload=async()=>{
      const w=img.width,h=img.height;
      const base64=reader.result.split(",")[1];

      const res=await fetch(GAS_URL,{
        method:"POST",
        body:JSON.stringify({
          token:UPLOAD_TOKEN,
          filename:file.name,
          mimeType:file.type,
          data:base64
        })
      });

      const text=await res.text();
      spinner.hidden=true;

      if(!text.startsWith("http")){
        alert(text);return;
      }

      previewImg.src=text+"=w800";
      previewImg.hidden=false;

      const alt=document.getElementById("alt").value||"";
      const mode=document.getElementById("mode").value;

      let code="";
      if(mode==="img"){
        code=`<img src="${text}=w800" width="${w}" height="${h}" loading="lazy" alt="${alt}">`;
      }
      if(mode==="figure"){
        code=`<figure>
  <img src="${text}=w800" width="${w}" height="${h}" loading="lazy" alt="${alt}">
  <figcaption>${alt}</figcaption>
</figure>`;
      }
      if(mode==="picture"){
        code=`<picture>
  <source srcset="${text}=w800" type="image/webp">
  <img src="${text}=w800" width="${w}" height="${h}" loading="lazy" alt="${alt}">
</picture>`;
      }

      codeArea.value=code;
      codeBox.hidden=false;
    };
    img.src=reader.result;
  };
  reader.readAsDataURL(file);
};

/* ===== COPY ===== */
copyBtn.onclick=()=>{
  navigator.clipboard.writeText(codeArea.value);
  copyBtn.classList.add("copied");
  setTimeout(()=>copyBtn.classList.remove("copied"),2000);
};

/* ===== FOOTER ===== */
document.getElementById("year").textContent=new Date().getFullYear();