/* ===============================
   YEAR
================================ */
document.getElementById('year').textContent =
  new Date().getFullYear();


/* ===============================
   CONFIG
================================ */
const FILE_ID =
  new URLSearchParams(location.search).get('file') || 'demo-001';


/* ===============================
   CODEMIRROR INIT
================================ */
const htmlEditor = CodeMirror.fromTextArea(
  document.getElementById('html'),
  { mode:'htmlmixed', theme:'material-darker', lineNumbers:true }
);

const cssEditor = CodeMirror.fromTextArea(
  document.getElementById('css'),
  { mode:'css', theme:'material-darker', lineNumbers:true }
);

const jsEditor = CodeMirror.fromTextArea(
  document.getElementById('js'),
  { mode:'javascript', theme:'material-darker', lineNumbers:true }
);

const result = document.getElementById('result');


/* ===============================
   RUN RESULT (SAFE IFRAME RENDER)
================================ */
function run(){
  const doc = result.contentDocument;

  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
html,body{margin:0}
${cssEditor.getValue()}
</style>
</head>
<body>
${htmlEditor.getValue()}
<script>
${jsEditor.getValue()}
<\/script>
</body>
</html>`);
  doc.close();
}

[htmlEditor, cssEditor, jsEditor].forEach(ed =>
  ed.on('change', run)
);


/* ===============================
   LOAD DEMO
   (gunakan .txt biar tidak kena inject)
================================ */
async function loadFileByID(id){
  try{
    const res = await fetch(`demo/${id}.txt`);
    if(!res.ok) return;

    const text = await res.text();

    const css = (text.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)||[])
      .map(s => s.replace(/<\/?style[^>]*>/gi,''))
      .join('\n');

    const js = (text.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)||[])
      .map(s => s.replace(/<\/?script[^>]*>/gi,''))
      .join('\n');

    const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

    let html = bodyMatch
      ? bodyMatch[1]
      : text
        .replace(/<style[\s\S]*?<\/style>/ig,'')
        .replace(/<script[\s\S]*?<\/script>/ig,'');

    htmlEditor.setValue(html.trim());
    cssEditor.setValue(css.trim());
    jsEditor.setValue(js.trim());

    run();

  }catch(e){
    console.error(e);
  }
}


/* AUTO LOAD */
loadFileByID(FILE_ID);


/* ===============================
   SAVE RESULT
================================ */
document.getElementById('saveBtn').onclick = () => {
  const doc = result.contentDocument;
  const html = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

  const blob = new Blob([html], { type:'text/html' });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'result.html';
  a.click();
};
