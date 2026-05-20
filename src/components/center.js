export function renderCenter() {
  return `
    <main class="main" id="pagesContainer">
      <section class="page">
        <article class="sheet cover-sheet">
          <input id="coverTitle" type="text" class="cover-input-hidden" />
          <div class="cover-content">
            <div class="cover-title-section">
              <div class="cover-title" id="coverTitleDisplay">&nbsp;</div>
            </div>
            <div class="cover-field">
              <div class="cover-field-label">Escrito por:</div>
              <input id="coverAuthor" type="text" class="cover-input" placeholder="Nombre del autor" />
            </div>
            <div class="cover-field">
              <div class="cover-field-label">Versión:</div>
              <input id="coverVersion" type="text" class="cover-input" placeholder="Borrador, Final..." />
            </div>
            <div class="cover-field">
              <div class="cover-field-label">Fecha:</div>
              <input id="coverDate" type="text" class="cover-input" placeholder="DD/MM/YYYY" />
            </div>
          </div>
        </article>
      </section>

      <section class="page">
        <article class="sheet">
          <div id="editor" class="editor" contenteditable="true" spellcheck="false" aria-label="Editor de guión"></div>
        </article>
      </section>
    </main>
  `;
}
