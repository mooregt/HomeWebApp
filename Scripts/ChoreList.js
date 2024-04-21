// Initialise global constants
const type = 'chores';

// On page load
document.addEventListener('DOMContentLoaded', function () {
  hideLightbox();
  loadItems();
});

/**
 * Adds an item to the chores from the value entered in the itemInput element.
 */
function addItem() {
  var itemInput = document.getElementById("choreInput");
  const currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  const oldestDate = "1900-01-01T00:00:00.000Z";
  const person = document.getElementById('person').value;
  const frequency = document.getElementById('frequency').value;

  var itemList = document.getElementById("itemList");

  if (itemInput.value.trim() !== "") {
    var listItem = createListItem(itemInput.value);
    var itemName = listItem.textContent;

    var assignee = createLabel(person);

    var completeButton = createCompleteButton(async function () {
      PostItemToServer('/removeItem', type, { item: itemName });
      PostItemToServer('/saveItem', type, { item: itemName, person: person, lastCompleted: currentDate, frequency: frequency });
      itemList.removeChild(listItem);
      dbItems = await GetItemsFromServer(type)
      SaveItemsToCache(type, dbItems);
    });

    var removeButton = createRemoveButton(async function () {
      showLightbox(listItem, itemName);
    });

    AddItemToCache(type, {_id: "", name: itemInput.value, person: person, lastCompleted: oldestDate, frequency: frequency})
    itemInput.value = "";

    PostItemToServer('/saveItem', type, { item: itemName, person: person, lastCompleted: oldestDate, frequency: frequency });
    
    listItem.appendChild(assignee);
    listItem.appendChild(completeButton);
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

        var completeButton = createCompleteButton(null);
        completeButton.disabled = true;
        var removeButton = createRemoveButton(null);
        removeButton.disabled = true;

        listItem.appendChild(assignee);
        listItem.appendChild(completeButton);
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
        const itemName = item.name;
        const person = item.person;
        const currentDate = new Date(new Date().setHours(0, 0, 0, 0));
        const frequency = item.frequency;
        const daysSinceLastCompleted = (currentDate - new Date(item.lastCompleted)) / (1000 * 60 * 60 * 24);

        if (daysSinceLastCompleted >= frequency)
        {
          var listItem = createListItem(itemName);
          var assignee = createLabel(person);

          var completeButton = createCompleteButton(async function () {
            PostItemToServer('/removeItem', type, { item: itemName });
            PostItemToServer('/saveItem', type, { item: itemName, person: person, lastCompleted: currentDate, frequency: frequency });
            
            itemList.removeChild(listItem);
            dbItems = await GetItemsFromServer(type)
            SaveItemsToCache(type, dbItems);
          });

          var removeButton = createRemoveButton(async function () {
            showLightbox(listItem, itemName);
          });
    
          listItem.appendChild(assignee);
          listItem.appendChild(completeButton);
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

// Function to show the lightbox
function showLightbox(listItem, itemName) {
  document.getElementById('confirmationLightbox').style.display = 'flex';
  var prompt = document.getElementById('confirmation-text');
  prompt.textContent = `You are about to permanently delete "${itemName}". Would you like to continue?`

  // Attach event listeners to buttons
  document.getElementById('confirmAction').addEventListener('click', function() {confirmCallback(listItem, itemName)});
  document.getElementById('cancelAction').addEventListener('click', function() {hideLightbox()});
}

// Function to hide the lightbox
function hideLightbox() {
  document.getElementById('confirmationLightbox').style.display = 'none';
}

async function confirmCallback(listItem, itemName)
{
  var itemList = document.getElementById("itemList");

  itemList.removeChild(listItem);
  PostItemToServer('/removeItem', type, { item: itemName });
  var dbItems = await GetItemsFromServer(type)
  SaveItemsToCache(type, dbItems);

  hideLightbox()
}