year.textContent = new Date().getFullYear();

/* ===============================
   CodeZone by Kang Ismet (FIXED)
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
   RUN RESULT (SAFE RENDER)
================================ */
function run(){
  const doc = result.contentDocument || result.contentWindow.document;
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

[htmlEditor,cssEditor,jsEditor].forEach(ed=>{
  ed.on('change', run);
});

/* ===============================
   LOAD DEMO FILE → EDITOR (IMPROVED)
================================ */
async function loadFileByID(id){
  const res = await fetch(`demo/${id}.html`);
  if(!res.ok){
    console.error('Demo file tidak ditemukan:', id);
    return;
  }

  const text = await res.text();

  const css  = (text.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)||[])
    .map(s => s.replace(/<\/?style[^>]*>/gi,''))
    .join('\n');

  const html = (text.match(/<body[^>]*>([\s\S]*?)<\/body>/i)||[])[1] || '';

  const js   = (text.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)||[])
    .map(s => s.replace(/<\/?script[^>]*>/gi,''))
    .join('\n');

  htmlEditor.setValue(html.trim());
  cssEditor.setValue(css.trim());
  jsEditor.setValue(js.trim());

  run();
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
