/* ======================================
   HTML Cleaner & Formatter by Kang Ismet
======================================= */
const year = document.getElementById("year");
const input = document.getElementById("input");
const output = document.getElementById("output");
const toast = document.getElementById("toast");

if (year) year.textContent = new Date().getFullYear();

const STORE = [];

/* =====================
   LOCK / UNLOCK
===================== */
function lock(html, regex, key) {
  return html.replace(regex, m => {
    const token = `@@${key}_${STORE.length}@@`;
    STORE.push(m);
    return token;
  });
}

function unlock(html) {
  return html.replace(/@@[A-Z]+_(\d+)@@/g, (_, i) => STORE[i] || "");
}

/* =====================
   ESCAPE UNSAFE HTML
===================== */
function escapeUnsafeHTML(text) {
  text = text.replace(
    /&(?![a-zA-Z]+;|#\d+;|#x[a-fA-F0-9]+;)/g,
    "&amp;"
  );

  return text.replace(
    /<(\/?)(html|head|body|script|style)[^>]*>/gi,
    m => m.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  );
}

/* =====================
   MARKDOWN → HTML
===================== */
function markdownToHTML(text) {

  /* LINK */
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)(\{[^}]+\})?/g,
    (_, label, url, flagsRaw) => {
      let target = "";
      let rel = [];

      if (flagsRaw) {
        const flags = flagsRaw.replace(/[{}]/g, "").split(/\s+/);
        if (flags.includes("_blank")) {
          target = ' target="_blank"';
          rel.push("noopener");
        }
        if (flags.includes("nofollow")) rel.push("nofollow");
        if (flags.includes("ugc")) rel.push("ugc");
        if (flags.includes("sponsored")) rel.push("sponsored");
      }

      const relAttr = rel.length
        ? ` rel="${[...new Set(rel)].join(" ")}"`
        : "";

      return `<a href="${url}"${target}${relAttr}>${label}</a>`;
    }
  );

  /* HEADINGS */
  text = text.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  text = text.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  text = text.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  text = text.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  text = text.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  text = text.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  /* HR */
  text = text.replace(/^---$/gm, "<hr>");

  /* INLINE */
  text = text.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  text = text.replace(/\*(.+?)\*/g, "<i>$1</i>");
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

  return text;
}

/* =====================
   CLEAN ENGINE
===================== */
function cleanHTMLEngine(text) {
  STORE.length = 0;

  text = markdownToHTML(text);
  text = escapeUnsafeHTML(text);

  /* LOCK WHITELIST */
  text = lock(text, /<pre[\s\S]*?<\/pre>/gi, "PRE");
  text = lock(text, /<code[\s\S]*?<\/code>/gi, "CODE");
  text = lock(text, /<h[1-6][\s\S]*?<\/h[1-6]>/gi, "HEAD");
  text = lock(text, /<p>[\s\S]*?<\/p>/gi, "PARA");
  text = lock(text, /<a [\s\S]*?<\/a>/gi, "LINK");
  text = lock(text, /<img [^>]*>/gi, "IMG");
  text = lock(text, /<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>/gi, "LIST");
  text = lock(text, /<hr\s*\/?>/gi, "HR");
  text = lock(text, /<(div|span)[\s\S]*?>[\s\S]*?<\/\1>/gi, "BLOCK");

  /* CLEAN */
  text = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const blocks = text.split(/\n{2,}/);
  let out = [];

  blocks.forEach(block => {

    /* PURE BLOCK — JANGAN PERNAH DIP */
    if (
      /^@@(PRE|HEAD|PARA|LIST|HR|BLOCK)_\d+@@$/.test(block) ||
      /^@@IMG_\d+@@$/.test(block) ||
      /^@@LINK_\d+@@$/.test(block)
    ) {
      out.push(block);
      return;
    }

    const lines = block
      .split(/\n+/)
      .map(l => l.trim())
      .filter(Boolean);

    /* UL */
    if (lines.length > 1 && lines.every(l => /^[-*•]\s+/.test(l))) {
      out.push(
        `<ul>\n${lines
          .map(l => `  <li>${l.replace(/^[-*•]\s+/, "")}</li>`)
          .join("\n")}\n</ul>`
      );
    }

    /* OL */
    else if (lines.length > 1 && lines.every(l => /^\d+[\.\)]\s+/.test(l))) {
      out.push(
        `<ol>\n${lines
          .map(l => `  <li>${l.replace(/^\d+[\.\)]\s+/, "")}</li>`)
          .join("\n")}\n</ol>`
      );
    }

    /* PARAGRAPH (TEXT ONLY) */
    else {
      lines.forEach(line => {
        // skip token block
        if (/^@@[A-Z]+_\d+@@$/.test(line)) {
          out.push(line);
        } else {
          out.push(`<p>${line}</p>`);
        }
      });
    }
  });

  return unlock(out.join("\n\n"));
}

/* =====================
   ACTIONS
===================== */
function runCleaner() {
  if (!input || !output) return;
  output.value = cleanHTMLEngine(input.value);
}

function resetAll() {
  input.value = "";
  output.value = "";
  STORE.length = 0;
}

function copyResult() {
  if (!output.value) return;
  navigator.clipboard.writeText(output.value);
  if (toast) {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }
}
