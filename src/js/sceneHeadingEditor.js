export function handleSceneHeadingInput(event, block) {
  if (!event.data) return;

  const char = event.data[event.data.length - 1];
  let replacement = null;
  let length = 0;

  if (char === 'I' || char === 'i') {
    replacement = 'INT.';
    length = 4;
  } else if (char === 'E' || char === 'e') {
    replacement = 'EXT.';
    length = 4;
  } else if (char === 'D' || char === 'd') {
    replacement = 'DÍA';
    length = 3;
  } else if (char === 'N' || char === 'n') {
    replacement = 'NOCHE';
    length = 5;
  }

  if (!replacement) return;

  setTimeout(() => {
    const text = block.textContent.trimEnd();
    const lastChar = text[text.length - 1];

    if ((char === 'I' && (lastChar === 'I' || lastChar === 'i')) ||
        (char === 'E' && (lastChar === 'E' || lastChar === 'e')) ||
        (char === 'D' && (lastChar === 'D' || lastChar === 'd')) ||
        (char === 'N' && (lastChar === 'N' || lastChar === 'n'))) {

      const before = text.slice(0, -1);
      const newText = before + replacement;
      block.textContent = newText;

      setCaretPosition(block, newText.length);
    }
  }, 0);
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
