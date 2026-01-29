year.textContent = new Date().getFullYear();

/* ===== UTIL ===== */
const escapeHTML = s =>
  s.replace(/&/g,"&amp;")
   .replace(/</g,"&lt;")
   .replace(/>/g,"&gt;");

/* ===== LANGUAGE DETECT ===== */
function detectLanguage(code){
  const t = code.trim();
  if (/^<!DOCTYPE|<html|<head|<body/i.test(t)) return 'html';
  if (/^\s*<\/?[a-z][\s\S]*>/i.test(t)) return 'html';
  if (/^<\?php/.test(t)) return 'php';
  if (/function\s|\b(const|let|var)\b|=>|console\.log/.test(t)) return 'javascript';
  if (/{[\s\S]*?}/.test(t) && /;/.test(t)) return 'css';
  if (/\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b/i.test(t)) return 'sql';
  if (/\bdef\b|\bimport\b|\bprint\(/.test(t)) return 'python';
  return 'plaintext';
}

/* ===== CORE ===== */
function parseCode(){
  const input = inputCode.value.trim();
  if(!input) return;

  const mode = document.querySelector('input[name="mode"]:checked').value;
  const enablePrism = enablePrismCheckbox.checked;

  let lang = detectLanguage(input);
  if(langSelect.value !== 'auto') lang = langSelect.value;

  const isBlock =
    mode === 'block' ||
    (mode === 'auto' && (input.includes('\n') || input.length > 80));

  const cls = enablePrism ? ` class="language-${lang}"` : '';
  const output = isBlock
    ? `<pre><code${cls}>${escapeHTML(input)}</code></pre>`
    : `<code${cls}>${escapeHTML(input)}</code>`;

  embedCode.value = output;
  renderPreview(output, enablePrism);
}

/* ===== PREVIEW ===== */
function renderPreview(html, highlight){
  if(!livePreviewToggle.checked){
    preview.innerHTML = '';
    previewPlaceholder.style.display = 'flex';
    return;
  }
  preview.innerHTML = html;
  previewPlaceholder.style.display = 'none';

  if(highlight && window.Prism){
    Prism.highlightAllUnder(preview);
  }
}

/* ===== THEME SWITCH ===== */
document.querySelectorAll('input[name="theme"]').forEach(r=>{
  r.addEventListener('change',()=>{
    const dark = r.value === 'dark' && r.checked;
    previewBox.classList.toggle('dark', dark);
    prismTheme.href = dark
      ? 'https://cdn.jsdelivr.net/npm/prismjs/themes/prism-tomorrow.min.css'
      : 'https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css';
  });
});

/* ===== LIVE ===== */
inputCode.addEventListener('input', ()=>{
  if(livePreviewToggle.checked) parseCode();
});

/* ===== COPY ===== */
function copyCode(){
  const b = copyBtn;
  const t = b.textContent;
  navigator.clipboard.writeText(embedCode.value).then(()=>{
    b.textContent = 'Tersalin!';
    b.disabled = true;
    setTimeout(()=>{
      b.textContent = t;
      b.disabled = false;
    },2000);
  });
}

/* ===== RESET ===== */
function resetTool(){
  inputCode.value = '';
  embedCode.value = '';
  preview.innerHTML = '';
  previewPlaceholder.style.display = 'flex';
  inputCode.focus();
}