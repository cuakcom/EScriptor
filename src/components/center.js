export function renderCenter() {
  return `
    <main class="main" id="pagesContainer">
      <section class="page">
        <article class="sheet">
          <div class="cover-fields">
            <label>
              Título<br />
              <input id="coverTitle" type="text" placeholder="Título" />
            </label>
            <label>
              Autor<br />
              <input id="coverAuthor" type="text" placeholder="Autor" />
            </label>
          </div>
        </article>
      </section>

      <section class="page">
        <article class="sheet">
          <div class="page-number">Pág. 2</div>
          <div id="editor" class="editor" contenteditable="true" spellcheck="false"></div>
        </article>
      </section>
    </main>
  `;
}
