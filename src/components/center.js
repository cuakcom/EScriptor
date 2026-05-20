export function renderCenter() {
  return `
    <main class="main" id="pagesContainer">
      <section class="page cover-page">
        <div class="sheet cover-sheet">
          <input id="coverTitle" type="text" class="cover-input" placeholder="TÍTULO" />
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
        </div>
      </section>

      <section class="page" data-page="1" data-page-number="1.">
        <div id="editor" class="sheet editor" contenteditable="true" spellcheck="false" aria-label="Editor de guión"></div>
      </section>
    </main>
  `;
}
