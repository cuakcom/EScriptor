export class AutoSaveManager {
  constructor(interval = 300000) {
    this.interval = interval;
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
    const content = document.getElementById("editor")?.innerHTML || "";
    const editorText = document.getElementById("editor")?.innerText || "";

    const filename = `autosave_${new Date().getTime()}`;
    const data = {
      title,
      author,
      content,
      editorText,
      timestamp: new Date().toISOString(),
      isAutosave: true
    };

    const status = document.getElementById("autosaveStatus");
    if (status) {
      status.textContent = "Guardando...";
      status.style.color = "#0066cc";
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

        if (status) {
          status.textContent = "✓ Guardado";
          status.style.color = "#1f8f3a";
          setTimeout(() => {
            status.textContent = "";
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Error en autoguardado:", error);
      if (status) {
        status.textContent = "✗ Error al guardar";
        status.style.color = "#dc3545";
        setTimeout(() => {
          status.textContent = "";
        }, 3000);
      }
    }
  }
}
