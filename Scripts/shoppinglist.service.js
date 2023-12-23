document.addEventListener('DOMContentLoaded', function () {
  loadItems();
});

/**
 * Adds an item to the shopping list from the value entered in the itemInput element.
 */
function addItem() {
  console.log("addItem triggered.");
  var itemInput = document.getElementById("itemInput");
  var itemList = document.getElementById("itemList");

  if (itemInput.value.trim() !== "") {
    var listItem = document.createElement("li");

    listItem.textContent = itemInput.value;

    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = async function () {
      PostItemToServer('/removeShoppingListItem', listItem);
      itemList.removeChild(listItem);
      dbItems = await GetItemsFromServer('shoppingList')
      SaveItemsToCache('checklistItems', dbItems);
    };
    AddItemToCache('checklistItems', itemInput.value);

    itemInput.value = "";

    
    PostItemToServer('/saveShoppingListItem', listItem.textContent);
    

    listItem.appendChild(removeButton);

    itemList.appendChild(listItem);
  }
}

/**
 * Loads the items currently in the shopping list.
 */
async function loadItems() {
  var itemList = document.getElementById("itemList");

  var cacheItems = GetItemsFromCache('checklistItems');
  if (cacheItems)
  {
    cacheItems.forEach(item => {
      var listItem = document.createElement("li");
      listItem.textContent = item.name;

      var removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.disabled = true;

      listItem.appendChild(removeButton);
      itemList.appendChild(listItem);
    });
  }

  try {
    var dbItems = await GetItemsFromServer('shoppingList');
    if (dbItems) {
      itemList.innerHTML = "";
      
      dbItems.forEach(item => {
        var listItem = document.createElement("li");
        listItem.textContent = item.name;
  
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = async function () {
          PostItemToServer('/removeShoppingListItem', item.name);
          itemList.removeChild(listItem);
          dbItems = await GetItemsFromServer('shoppingList')
          SaveItemsToCache('checklistItems', dbItems);
        };
  
        listItem.appendChild(removeButton);
        itemList.appendChild(listItem);
      });
      
      SaveItemsToCache('checklistItems', dbItems);
    }
  } catch (error) {
    console.error('Error loading items from the database:', error);
  }
}