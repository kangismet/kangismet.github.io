const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html'), {
    mode: 'htmlmixed',
    theme: 'material-darker',
    lineNumbers: true,
    lineWrapping: false
  });

  const cssEditor = CodeMirror.fromTextArea(document.getElementById('css'), {
    mode: 'css',
    theme: 'material-darker',
    lineNumbers: true,
    lineWrapping: false
  });

  const jsEditor = CodeMirror.fromTextArea(document.getElementById('js'), {
    mode: 'javascript',
    theme: 'material-darker',
    lineNumbers: true,
    lineWrapping: false
  });

  const result = document.getElementById('result');

  function run() {
    result.srcdoc = `<!DOCTYPE html><html><head><style>
html,body{margin:0;max-width:100%;overflow:auto;}
${cssEditor.getValue()}
</style></head><body>
${htmlEditor.getValue()}
<script>${jsEditor.getValue()}<\/script>
</body></html>`;
  }

  [htmlEditor, cssEditor, jsEditor].forEach(ed => ed.on('change', run));
  run();

  // ===== SAVE BUTTON =====
  document.getElementById('saveBtn').addEventListener('click', () => {
    const content = `<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>
${cssEditor.getValue()}
</style></head><body>
${htmlEditor.getValue()}
<script>${jsEditor.getValue()}<\/script>
</body></html>`;
    const blob = new Blob([content], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'result.html';
    a.click();
    URL.revokeObjectURL(a.href);
  });