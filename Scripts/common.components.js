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
function createRemoveButton(itemName, clickHandler) {
  var removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.onclick = clickHandler;
  return removeButton;
}