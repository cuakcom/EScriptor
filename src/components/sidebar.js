export function renderSidebar() {
  return `
    <aside class="sidebar">
      <div class="sidebar-header">ESCENAS</div>
      <div class="sidebar-section" id="scenesList">
        <div class="sidebar-empty">No hay escenas</div>
      </div>

      <div class="sidebar-header">PERSONAJES</div>
      <div class="sidebar-section" id="charactersList">
        <div class="sidebar-empty">No hay personajes</div>
      </div>
    </aside>
  `;
}

export function addSceneToSidebar(sceneTitle) {
  const scenesList = document.getElementById("scenesList");
  const empty = scenesList.querySelector(".sidebar-empty");
  if (empty) empty.remove();

  const item = document.createElement("div");
  item.className = "sidebar-item";
  item.textContent = sceneTitle;
  scenesList.append(item);
}

export function addCharacterToSidebar(characterName) {
  const charactersList = document.getElementById("charactersList");
  const empty = charactersList.querySelector(".sidebar-empty");
  if (empty) empty.remove();

  const item = document.createElement("div");
  item.className = "sidebar-item";
  item.textContent = characterName;
  charactersList.append(item);
}

export function getCharactersFromSidebar() {
  const charactersList = document.getElementById("charactersList");
  const items = charactersList.querySelectorAll(".sidebar-item");
  return Array.from(items).map(item => item.textContent);
}
