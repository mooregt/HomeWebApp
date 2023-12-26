/**
 * Helper function to create a list item.
 */
function createListItem(text) {
  var listItem = document.createElement("li");
  listItem.textContent = text;
  return listItem;
}

/**
 * Helper function to create a remove button.
 */
function createRemoveButton(clickHandler) {
  var removeButton = document.createElement("button");
  removeButton.id = "removeButton";
  removeButton.className = "fa-solid fa-trash";
  removeButton.onclick = clickHandler;
  return removeButton;
}

/**
 * Helper function to create a remove button.
 */
function createCompleteButton(clickHandler) {
  var completeButton = document.createElement("button");
  completeButton.id = "completeButton";
  completeButton.className = "fa-solid fa-check";
  completeButton.onclick = clickHandler;
  return completeButton;
}

/**
 * Helper function to create a label.
 */
function createLabel(labelText) {
  var label = document.createElement("button");
  label.textContent = labelText;
  label.disabled = true;
  label.id = labelText;
  return label;
}