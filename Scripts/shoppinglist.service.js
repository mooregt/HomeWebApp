// Initialise global constants
const type = 'shoppingList';

// On page load
document.addEventListener('DOMContentLoaded', function () {
  loadItems();
});

/**
 * Adds an item to the shopping list from the value entered in the itemInput element.
 */
function addItem() {
  var itemInput = document.getElementById("itemInput");
  var itemList = document.getElementById("itemList");

  if (itemInput.value.trim() !== "") {
    var listItem = createListItem(itemInput.value)
    var itemName = listItem.textContent;

    var removeButton = createCompleteButton(async function () {
      PostItemToServer('/removeItem', type, itemName);
      itemList.removeChild(listItem);
      dbItems = await GetItemsFromServer(type)
      SaveItemsToCache(type, dbItems);
    });

    AddItemToCache(type, itemInput.value);
    itemInput.value = "";
    
    PostItemToServer('/saveItem', type, listItem.textContent);

    listItem.appendChild(removeButton);
    itemList.appendChild(listItem);
  }
}

/**
 * Loads the list of items in the shoppingList collection.
 */
async function loadItems()
{
  var itemList = document.getElementById("itemList");

  loadFromCache(itemList);
  await loadFromDatabase(itemList);
}

/**
 * Loads the items currently stored in the cache.
 * @param {HTMLElement} itemList 
 */
function loadFromCache(itemList)
{
  var cacheItems = GetItemsFromCache(type);
  if (cacheItems)
  {
    cacheItems.forEach(item => {
      var listItem = createListItem(item.name);

      var removeButton = createCompleteButton(null);
      removeButton.disabled = true;

      listItem.appendChild(removeButton);
      itemList.appendChild(listItem);
    });
  }
}

/**
 * Loads the items currently stored in the database.
 * @param {HTMLElement} itemList 
 */
async function loadFromDatabase(itemList)
{
  try {
    var dbItems = await GetItemsFromServer(type);
    if (dbItems) {
      itemList.innerHTML = "";
      
      dbItems.forEach(item => {
        var listItem = createListItem(item.name);
  
        var removeButton = createCompleteButton(async function () {
          PostItemToServer('/removeItem', type, item.name);
          itemList.removeChild(listItem);
          dbItems = await GetItemsFromServer(type)
          SaveItemsToCache(type, dbItems);
        });
  
        listItem.appendChild(removeButton);
        itemList.appendChild(listItem);
      });
      
      SaveItemsToCache(type, dbItems);
    }
  } catch (error) {
    console.error('Error loading items from the database:', error);
  }
}