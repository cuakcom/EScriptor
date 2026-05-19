export function renderNavbar() {
  return `
    <header class="navbar">
      <div class="menu-left">
        <label for="styleSelector">Estilo:</label>
        <select id="styleSelector" aria-label="Selector de estilo"></select>

        <div class="save-wrap">
          <button type="button" id="saveBtnMain">Guardar ▾</button>
          <div class="save-menu" id="saveMenu">
            <button type="button" id="saveLocalBtn">Guardar en ordenador</button>
            <button type="button" id="saveAsBtn">Guardar como...</button>
          </div>
        </div>

        <button type="button" id="loadBtn">Cargar</button>

        <div class="export-wrap">
          <button type="button">Exportar ▾</button>
          <div class="export-menu">
            <button type="button" data-format="txt">Texto (.txt)</button>
            <button type="button" data-format="docx">Word (.docx)</button>
            <button type="button" data-format="fdx">Final Draft (.fdx)</button>
            <button type="button" data-format="pdf">PDF</button>
          </div>
        </div>
      </div>
      <div class="menu-right">
        <span>Avisos:</span>
        <span id="lineAlert" class="notice">Sin alertas</span>
      </div>
    </header>

    <div id="loadModal" class="modal" style="display:none;">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Cargar Guión</h2>
          <button class="close-btn" id="closeLoadModal">&times;</button>
        </div>
        <div class="modal-body">
          <div id="loadList"></div>
          <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd;">
            <label>O cargar archivo:</label><br>
            <input type="file" id="fileInput" accept=".json,.txt" style="margin-top: 0.5rem;">
          </div>
        </div>
      </div>
    </div>

    <div id="saveFormatModal" class="modal" style="display:none;">
      <div class="modal-content" style="max-width: 400px;">
        <div class="modal-header">
          <h2>Selecciona formato</h2>
          <button class="close-btn" id="closeSaveFormatModal">&times;</button>
        </div>
        <div class="modal-body">
          <label>Nombre del archivo:</label>
          <input type="text" id="saveFileName" placeholder="Mi guión" style="width: 100%; margin: 0.5rem 0; padding: 0.5rem; border: 1px solid #ccc;">

          <label>Formato:</label>
          <select id="saveFormat" style="width: 100%; margin: 0.5rem 0; padding: 0.5rem; border: 1px solid #ccc;">
            <option value="json">Proyecto (JSON)</option>
            <option value="txt">Texto plano (TXT)</option>
            <option value="html">HTML</option>
          </select>

          <div style="margin-top: 1rem; text-align: right;">
            <button id="cancelSaveBtn" style="margin-right: 0.5rem;">Cancelar</button>
            <button id="confirmSaveBtn" style="background: #0066cc; color: white;">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
