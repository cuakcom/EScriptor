export function updateSceneNumbers() {
  const editor = document.getElementById("editor");
  const sceneHeadings = editor.querySelectorAll(".script-block[data-style='scene-heading']");

  sceneHeadings.forEach((block, index) => {
    block.dataset.sceneNumber = index + 1;
  });
}

export function getSceneNumber(block) {
  const editor = document.getElementById("editor");
  const sceneHeadings = editor.querySelectorAll(".script-block[data-style='scene-heading']");
  let sceneNumber = 0;

  for (let i = 0; i < sceneHeadings.length; i++) {
    if (sceneHeadings[i] === block) {
      sceneNumber = i + 1;
      break;
    }
  }

  return sceneNumber;
}

export function parseSceneHeading(text) {
  const lines = text.split('\n');
  const firstLine = lines[0] || '';

  const match = firstLine.match(/^(INT|EXT|INT\.\/EXT)[\s\.]*[-–]?\s*(.+?)(?:\s*[-–]\s*(DÍA|NOCHE|DAY|NIGHT))?$/i);

  if (match) {
    return {
      type: match[1].toUpperCase().replace('.', ''),
      location: match[2].trim(),
      time: match[3] ? match[3].toUpperCase() : 'DÍA'
    };
  }

  return {
    type: 'INT',
    location: firstLine,
    time: 'DÍA'
  };
}

export function formatSceneHeading(type, location, time) {
  return `${type}. - ${location} - ${time}`;
}
