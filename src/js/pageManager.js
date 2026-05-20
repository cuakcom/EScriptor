export function managePages() {
  const editor = document.getElementById("editor");
  const pagesContainer = document.getElementById("pagesContainer");
  const sheets = pagesContainer.querySelectorAll(".sheet");

  if (sheets.length === 0) return;

  const firstSheet = sheets[0];
  const pageHeight = 23 * 37.8; // 23cm en píxeles aproximadamente

  let currentPageIndex = 1;
  let currentPageHeight = 0;

  const blocks = editor.querySelectorAll(".script-block");

  blocks.forEach((block, index) => {
    const blockHeight = block.offsetHeight;

    if (currentPageHeight + blockHeight > pageHeight && currentPageIndex === sheets.length - 1) {
      createNewPage(pagesContainer, currentPageIndex + 1);
    }

    if (currentPageHeight + blockHeight > pageHeight) {
      currentPageIndex++;
      currentPageHeight = 0;
    }

    currentPageHeight += blockHeight;
  });

  const requiredPages = Math.max(2, currentPageIndex + 1);
  while (pagesContainer.querySelectorAll(".page").length < requiredPages) {
    createNewPage(pagesContainer, pagesContainer.querySelectorAll(".page").length + 1);
  }
}

function createNewPage(pagesContainer, pageNumber) {
  const newPage = document.createElement("section");
  newPage.className = "page";
  newPage.innerHTML = `
    <article class="sheet">
      <div class="page-number">${pageNumber}.</div>
      <div class="editor-content"></div>
    </article>
  `;
  pagesContainer.append(newPage);
}

export function createPageSeparator() {
  const separator = document.createElement("div");
  separator.className = "page-separator";
  separator.style.height = "0.5cm";
  separator.style.borderBottom = "1px dashed #ccc";
  separator.style.margin = "0.5cm 0";
  return separator;
}
