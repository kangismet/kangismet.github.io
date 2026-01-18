const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyx_xjSpclArezbMxUraodym7QzzhwC83aZQoHrlcL4u7rNaoO8pzF9l-tqiS94Ejhl/exec";
const TOKEN = "UPLOAD-KANGIS-2026";

const fileInput = document.getElementById("file");
const altInput = document.getElementById("alt");
const modeSelect = document.getElementById("mode");
const previewBox = document.getElementById("previewBox");
const embedBox = document.getElementById("embedBox");
const embedCode = document.getElementById("embedCode");
const uploadBtn = document.getElementById("uploadBtn");
const toast = document.getElementById("toast");

let uploadedURL = "";
let imgWidth = 0;
let imgHeight = 0;

/* TOAST */
function showToast(text,type="success"){
  toast.textContent = text;
  toast.className = `toast show ${type}`;
  setTimeout(()=>toast.className="toast",2500);
}

/* UPLOAD */
uploadBtn.onclick = () => {
  const file = fileInput.files[0];
  if(!file){
    showToast("Pilih gambar terlebih dahulu","error");
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.textContent = "Uploading...";
  previewBox.textContent = "Tunggu sampai gambar selesai dimuat...";

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = async () => {
    const base64 = reader.result.split(",")[1];

    const form = new URLSearchParams();
    form.append("token", TOKEN);
    form.append("filename", file.name);
    form.append("mimeType", file.type || "image/jpeg");
    form.append("data", base64);

    try{
      const res = await fetch(SCRIPT_URL,{method:"POST",body:form});
      const json = await res.json();

      uploadBtn.disabled = false;
      uploadBtn.textContent = "Upload";

      if(json.status !== "success"){
        showToast(json.message,"error");
        return;
      }

      uploadedURL = json.url;

      /* LOAD IMAGE TO GET NATURAL SIZE */
      const img = new Image();
      img.src = uploadedURL;

      img.onload = () => {
        imgWidth = img.naturalWidth;
        imgHeight = img.naturalHeight;

        previewBox.innerHTML =
          `<img src="${uploadedURL}=w800"
                width="${imgWidth}"
                height="${imgHeight}"
                loading="lazy"
                decoding="async">`;

        generateEmbed();
        embedBox.style.display = "block";
        showToast("Upload berhasil","success");
      };

    }catch(e){
      uploadBtn.disabled = false;
      uploadBtn.textContent = "Upload";
      showToast("Upload gagal","error");
    }
  };
};

/* EMBED */
function generateEmbed(){
  if(!uploadedURL || !imgWidth || !imgHeight) return;

  const alt = altInput.value || "";
  const mode = modeSelect.value;
  let code = "";

  if(mode === "img"){
    code =
`<img src="${uploadedURL}=w800"
     width="${imgWidth}"
     height="${imgHeight}"
     alt="${alt}"
     loading="lazy"
     decoding="async">`;
  }

  if(mode === "figure"){
    code =
`<figure>
  <img src="${uploadedURL}=w800"
       width="${imgWidth}"
       height="${imgHeight}"
       alt="${alt}"
       loading="lazy"
       decoding="async">
  <figcaption>${alt}</figcaption>
</figure>`;
  }

  if(mode === "picture"){
    code =
`<picture>
  <source srcset="${uploadedURL}=w800" media="(min-width:600px)">
  <img src="${uploadedURL}"
       width="${imgWidth}"
       height="${imgHeight}"
       alt="${alt}"
       loading="lazy"
       decoding="async">
</picture>`;
  }

  embedCode.value = code;
}

modeSelect.onchange = generateEmbed;
altInput.oninput = generateEmbed;

/* COPY */
function copyEmbed(){
  embedCode.select();
  document.execCommand("copy");
  showToast("Kode berhasil disalin","success");
}
year.textContent=new Date().getFullYear();