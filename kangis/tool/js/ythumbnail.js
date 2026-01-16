year.textContent=new Date().getFullYear();

function extractVideoId(url){
  url = url.trim();
  const vMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if(vMatch) return vMatch[1];
  const sMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if(sMatch) return sMatch[1];
  if(url.length===11) return url;
  return '';
}

function generate(){
  const vid = extractVideoId(ytInput.value);
  if(!vid) return alert('Video ID tidak valid');

  const res = resSelect.value;
  const altText = altInput.value.trim() || 'YouTube Thumbnail';
  const url = `https://img.youtube.com/vi/${vid}/${res}.jpg`;

  const img = new Image();
  img.src = url;
  img.onload = ()=>{
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    const embed = `<img src="${url}" width="${w}" height="${h}" loading="lazy" decoding="async" style="max-width:100%;height:auto" alt="${altText}">`;

    viewer.innerHTML = `<img src="${url}" width="${w}" height="${h}" style="max-width:100%;height:auto" alt="${altText}">`;
    embedCode.value = embed;
  };
}

function copyCode(){
  navigator.clipboard.writeText(embedCode.value).then(()=>{
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),2000);
  });
}