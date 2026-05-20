export function renderCenter() {
  let pages = `
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
          <div class="page-number">2.</div>
          <div id="editor" class="editor" contenteditable="true" spellcheck="false" role="textbox" aria-label="Editor de guión"></div>
        </article>
      </section>
    `;

  for (let i = 3; i <= 10; i++) {
    pages += `
      <section class="page">
        <article class="sheet">
          <div class="page-number">${i}.</div>
          <div class="page-content"></div>
        </article>
      </section>
    `;
  }

  return `<main class="main" id="pagesContainer">${pages}</main>`;
}
