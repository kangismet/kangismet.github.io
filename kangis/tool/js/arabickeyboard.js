/* =====================================================
   ARABIC KEYBOARD + UNDO / REDO
   ===================================================== */

/* ===============================
   UNDO / REDO ENGINE
================================ */
(function () {
  const textarea = document.getElementById("arblock");
  if (!textarea) return;

  let history = [];
  let index = -1;
  const MAX_HISTORY = 100;

  function saveState(value) {
    if (history[index] === value) return;

    history = history.slice(0, index + 1);
    history.push(value);

    if (history.length > MAX_HISTORY) {
      history.shift();
    } else {
      index++;
    }
  }

  function undo() {
    if (index > 0) {
      index--;
      textarea.value = history[index];
      textarea.focus();
    }
  }

  function redo() {
    if (index < history.length - 1) {
      index++;
      textarea.value = history[index];
      textarea.focus();
    }
  }

  textarea.addEventListener("input", function () {
    saveState(this.value);
  });

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      undo();
    }
    if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
      e.preventDefault();
      redo();
    }
  });

  window.undoText = undo;
  window.redoText = redo;

  saveState(textarea.value);
})();

/* ===============================
   UNDO BRIDGE
================================ */
function saveUndoState() {
  var ta = document.getElementById("arblock");
  if (!ta) return;
  ta.dispatchEvent(new Event("input"));
}

/* ===============================
   INSERT CHARACTER
================================ */
function change(item) {
  var input = document.conversion.arkeyboard;
  if (!input) return;

  if (document.selection) {
    input.focus();
    var range = document.selection.createRange();
    range.text = item;
    range.select();
  } else if (input.selectionStart || input.selectionStart === 0) {
    var startPos = input.selectionStart;
    var endPos = input.selectionEnd;
    var scrollTop = input.scrollTop;

    input.value =
      input.value.substring(0, startPos) +
      item +
      input.value.substring(endPos);

    var cursorPos = startPos + item.length;
    input.selectionStart = cursorPos;
    input.selectionEnd = cursorPos;
    input.scrollTop = scrollTop;
    input.focus();
  } else {
    input.value += item;
    input.focus();
  }

  saveUndoState();
}

/* ===============================
   REMOVE ZERO WIDTH CHAR
================================ */
function cncl() {
  var input = document.conversion.arkeyboard;
  if (!input) return;

  input.value = input.value.replace(/\u200b/g, "");
}

/* ===============================
   TRANSLITERATION
================================ */
function arconvert() {
  var input = document.conversion.arkeyboard;
  if (!input) return;

  var ark = input.value;

  ark = ark.replace(/==a/g,"ً").replace(/==i/g,"ٍ").replace(/==u/g,"ٌ")
           .replace(/=a/g,"َ").replace(/=i/g,"ِ").replace(/=u/g,"ُ")
           .replace(/=w/g,"ّ").replace(/=o/g,"ْ");

  ark = ark.replace(/’/g,"'")
           .replace(/[aâàāiu]/g,"ا").replace(/اا/g,"آ")
           .replace(/b/g,"ب").replace(/p/g,"پ")
           .replace(/t/g,"ت").replace(/ṯ/g,"ث")
           .replace(/[jǧ]/g,"ج").replace(/c/g,"چ")
           .replace(/h/g,"ح").replace(/[xẖK]/g,"خ")
           .replace(/d/g,"د").replace(/ḏ/g,"ذ")
           .replace(/r/g,"ر").replace(/z/g,"ز")
           .replace(/s/g,"س").replace(/š/g,"ش")
           .replace(/[Sṣ]/g,"ص").replace(/[Dḍ]/g,"ض")
           .replace(/[Tṭ]/g,"ط").replace(/[Zẓ]/g,"ظ")
           .replace(/ا'/g,"ع").replace(/[gʿ]/g,"غ")
           .replace(/f/g,"ف").replace(/v/g,"ڢ")
           .replace(/q/g,"ق").replace(/k/g,"ك")
           .replace(/l/g,"ل").replace(/m/g,"م").replace(/n/g,"ن")
           .replace(/[Hḥ]/g,"ه").replace(/ه'/g,"ة")
           .replace(/[woôûōū]/g,"و")
           .replace(/[yeîī]/g,"ي")
           .replace(/ي-/g,"ى")
           .replace(/-/g,"ء").replace(/ʾ/g,"ء")
           .replace(/ءا/g,"أ")
           .replace(/_/g,"ـ")
           .replace(/\?/g,"؟").replace(/;/g,"؛").replace(/,/g,"،")
           .replace(/[0-9]/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);

  var start = input.selectionStart;
  var end = input.selectionEnd;
  var diff = ark.length - input.value.length;

  input.value = ark;
  input.selectionStart = start + diff;
  input.selectionEnd = end + diff;
  input.focus();
  input.scrollTop = input.scrollHeight;

  saveUndoState();
}

/* ===============================
   BACKSPACE & CLEAR
================================ */
function backspace() {
  var ta = document.getElementById("arblock");
  if (!ta || !ta.value) return;

  ta.value = ta.value.slice(0, -1);
  saveUndoState();
}

function clearText() {
  var ta = document.getElementById("arblock");
  if (!ta || !ta.value) return;

  ta.value = "";
  ta.focus();
  saveUndoState();
}

/* ===============================
   DARK MODE
================================ */
function darkMode() {
  var mode = localStorage.getItem("mode") === "darkmode" ? "light" : "darkmode";
  localStorage.setItem("mode", mode);

  document
    .querySelector("#mainContent")
    .classList.toggle("dark-mode", mode === "darkmode");
}

(function () {
  var isDark = localStorage.getItem("mode") === "darkmode";
  document
    .querySelector("#mainContent")
    .classList.toggle("dark-mode", isDark);
})();
