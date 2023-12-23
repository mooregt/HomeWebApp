document.addEventListener('DOMContentLoaded', function () {
  loadItems();
});

/**
 * Adds an item to the chores from the value entered in the itemInput element.
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
      PostItemToServer('/removeItem', 'chores', listItem);
      itemList.removeChild(listItem);
      dbItems = await GetItemsFromServer('chores')
      SaveItemsToCache('choreItems', dbItems);
    };
    AddItemToCache('choreItems', itemInput.value);

    itemInput.value = "";

    PostItemToServer('/saveItem', 'chores', listItem.textContent);
    
    listItem.appendChild(removeButton);

    itemList.appendChild(listItem);
  }
}

/**
 * Loads the items currently in the chores.
 */
async function loadItems() {
  var itemList = document.getElementById("itemList");

  var cacheItems = GetItemsFromCache('choreItems');
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
    var dbItems = await GetItemsFromServer('chores');
    if (dbItems) {
      itemList.innerHTML = "";
      
      dbItems.forEach(item => {
        var listItem = document.createElement("li");
        listItem.textContent = item.name;
  
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = async function () {
          PostItemToServer('/removeItem', 'chores', item.name);
          itemList.removeChild(listItem);
          dbItems = await GetItemsFromServer('chores')
          SaveItemsToCache('choreItems', dbItems);
        };
  
        listItem.appendChild(removeButton);
        itemList.appendChild(listItem);
      });
      
      SaveItemsToCache('choreItems', dbItems);
    }
  } catch (error) {
    console.error('Error loading items from the database:', error);
  }
}