// Initialise global constants
const type = 'chores';

// On page load
document.addEventListener('DOMContentLoaded', function () {
  loadItems();
});

/**
 * Adds an item to the chores from the value entered in the itemInput element.
 */
function addItem() {
  var itemInput = document.getElementById("choreInput");
  const person = document.getElementById('person').value;

  var itemList = document.getElementById("itemList");

  if (itemInput.value.trim() !== "") {
    var listItem = createListItem(itemInput.value);
    var itemName = listItem.textContent;

    var assignee = document.createElement("button");
    assignee.textContent = person;
    assignee.disabled = true;
    assignee.id = person;

    var removeButton = createRemoveButton(itemName, async function () {
      PostItemToServer('/removeItem', type, itemName);
      itemList.removeChild(listItem);
      dbItems = await GetItemsFromServer(type)
      SaveItemsToCache(type, dbItems);
    });

    AddItemToCache(type, itemInput.value);
    itemInput.value = "";

    PostItemToServer('/saveItem', type, listItem.textContent, person);
    
    listItem.appendChild(assignee);
    listItem.appendChild(removeButton);
    itemList.appendChild(listItem);
  }
}

/**
 * Loads the items currently in the chores.
 */
async function loadItems() {
  var itemList = document.getElementById("itemList");

  var cacheItems = GetItemsFromCache(type);
  if (cacheItems)
  {
    cacheItems.forEach(item => {
      var listItem = createListItem(item.name);

      var assignee = document.createElement("button");
      assignee.textContent = item.person;
      assignee.disabled = true;
      assignee.id = item.person;

      var removeButton = createRemoveButton(item.name, null);
      removeButton.disabled = true;

      listItem.appendChild(assignee);
      listItem.appendChild(removeButton);
      itemList.appendChild(listItem);
    });
  }

  try {
    var dbItems = await GetItemsFromServer(type);
    if (dbItems) {
      itemList.innerHTML = "";
      
      dbItems.forEach(item => {
        var listItem = createListItem(item.name);
  
        var assignee = document.createElement("button");
        assignee.textContent = item.person;
        assignee.disabled = true;
        assignee.id = item.person;

        var removeButton = createRemoveButton(item.name, async function () {
          PostItemToServer('/removeItem', type, item.name);
          itemList.removeChild(listItem);
          dbItems = await GetItemsFromServer(type)
          SaveItemsToCache(type, dbItems);
        });
  
        listItem.appendChild(assignee);
        listItem.appendChild(removeButton);
        itemList.appendChild(listItem);
      });
      
      SaveItemsToCache(type, dbItems);
    }
  } catch (error) {
    console.error('Error loading items from the database:', error);
  }
}