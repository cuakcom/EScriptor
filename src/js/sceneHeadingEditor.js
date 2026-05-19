export function handleSceneHeadingInput(event, block) {
  const text = block.textContent;
  const lastChar = text[text.length - 1];

  if (lastChar === 'I') {
    const before = text.slice(0, -1);
    block.textContent = before + 'INT.';
    setCaretPosition(block, before.length + 4);
  } else if (lastChar === 'E') {
    const before = text.slice(0, -1);
    block.textContent = before + 'EXT.';
    setCaretPosition(block, before.length + 4);
  } else if (lastChar === 'D') {
    const before = text.slice(0, -1);
    block.textContent = before + 'DÍA';
    setCaretPosition(block, before.length + 3);
  } else if (lastChar === 'N') {
    const before = text.slice(0, -1);
    block.textContent = before + 'NOCHE';
    setCaretPosition(block, before.length + 5);
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
