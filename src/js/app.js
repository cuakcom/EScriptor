import { renderNavbar } from "../components/navbar.js";
import { renderCenter } from "../components/center.js";
import { renderFooter } from "../components/footer.js";
import { renderSidebar } from "../components/sidebar.js";
import { ScriptManager, detectSceneTitle, detectCharacterName } from "./scriptManager.js";
import { saveScriptLocally, loadScriptLocally, exportToText } from "./storage.js";

const app = document.getElementById("app");
app.className = "app";
app.innerHTML = `${renderSidebar()}${renderNavbar()}${renderCenter()}${renderFooter()}`;

const STYLES = [
  { key: "act", label: "Acto", css: "style-act", placeholder: "ACTO I" },
  { key: "scene-heading", label: "Título de escena", css: "style-scene-heading", placeholder: "INT. / EXT. - LUGAR - DÍA/NOCHE" },
  { key: "action", label: "Acción", css: "style-action", placeholder: "Describe la acción..." },
  { key: "character", label: "Personaje", css: "style-character", placeholder: "NOMBRE PERSONAJE" },
  { key: "dialogue", label: "Diálogo", css: "style-dialogue", placeholder: "(Escribe el diálogo...)" },
  { key: "parenthetical", label: "Acotaciones", css: "style-parenthetical", placeholder: "(acotación)" },
  { key: "transition", label: "Transición", css: "style-transition", placeholder: "CORTE A:" },
  { key: "shot", label: "Toma", css: "style-shot", placeholder: "PLANO GENERAL:" },
  { key: "text", label: "Texto", css: "style-text", placeholder: "Escribe texto..." }
];

const ENTER_MAP = {
  "scene-heading":"action",
  "character":"dialogue",
  "dialogue":"character",
  "parenthetical":"dialogue",
  "action":"action",
  "transition":"action",
  "shot":"action",
  "act":"scene-heading",
  "text":"text"
};

const styleByKey = Object.fromEntries(STYLES.map(s => [s.key, s]));
const scriptManager = new ScriptManager();
const pagesContainer = document.getElementById("pagesContainer");
const editor = document.getElementById("editor");
const styleSelector = document.getElementById("styleSelector");
const lineAlert = document.getElementById("lineAlert");
const statPages = document.getElementById("statPages");
const statWords = document.getElementById("statWords");
const statTime = document.getElementById("statTime");

STYLES.forEach(s => {
  const o = document.createElement("option");
  o.value = s.key;
  o.textContent = s.label;
  styleSelector.append(o);
});

function getCurrentBlock() {
  const s = window.getSelection();
  if (!s.rangeCount) return null;
  let n = s.anchorNode;
  if (!n) return null;
  if (n.nodeType === Node.TEXT_NODE) n = n.parentNode;
  return n.closest(".script-block") || null;
}

function placeCaretAtEnd(el) {
  const r = document.createRange();
  r.selectNodeContents(el);
  r.collapse(false);
  const s = window.getSelection();
  s.removeAllRanges();
  s.addRange(r);
}

function updatePlaceholderState(b) {
  const t = b.textContent.trim();
  b.classList.toggle("is-empty", t.length === 0);
}

function applyBlockStyle(b, k) {
  b.dataset.style = k;
  b.className = "script-block " + styleByKey[k].css;
  b.dataset.placeholder = styleByKey[k].placeholder;
  if (k === "character") b.dataset.lastFromCharacter = "true";
  updatePlaceholderState(b);
}

function createBlock(k) {
  const b = document.createElement("div");
  b.className = "script-block";
  applyBlockStyle(b, k);
  b.innerHTML = "";
  updatePlaceholderState(b);
  return b;
}

function getStyleCycle(current) {
  if (current === "scene-heading") return "action";
  if (current === "act") return "scene-heading";
  if (current === "character") return "action";
  if (current === "action" && getCurrentBlock()?.dataset.lastFromCharacter === "true") {
    getCurrentBlock().dataset.lastFromCharacter = "false";
    return "parenthetical";
  }
  const i = STYLES.findIndex(s => s.key === current);
  return STYLES[(i + 1) % STYLES.length].key;
}

function sanitizeBlockLines(b) {
  const lines = b.textContent.split(/\n/);
  if (lines.length > 5) {
    b.textContent = lines.slice(0, 5).join("\n");
    placeCaretAtEnd(b);
  }
}

function getLineCount(b) {
  return Math.max(1, b.innerText.split(/\n/).length);
}

function updateAlert() {
  const b = getCurrentBlock();
  if (!b) {
    lineAlert.textContent = "Sin alertas";
    lineAlert.style.color = "var(--ok)";
    return;
  }
  const c = getLineCount(b);
  if (c >= 5) {
    lineAlert.textContent = "Límite máximo: 5 líneas";
    lineAlert.style.color = "var(--danger)";
  } else if (c >= 4) {
    lineAlert.textContent = "Advertencia: 4 líneas en el párrafo";
    lineAlert.style.color = "var(--warning)";
  } else {
    lineAlert.textContent = "Sin alertas";
    lineAlert.style.color = "var(--ok)";
  }
}

