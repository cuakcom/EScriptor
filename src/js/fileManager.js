export function saveToLocalFile(format = 'json') {
  const title = document.getElementById("coverTitle")?.value || "guion";
  const author = document.getElementById("coverAuthor")?.value || "";
  const content = document.getElementById("editor")?.innerHTML || "";
  const editorText = document.getElementById("editor")?.innerText || "";
  const timestamp = new Date().toISOString();

  let blob, filename, mimeType;

  if (format === 'json') {
    const data = {
      title,
      author,
      timestamp,
      content,
      editorText
    };
    blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    filename = `${title}.json`;
  } else if (format === 'txt') {
    const text = `TÍTULO: ${title}\nAUTOR: ${author}\n${"=".repeat(50)}\n\n${editorText}`;
    blob = new Blob([text], { type: "text/plain" });
    filename = `${title}.txt`;
  } else if (format === 'html') {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: Courier, monospace; margin: 2cm; }
    .metadata { margin-bottom: 2rem; border-bottom: 1px solid #333; padding-bottom: 1rem; }
    .content { white-space: pre-wrap; word-wrap: break-word; }
  </style>
</head>
<body>
  <div class="metadata">
    <h1>${title}</h1>
    <p>Autor: ${author}</p>
    <p>Fecha: ${new Date(timestamp).toLocaleString('es-ES')}</p>
  </div>
  <div class="content">${escapeHtml(editorText)}</div>
</body>
</html>`;
    blob = new Blob([html], { type: "text/html" });
    filename = `${title}.html`;
  }

  downloadBlob(blob, filename);
}

export function loadFromLocalFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;

        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          resolve({
            title: data.title,
            author: data.author,
            content: data.content,
            editorText: data.editorText,
            timestamp: data.timestamp
          });
        } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          resolve({
            title: file.name.replace('.txt', ''),
            author: '',
            content: `<div class="script-block" data-style="text">${escapeHtml(content)}</div>`,
            editorText: content,
            timestamp: new Date().toISOString()
          });
        } else {
          reject(new Error('Formato de archivo no soportado'));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function getRecentFiles() {
  const files = [];
  const keys = Object.keys(localStorage);

  for (const key of keys) {
    if (key.startsWith('screenplay_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        files.push({
          name: key.replace('screenplay_', ''),
          timestamp: data.timestamp,
          title: data.title,
          data: data
        });
      } catch (e) {
        console.error('Error parsing stored file:', e);
      }
    }
  }

  return files.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function saveToLocalStorage(filename, data) {
  localStorage.setItem(`screenplay_${filename}`, JSON.stringify(data));
}

export function loadFromLocalStorage(filename) {
  const data = localStorage.getItem(`screenplay_${filename}`);
  return data ? JSON.parse(data) : null;
}

export function deleteFromLocalStorage(filename) {
  localStorage.removeItem(`screenplay_${filename}`);
}
