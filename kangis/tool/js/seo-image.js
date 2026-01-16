document.getElementById("year").textContent=new Date().getFullYear();

let imgW="", imgH="";

function showToast(msg,type="info"){
  const t=document.getElementById("toast");
  t.textContent=msg;
  t.className="toast show "+type;
  setTimeout(()=>t.classList.remove("show"),2500);
}

function isImage(url){
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
}

function updatePreview(){
  const url=imgUrl.value.trim();
  if(!url||!isImage(url)){
    preview.innerHTML="Preview";
    imgW=imgH="";
    return;
  }
  const img=new Image();
  img.onload=function(){
    imgW=this.naturalWidth;
    imgH=this.naturalHeight;
    preview.innerHTML=`<img src="${url}" alt="">`;
    generate();
  };
  img.src=url;
}

function generate(){
  const url=imgUrl.value.trim();
  if(!url){
    showToast("Masukkan URL gambar","error");
    return;
  }
  const altText=alt.value||"";
  const size=imgW&&imgH?` width="${imgW}" height="${imgH}"`:"";
  let html="";
  if(mode.value==="figure"){
    html=`<figure>
  <img src="${url}" alt="${altText}" loading="lazy" decoding="async"${size}>
  <figcaption>Caption gambar</figcaption>
</figure>`;
  }else if(mode.value==="picture"){
    html=`<picture>
  <source srcset="${url.replace(/\.(jpg|jpeg|png)/i,'.webp')}" type="image/webp">
  <img src="${url}" alt="${altText}" loading="lazy" decoding="async"${size}>
</picture>`;
  }else{
    html=`<img src="${url}" alt="${altText}" loading="lazy" decoding="async"${size}>`;
  }
  codeBox.style.display="block";
  code.value=html;
}

function copyCode(){
  code.select();
  document.execCommand("copy");
  showToast("Embed code berhasil disalin","success");
}