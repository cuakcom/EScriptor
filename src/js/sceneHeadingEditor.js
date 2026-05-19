export function handleSceneHeadingInput(event, block) {
  const inputChar = event.data;
  if (!inputChar) return;

  let replacement = null;

  if (inputChar === 'I') {
    replacement = 'INT.';
  } else if (inputChar === 'E') {
    replacement = 'EXT.';
  } else if (inputChar === 'D') {
    replacement = 'DÍA';
  } else if (inputChar === 'N') {
    replacement = 'NOCHE';
  }

  if (replacement) {
    const text = block.textContent;
    if (text.endsWith(inputChar)) {
      const before = text.slice(0, -1);
      const newText = before + replacement;

      block.textContent = newText;

      const sel = window.getSelection();
      const range = document.createRange();
      if (block.firstChild) {
        range.setStart(block.firstChild, newText.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
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
