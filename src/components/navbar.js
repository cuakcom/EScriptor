export function renderNavbar() {
  return `
    <header class="navbar">
      <div class="menu-left">
        <label for="styleSelector">Estilo:</label>
        <select id="styleSelector" aria-label="Selector de estilo"></select>
        <button type="button">Guardar</button>
        <button type="button">Guardar como</button>
        <div class="export-wrap">
          <button type="button">Exportar ▾</button>
          <div class="export-menu">
            <button type="button">Texto (.txt)</button>
            <button type="button">Word (.docx)</button>
            <button type="button">Final Draft (.fdx)</button>
          </div>
        </div>
      </div>
      <div class="menu-right">
        <span>Avisos:</span>
        <span id="lineAlert" class="notice">Sin alertas</span>
      </div>
    </header>
  `;
}
