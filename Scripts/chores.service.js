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
  const frequency = document.getElementById('frequency').value;

  var itemList = document.getElementById("itemList");

  if (itemInput.value.trim() !== "") {
    var listItem = createListItem(itemInput.value);
    var itemName = listItem.textContent;

    var assignee = createLabel(person);

    var removeButton = createRemoveButton(async function () {
      PostItemToServer('/removeItem', type, itemName);
      PostItemToServer('/saveItem', type, itemName, person, new Date(new Date().setHours(0, 0, 0, 0)), frequency);
      itemList.removeChild(listItem);
      dbItems = await GetItemsFromServer(type)
      SaveItemsToCache(type, dbItems);
    });

    AddItemToCache(type, itemInput.value, person, "1900-01-01T00:00:00.000Z", frequency);
    itemInput.value = "";

    PostItemToServer('/saveItem', type, listItem.textContent, person, "1900-01-01T00:00:00.000Z", frequency);
    
    listItem.appendChild(assignee);
    listItem.appendChild(removeButton);
    itemList.appendChild(listItem);
  }
}

/**
 * Loads the list of items in the chores collection.
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
      daysSinceLastCompleted = (new Date(new Date().setHours(0, 0, 0, 0)) - new Date(item.lastCompleted)) / (1000 * 60 * 60 * 24);

      if (daysSinceLastCompleted >= item.frequency)
      {
        var listItem = createListItem(item.name);
        var assignee = createLabel(item.person);

        var removeButton = createRemoveButton(null);
        removeButton.disabled = true;

        listItem.appendChild(assignee);
        listItem.appendChild(removeButton);
        itemList.appendChild(listItem);
      }
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
        daysSinceLastCompleted = (new Date(new Date().setHours(0, 0, 0, 0)) - new Date(item.lastCompleted)) / (1000 * 60 * 60 * 24);

        if (daysSinceLastCompleted >= item.frequency)
        {
          var listItem = createListItem(item.name);
          var assignee = createLabel(item.person);

          var removeButton = createRemoveButton(async function () {
            PostItemToServer('/removeItem', type, item.name);
            PostItemToServer('/saveItem', type, item.name, item.person, new Date(new Date().setHours(0, 0, 0, 0)), item.frequency);
            itemList.removeChild(listItem);
            dbItems = await GetItemsFromServer(type)
            SaveItemsToCache(type, dbItems);
          });
    
          listItem.appendChild(assignee);
          listItem.appendChild(removeButton);
          itemList.appendChild(listItem);
        }
      });
      
      SaveItemsToCache(type, dbItems);
    }
  } catch (error) {
    console.error('Error loading items from the database:', error);
  }
}