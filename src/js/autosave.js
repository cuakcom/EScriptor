export class AutoSaveManager {
  constructor(interval = 600000) {
    this.interval = interval; // 10 minutos = 600000ms
    this.timeout = null;
    this.autosaves = [];
    this.maxAutosaves = 5;
  }

  start() {
    this.timeout = setInterval(() => {
      this.performAutosave();
    }, this.interval);
  }

  stop() {
    if (this.timeout) {
      clearInterval(this.timeout);
      this.timeout = null;
    }
  }

  async performAutosave() {
    const title = document.getElementById("coverTitle")?.value || "Autosave";
    const author = document.getElementById("coverAuthor")?.value || "";

    // Obtener contenido de todas las páginas
    const pagesContainer = document.getElementById("pagesContainer");
    const allEditors = pagesContainer ? pagesContainer.querySelectorAll('.editor') : [];
    const content = Array.from(allEditors).map(ed => ed.innerHTML).join('');
    const editorText = Array.from(allEditors).map(ed => ed.innerText).join('\n\n');

    const filename = `autosave_${new Date().getTime()}`;
    const data = {
      title,
      author,
      content,
      editorText,
      timestamp: new Date().toISOString(),
      isAutosave: true
    };

    const statusElem = document.getElementById("saveStatus");
    if (statusElem) {
      statusElem.textContent = "Guardando...";
      statusElem.style.color = "#0066cc";
    }

    try {
      const response = await fetch("src/php/autosave.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, data })
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Autoguardado:", result.message);

        if (statusElem) {
          statusElem.textContent = "Guardado";
          statusElem.style.color = "#1f8f3a";
          // Actualizar "Último guardado"
          const lastSavedElem = document.getElementById("lastSavedInfo");
          if (lastSavedElem) {
            const date = new Date().toLocaleString('es-ES');
            lastSavedElem.textContent = `Último guardado: ${date}`;
          }
          setTimeout(() => {
            statusElem.textContent = "";
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Error en autoguardado:", error);
      if (statusElem) {
        statusElem.textContent = "Error al guardar";
        statusElem.style.color = "#dc3545";
        setTimeout(() => {
          statusElem.textContent = "";
        }, 3000);
      }
    }
  }
}