function calculatePages() {
  const text = editor.innerText;
  const lines = text.split('\n').length;
  const pageContent = Math.ceil(lines / 55);
  return Math.max(2, pageContent);
}

function updateStats() {
  const text = editor.innerText.replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  const pages = calculatePages();
  statPages.textContent = `Páginas totales: ${pages}`;
  statWords.textContent = `Palabras: ${words}`;
  statTime.textContent = `Tiempo estimado de producción: ${pages} min`;
  updatePageNumbers(pages);
}

function updatePageNumbers(totalPages) {
  const pages = pagesContainer.querySelectorAll(".page");
  for (let i = 0; i < pages.length; i++) {
    const sheet = pages[i].querySelector(".sheet");
    const pageNum = sheet?.querySelector(".page-number");
    if (pageNum && i > 0) {
      pageNum.textContent = `Pág. ${i + 1}`;
    }
  }

  while (pages.length < totalPages) {
    const newPage = document.createElement("section");
    newPage.className = "page";
    newPage.innerHTML = `
      <article class="sheet">
        <div class="page-number">Pág. ${pages.length + 1}</div>
        <div class="editor-content"></div>
      </article>
    `;
    pagesContainer.append(newPage);
  }
}

function detectAndRegisterBlock(block) {
  const style = block.dataset.style;
  const text = block.textContent.trim();

  if (style === "scene-heading") {
    const sceneTitle = detectSceneTitle(text);
    if (sceneTitle) scriptManager.addScene(sceneTitle);
  } else if (style === "character") {
    const charName = detectCharacterName(text);
    if (charName) scriptManager.addCharacter(charName);
  }
}

styleSelector.addEventListener("change", () => {
  const b = getCurrentBlock();
  if (!b) return;
  applyBlockStyle(b, styleSelector.value);
  updateAlert();
});

editor.addEventListener("keydown", (e) => {
  const b = getCurrentBlock();
  if (!b) return;

  if (e.key === "Tab") {
    e.preventDefault();
    const n = getStyleCycle(b.dataset.style);
    if (b.dataset.style === "character") b.dataset.lastFromCharacter = "true";
    applyBlockStyle(b, n);
    styleSelector.value = n;
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    detectAndRegisterBlock(b);
    sanitizeBlockLines(b);
    const n = ENTER_MAP[b.dataset.style] || "text";
    const nb = createBlock(n);
    b.insertAdjacentElement("afterend", nb);
    styleSelector.value = n;
    placeCaretAtEnd(nb);
  }
});

editor.addEventListener("input", () => {
  const b = getCurrentBlock();
  if (b) sanitizeBlockLines(b);
  editor.querySelectorAll(".script-block").forEach(updatePlaceholderState);
  updateAlert();
  updateStats();
  const c = getCurrentBlock();
  if (c) styleSelector.value = c.dataset.style;
});

editor.addEventListener("click", () => {
  const b = getCurrentBlock();
  if (!b) return;
  styleSelector.value = b.dataset.style;
  updateAlert();
});

const firstBlock = createBlock("scene-heading");
editor.append(firstBlock);
styleSelector.value = "scene-heading";
placeCaretAtEnd(firstBlock);
updateAlert();
updateStats();

document.querySelector(".export-wrap button").addEventListener("click", (e) => {
  e.stopPropagation();
  const menu = document.querySelector(".export-menu");
  menu.style.display = menu.style.display === "none" ? "block" : "none";
});

document.querySelector(".export-menu").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const text = e.target.textContent;
    if (text.includes(".txt")) {
      exportToText();
      alert("Archivo exportado como texto");
    } else if (text.includes(".docx")) {
      alert("Exportación a Word aún no implementada");
    } else if (text.includes(".fdx")) {
      alert("Exportación a Final Draft aún no implementada");
    }
  }
});

document.querySelectorAll(".menu-left button").forEach(btn => {
  if (btn.textContent === "Guardar") {
    btn.addEventListener("click", async () => {
      const title = document.getElementById("coverTitle")?.value || "guion";
      const success = await saveScriptLocally(title);
      alert(success ? `Guion "${title}" guardado correctamente` : "Error al guardar");
    });
  } else if (btn.textContent === "Guardar como") {
    btn.addEventListener("click", async () => {
      const filename = prompt("Nombre del archivo:");
      if (filename) {
        const success = await saveScriptLocally(filename);
        alert(success ? `Guardado como "${filename}"` : "Error al guardar");
      }
    });
  }
});
