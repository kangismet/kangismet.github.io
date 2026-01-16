year.textContent=new Date().getFullYear();

function extractFileId(v){
  if(v.includes('drive.google.com')){
    const m=v.match(/[-\w]{25,}/);
    return m?m[0]:'';
  }
  return v.trim();
}

function generate(){
  const id=extractFileId(driveInput.value);
  if(!id) return alert('File ID tidak valid');

  const altText = altInput.value.trim() || 'Google Drive Image';
  const mode=document.querySelector('input[name="mode"]:checked').value;
  const url=`https://lh4.googleusercontent.com/d/${id}=w1200`;

  const img=new Image();
  img.src=url;
  img.onload=()=>{
    const w=img.naturalWidth,h=img.naturalHeight;
    let embed='';

    if(mode==='img'){
      embed=`<img src="${url}" width="${w}" height="${h}" loading="lazy" decoding="async" style="max-width:100%;height:auto" alt="${altText}">`;
    }

    if(mode==='figure'){
      embed=`<figure>
  <img src="${url}" width="${w}" height="${h}" loading="lazy" decoding="async" alt="${altText}">
  <figcaption>${altText}</figcaption>
</figure>`;
    }

    if(mode==='picture'){
      embed=`<picture>
  <source srcset="${url}=w400" media="(max-width:600px)">
  <source srcset="${url}=w800" media="(max-width:1200px)">
  <img src="${url}" width="${w}" height="${h}" loading="lazy" decoding="async" style="max-width:100%;height:auto" alt="${altText}">
</picture>`;
    }

    viewer.innerHTML=embed;
    embedCode.value=embed;
  };
}

function copyCode(){
  navigator.clipboard.writeText(embedCode.value).then(()=>{
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),2000);
  });
}