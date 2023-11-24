document.addEventListener('DOMContentLoaded', function () {
  loadItems();
});

function addItem() {
  console.log("addItem triggered.");
  var itemInput = document.getElementById("itemInput");
  var itemList = document.getElementById("itemList");

  if (itemInput.value.trim() !== "") {
    var listItem = document.createElement("li");

    listItem.textContent = itemInput.value;

    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = function () {
      removeItem(listItem);
    };

    itemInput.value = "";

    saveItem(listItem.textContent);

    listItem.appendChild(removeButton);

    itemList.appendChild(listItem);
  }
}

function removeItem(item) {
  fetch('/removeItem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ item }),
  })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
}

async function loadItems() {
  var itemList = document.getElementById("itemList");

  var cacheItems = loadFromCache();

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
    var dbItems = await loadFromDatabase();

    if (dbItems) {
      itemList.innerHTML = "";
      
      dbItems.forEach(item => {
        var listItem = document.createElement("li");
        listItem.textContent = item.name;
  
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = function () {
          removeItem(item.name);
          itemList.removeChild(listItem);
        };
  
        listItem.appendChild(removeButton);
        itemList.appendChild(listItem);
      });
      localStorage.setItem('checklistItems', JSON.stringify(dbItems));
    }
  } catch (error) {
    console.error('Error loading items from the database:', error);
  }
}

function loadFromCache() {
  const storedItems = localStorage.getItem('checklistItems');

  if (storedItems) {
    items = JSON.parse(storedItems);
    return items;
  }
}

async function loadFromDatabase() {
  try {
    const response = await fetch('/getItems');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const items = await response.json();
    
    return items;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

function saveItem(item) {
  fetch('/saveItem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ item }),
  })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
}