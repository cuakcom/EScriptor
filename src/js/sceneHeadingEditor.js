export function handleSceneHeadingInput(event, block) {
  if (!event.data || event.data.length === 0) return;

  const char = event.data[event.data.length - 1].toUpperCase();
  let replacement = null;

  if (char === 'I') {
    replacement = 'INT.';
  } else if (char === 'E') {
    replacement = 'EXT.';
  } else if (char === 'D') {
    replacement = 'DÍA';
  } else if (char === 'N') {
    replacement = 'NOCHE';
  }

  if (!replacement) return;

  setTimeout(() => {
    const text = block.textContent;
    if (!text) return;

    const lastChar = text[text.length - 1].toUpperCase();
    if (lastChar === char) {
      const before = text.slice(0, -1);
      const newText = before + replacement;
      block.textContent = newText;
      setCaretPosition(block, newText.length);
    }
  }, 10);
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
