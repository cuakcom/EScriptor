export function renderCenter() {
  return `
    <main class="main" id="pagesContainer">
      <section class="page">
        <article class="sheet">
          <div class="cover-fields">
            <label>
              Título<br />
              <input id="coverTitle" type="text" placeholder="Título del guión" />
            </label>
            <label>
              Autor<br />
              <input id="coverAuthor" type="text" placeholder="Nombre del autor" />
            </label>
          </div>
        </article>
      </section>

      <section class="page">
        <article class="sheet">
          <div class="page-number">Pág. 2</div>
          <div id="editor" class="editor" contenteditable="true" spellcheck="false" role="textbox" aria-label="Editor de guión"></div>
        </article>
      </section>
    </main>
  `;
}
