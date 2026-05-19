export function handleSceneHeadingInput(event, block) {
  const text = block.innerText;
  const lastChar = text[text.length - 1];

  let replacement = null;
  let posOffset = 0;

  if (lastChar === 'I') {
    replacement = 'INT.';
    posOffset = 4;
  } else if (lastChar === 'E') {
    replacement = 'EXT.';
    posOffset = 4;
  } else if (lastChar === 'D') {
    replacement = 'DÍA';
    posOffset = 3;
  } else if (lastChar === 'N') {
    replacement = 'NOCHE';
    posOffset = 5;
  }

  if (replacement) {
    const before = text.slice(0, -1);
    const newText = before + replacement;
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);

    block.innerText = newText;
    setCaretPosition(block, before.length + posOffset);
  }
}

export function handleSceneHeadingTab(event, block) {
  event.preventDefault();

  const text = block.textContent;
  const hasGuion = text.includes('-') || text.includes('–');

  if (!hasGuion) {
    const insertPos = text.length;
    block.textContent = text + ' - ';
    setCaretPosition(block, insertPos + 3);
  } else {
    return 'next-style';
  }
}

function setCaretPosition(el, pos) {
  const range = document.createRange();
  const sel = window.getSelection();

  range.setStart(el.firstChild || el, Math.min(pos, el.textContent.length));
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

export function getCurrentSceneHeadingInfo(text) {
  const parts = text.split('-');
  if (parts.length === 0) return { type: '', location: '', time: '' };

  const type = parts[0]?.trim() || '';
  const location = parts[1]?.trim() || '';
  const time = parts[2]?.trim() || '';

  return { type, location, time };
}
