let toolbar = null;
let currentBlock = null;

export function initSceneHeadingToolbar() {
  toolbar = document.createElement("div");
  toolbar.className = "scene-heading-toolbar";
  toolbar.id = "sceneHeadingToolbar";
  toolbar.innerHTML = `
    <button type="button" class="sh-btn" data-value="INT.">INT.</button>
    <button type="button" class="sh-btn" data-value="EXT.">EXT.</button>
    <button type="button" class="sh-btn" data-value="INT./EXT.">INT./EXT.</button>
    <span style="width:1px;background:#ccc;margin:2px 3px;"></span>
    <button type="button" class="sh-btn" data-value=" - DÍA"> - DÍA</button>
    <button type="button" class="sh-btn" data-value=" - NOCHE"> - NOCHE</button>
  `;
  document.body.appendChild(toolbar);

  toolbar.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const btn = e.target.closest(".sh-btn");
    if (!btn) return;
    const val = btn.dataset.value;
    if (!currentBlock) return;
    insertSceneValue(currentBlock, val);
  });

  document.addEventListener("selectionchange", updateToolbarState);
}

function insertSceneValue(block, value) {
  const prefixes = ["INT.", "EXT.", "INT./EXT."];
  const suffixes = [" - DÍA", " - NOCHE"];
  let text = block.textContent;

  if (prefixes.includes(value)) {
    let cleaned = text;
    for (const p of prefixes) {
      if (cleaned.startsWith(p)) { cleaned = cleaned.slice(p.length).trimStart(); break; }
    }
    block.textContent = value + (cleaned ? " " + cleaned : "");
  } else if (suffixes.includes(value)) {
    for (const s of suffixes) {
      if (text.endsWith(s)) { text = text.slice(0, -s.length); break; }
    }
    block.textContent = text + value;
  }

  placeCaretAtEnd(block);
  updateToolbarButtonStates(block);
}

function placeCaretAtEnd(el) {
  const r = document.createRange();
  r.selectNodeContents(el);
  r.collapse(false);
  const s = window.getSelection();
  s.removeAllRanges();
  s.addRange(r);
}

export function showSceneHeadingToolbar(block) {
  if (!toolbar) return;
  const rect = block.getBoundingClientRect();
  toolbar.style.top = (rect.top + window.scrollY - toolbar.offsetHeight - 4) + "px";
  toolbar.style.left = rect.left + "px";

  requestAnimationFrame(() => {
    const rect2 = block.getBoundingClientRect();
    toolbar.style.top = (rect2.top + window.scrollY - 36) + "px";
    toolbar.style.left = rect2.left + "px";
  });

  toolbar.classList.add("visible");
  updateToolbarButtonStates(block);
}

export function hideSceneHeadingToolbar() {
  if (toolbar) toolbar.classList.remove("visible");
}

function updateToolbarButtonStates(block) {
  if (!toolbar) return;
  const text = block.textContent;
  toolbar.querySelectorAll(".sh-btn").forEach(btn => {
    const val = btn.dataset.value;
    const isPrefixBtn = ["INT.", "EXT.", "INT./EXT."].includes(val);
    const isSuffixBtn = [" - DÍA", " - NOCHE"].includes(val);
    if (isPrefixBtn) {
      btn.classList.toggle("active", text.startsWith(val));
    } else if (isSuffixBtn) {
      btn.classList.toggle("active", text.endsWith(val));
    }
  });
}

function updateToolbarState() {
  const sel = window.getSelection();
  if (!sel.rangeCount) {
    hideSceneHeadingToolbar();
    currentBlock = null;
    return;
  }
  const node = sel.anchorNode;
  const block = node?.nodeType === Node.TEXT_NODE
    ? node.parentNode?.closest(".script-block")
    : node?.closest?.(".script-block");
  if (block && block.dataset.style === "scene-heading") {
    currentBlock = block;
    showSceneHeadingToolbar(block);
  } else {
    hideSceneHeadingToolbar();
    currentBlock = null;
  }
}
