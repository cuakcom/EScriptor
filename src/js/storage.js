export function getScriptContent() {
  const editor = document.getElementById("editor");
  return editor ? editor.innerHTML : "";
}

export function setScriptContent(content) {
  const editor = document.getElementById("editor");
  if (editor) editor.innerHTML = content;
}

export function getScriptMetadata() {
  const title = document.getElementById("coverTitle")?.value || "";
  const author = document.getElementById("coverAuthor")?.value || "";
  return { title, author, timestamp: new Date().toISOString() };
}

export async function saveScriptLocally(filename) {
  const content = getScriptContent();
  const metadata = getScriptMetadata();
  const editorText = document.getElementById("editor")?.innerText || "";

  try {
    const response = await fetch("src/php/save.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, content, metadata, editorText })
    });

    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error("Error al guardar:", error);
    return false;
  }
}

export async function loadScriptServer(filename) {
  try {
    const response = await fetch(`src/php/load.php?action=get&filename=${encodeURIComponent(filename)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error al cargar:", error);
    return null;
  }
}

export async function getServerScripts() {
  try {
    const response = await fetch("src/php/load.php?action=list");
    const data = await response.json();
    return data.scripts || [];
  } catch (error) {
    console.error("Error al listar:", error);
    return [];
  }
}

export async function deleteScriptServer(filename) {
  try {
    const response = await fetch(`src/php/load.php?action=delete&filename=${encodeURIComponent(filename)}`);
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error("Error al eliminar:", error);
    return false;
  }
}

export async function exportToServer(format, filename) {
  const content = getScriptContent();
  const metadata = getScriptMetadata();
  const editorText = document.getElementById("editor")?.innerText || "";

  try {
    const response = await fetch("src/php/export.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format, filename, content, metadata, editorText })
    });

    if (!response.ok) {
      throw new Error(`Error en servidor: ${response.status}`);
    }

    const blob = await response.blob();
    downloadBlob(blob, filename);
    return true;
  } catch (error) {
    console.error("Error al exportar:", error);
    return false;
  }
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

export function exportToText() {
  const text = document.getElementById("editor")?.innerText || "";
  const metadata = getScriptMetadata();
  const header = `TÍTULO: ${metadata.title}\nAUTOR: ${metadata.author}\n${"=".repeat(50)}\n\n`;
  const blob = new Blob([header + text], { type: "text/plain" });
  downloadBlob(blob, `${metadata.title || "guion"}.txt`);
}
