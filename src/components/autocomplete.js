export function createAutocompleteDropdown() {
  const dropdown = document.createElement("div");
  dropdown.className = "autocomplete-dropdown";
  dropdown.id = "autocompleteDropdown";
  dropdown.style.display = "none";
  document.body.append(dropdown);
  return dropdown;
}

export function showAutocomplete(searchText, characters) {
  const dropdown = document.getElementById("autocompleteDropdown");
  if (!searchText.trim() || characters.length === 0) {
    dropdown.style.display = "none";
    return;
  }

  const matches = characters.filter(char =>
    char.toUpperCase().includes(searchText.toUpperCase())
  );

  if (matches.length === 0) {
    dropdown.style.display = "none";
    return;
  }

  dropdown.innerHTML = matches.map(char =>
    `<div class="autocomplete-item">${char}</div>`
  ).join("");
  dropdown.style.display = "block";

  const sel = window.getSelection();
  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    dropdown.style.position = "fixed";
    dropdown.style.left = rect.left + "px";
    dropdown.style.top = (rect.bottom + 5) + "px";
  }
}

export function hideAutocomplete() {
  const dropdown = document.getElementById("autocompleteDropdown");
  dropdown.style.display = "none";
}

export function getSelectedAutocompleteItem() {
  const dropdown = document.getElementById("autocompleteDropdown");
  const selected = dropdown.querySelector(".autocomplete-item.selected");
  return selected ? selected.textContent : null;
}
