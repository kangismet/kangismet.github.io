year.textContent = new Date().getFullYear();

function escapeHTML(str){
  return str.replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;");
}

function toggleAdvanced(){
  const adv = document.getElementById('advancedOptions');
  adv.style.display = (adv.style.display==='flex')?'none':'flex';
}

function parseCode(){
  const input = inputCode.value.trim();
  if(!input) return alert('Masukkan kode terlebih dahulu');

  let mode='auto';
  let enablePrism=false;
  let lang='js';

  const adv = document.getElementById('advancedOptions');
  if(adv.style.display==='flex'){
    mode = document.querySelector('input[name="mode"]:checked').value;
    enablePrism = document.getElementById('enablePrism').checked;
    lang = document.getElementById('langSelect').value;
  }

  let embed='';
  if(enablePrism){
    if(mode==='inline'){
      embed=`<code class="language-${lang}">${escapeHTML(input)}</code>`;
    } else if(mode==='block'){
      embed=`<pre><code class="language-${lang}">${escapeHTML(input)}</code></pre>`;
    } else {
      if(input.includes('\n') || input.length>80){
        embed=`<pre><code class="language-${lang}">${escapeHTML(input)}</code></pre>`;
      } else {
        embed=`<code class="language-${lang}">${escapeHTML(input)}</code>`;
      }
    }
  } else {
    if(mode==='inline'){
      embed=`<code>${escapeHTML(input)}</code>`;
    } else if(mode==='block'){
      embed=`<pre><code>${escapeHTML(input)}</code></pre>`;
    } else {
      if(input.includes('\n') || input.length>50){
        embed=`<pre><code>${escapeHTML(input)}</code></pre>`;
      } else {
        embed=`<code>${escapeHTML(input)}</code>`;
      }
    }
  }

  embedCode.value=embed;
  if(enablePrism) Prism.highlightAll();
}

function copyCode(){
  const btn=document.getElementById('copyBtn');
  const originalText=btn.textContent;
  const originalBg=btn.style.background;

  navigator.clipboard.writeText(embedCode.value).then(()=>{
    btn.textContent='Tersalin!';
    btn.style.background='#10b981';
    btn.disabled=true;
    setTimeout(()=>{
      btn.textContent=originalText;
      btn.style.background=originalBg||'var(--primary)';
      btn.disabled=false;
    },2000);
  });
}

function resetTool(){
  inputCode.value='';
  embedCode.value='';
  inputCode.focus();
}