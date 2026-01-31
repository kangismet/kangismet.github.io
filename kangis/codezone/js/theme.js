/* ===============================
   YEAR
================================ */
document.getElementById('year').textContent =
  new Date().getFullYear();


/* ===============================
   FILE ID (AUTO DEFAULT)
================================ */
const params = new URLSearchParams(location.search);
const FILE_ID = params.get('file') || 'demo-001';


/* ===============================
   CODEMIRROR
================================ */
const htmlEditor = CodeMirror.fromTextArea(html, {
  mode:'htmlmixed',
  theme:'material-darker',
  lineNumbers:true
});

const cssEditor = CodeMirror.fromTextArea(css, {
  mode:'css',
  theme:'material-darker',
  lineNumbers:true
});

const jsEditor = CodeMirror.fromTextArea(js, {
  mode:'javascript',
  theme:'material-darker',
  lineNumbers:true
});

const result = document.getElementById('result');


/* ===============================
   RUN RESULT
================================ */
function run(){
  const doc = result.contentDocument;

  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
<head>
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

[htmlEditor, cssEditor, jsEditor].forEach(e =>
  e.on('change', run)
);


/* ===============================
   LOAD DEMO (.txt)
================================ */
async function loadDemo(id){
  const res = await fetch(`demo/${id}.txt`);
  const text = await res.text();

  const css  = (text.match(/<style[^>]*>([\s\S]*?)<\/style>/i)||[])[1] || '';
  const js   = (text.match(/<script[^>]*>([\s\S]*?)<\/script>/i)||[])[1] || '';
  const html = (text.match(/<body[^>]*>([\s\S]*?)<\/body>/i)||[])[1] || text;

  htmlEditor.setValue(html.trim());
  cssEditor.setValue(css.trim());
  jsEditor.setValue(js.trim());

  run();
}

/* AUTO LOAD */
loadDemo(FILE_ID);


/* ===============================
   SAVE BUTTON
================================ */
saveBtn.onclick = () => {
  const doc = result.contentDocument;

  const blob = new Blob(
    ['<!DOCTYPE html>\n' + doc.documentElement.outerHTML],
    { type:'text/html' }
  );

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'result.html';
  a.click();
};
