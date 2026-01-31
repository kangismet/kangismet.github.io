year.textContent = new Date().getFullYear();
/* ===============================
   CodeZone by Kang Ismet
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
   RUN RESULT
================================ */
function run(){
  result.srcdoc = `<!DOCTYPE html>
<html>
<head>
<style>
html,body{margin:0}
${cssEditor.getValue()}
</style>
</head>
<body>
${htmlEditor.getValue()}
<script>${jsEditor.getValue()}<\/script>
</body>
</html>`;
}

[htmlEditor,cssEditor,jsEditor].forEach(ed=>{
  ed.on('change',run);
});

/* ===============================
   LOAD DEMO FILE → EDITOR
================================ */
async function loadFileByID(id){
  const res = await fetch(`demo/${id}.html`);
  if(!res.ok){
    console.error('Demo file tidak ditemukan');
    return;
  }

  const text = await res.text();

  const css  = (text.match(/<style[^>]*>([\s\S]*?)<\/style>/i)||[])[1] || '';
  const html = (text.match(/<body[^>]*>([\s\S]*?)<\/body>/i)||[])[1] || '';
  const js   = (text.match(/<script[^>]*>([\s\S]*?)<\/script>/i)||[])[1] || '';

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
  const blob = new Blob([result.srcdoc], { type:'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'result.html';
  a.click();
};