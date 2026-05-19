export function renderCenter() {
  return `
    <main class="main" id="pagesContainer">
      <section class="page">
        <article class="sheet cover-page">
          <div class="cover-content">
            <div class="cover-title-section">
              <div class="cover-title" id="coverTitleDisplay"></div>
              <input id="coverTitle" type="text" class="cover-input-hidden" placeholder="Título del guión" />
            </div>

            <div class="cover-spacing"></div>

            <div class="cover-author-section">
              <div class="cover-author-label">Escrito por:</div>
              <input id="coverAuthor" type="text" class="cover-input" placeholder="Nombre del autor" />
            </div>

            <div class="cover-spacing"></div>

            <div class="cover-version-section">
              <div class="cover-version-label">Versión:</div>
              <input id="coverVersion" type="text" class="cover-input" placeholder="Ej: Borrador, Final..." />
            </div>

            <div class="cover-date-section">
              <div class="cover-date-label">Fecha:</div>
              <input id="coverDate" type="text" class="cover-input" placeholder="DD/MM/YYYY" />
            </div>
          </div>
        </article>
      </section>

      <section class="page">
        <article class="sheet">
          <div class="page-number">2.</div>
          <div id="editor" class="editor" contenteditable="true" spellcheck="false" role="textbox" aria-label="Editor de guión"></div>
        </article>
      </section>
    </main>
  `;
}
