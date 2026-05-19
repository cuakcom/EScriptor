import { addSceneToSidebar, addCharacterToSidebar, getCharactersFromSidebar } from "../components/sidebar.js";

export class ScriptManager {
  constructor() {
    this.scenes = [];
    this.characters = [];
  }

  addScene(sceneTitle) {
    if (!this.scenes.includes(sceneTitle)) {
      this.scenes.push(sceneTitle);
      addSceneToSidebar(sceneTitle);
    }
  }

  addCharacter(characterName) {
    const upperName = characterName.toUpperCase().trim();
    if (upperName && !this.characters.includes(upperName)) {
      this.characters.push(upperName);
      addCharacterToSidebar(upperName);
    }
  }

  getCharacters() {
    return getCharactersFromSidebar();
  }

  getScenes() {
    return this.scenes;
  }

  clearAll() {
    this.scenes = [];
    this.characters = [];
    document.getElementById("scenesList").innerHTML = '<div class="sidebar-empty">No hay escenas</div>';
    document.getElementById("charactersList").innerHTML = '<div class="sidebar-empty">No hay personajes</div>';
  }
}

export function detectSceneTitle(text) {
  const match = text.match(/^(INT|EXT)\.?\s*[-–]\s*(.+)$/i);
  return match ? match[0].toUpperCase() : null;
}

export function detectCharacterName(text) {
  const trimmed = text.trim().toUpperCase();
  if (trimmed && trimmed.length > 0 && trimmed.length < 100) {
    return trimmed;
  }
  return null;
}
