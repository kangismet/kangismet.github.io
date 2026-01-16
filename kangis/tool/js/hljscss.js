year.textContent = new Date().getFullYear();

const input = document.getElementById('input');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');

function esc(str){
  return str.replace(/[&<>]/g,m=>(
    {'&':'&amp;','<':'&lt;','>':'&gt;'}[m]
  ));
}

function generate(){
  let code = esc(input.value);

  const strings=[], comments=[];

  code = code.replace(/\/\*[\s\S]*?\*\//g,m=>{
    comments.push(m);
    return `@@C${comments.length-1}@@`;
  });

  code = code.replace(/("(?:\\.|[^"\\])*")/g,m=>{
    strings.push(m);
    return `@@S${strings.length-1}@@`;
  });

  code = code.replace(/([.#][\w-]+)/g,
    '<span class="hljs-built_in">$1</span>'
  );

  code = code.replace(/\b(\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw)?)\b/g,
    '<span class="hljs-number">$1</span>'
  );

  code = code.replace(/(^|\{|;)\s*([\w-]+)\s*:/g,
    '$1 <span class="hljs-keyword">$2</span>:'
  );

  code = code.replace(/:\s*([a-z-]+)(?=;|\n)/gi,
    ': <span class="hljs-attribute">$1</span>'
  );

  code = code.replace(/@@S(\d+)@@/g,
    (_,i)=>`<span class="hljs-string">${strings[i]}</span>`
  );

  code = code.replace(/@@C(\d+)@@/g,
    (_,i)=>`<span class="hljs-comment">${comments[i]}</span>`
  );

  output.value =
`<pre class="hljs"><code>
${code}
</code></pre>`;

  copyBtn.disabled = false;
}

function copyCode(){
  output.select();
  document.execCommand('copy');
  copyBtn.textContent='Copied!';
  setTimeout(()=>copyBtn.textContent='Copy Result',1200);
}
function resetAll(){
  input.value = '';
  output.value = '';
  copyBtn.disabled = true;
  copyBtn.textContent = 'Copy Result';
  input.focus();
}