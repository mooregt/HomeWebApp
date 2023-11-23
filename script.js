document.addEventListener('DOMContentLoaded', function () {
  loadItems(); // Load items from the server when the page loads
});

function addItem() {
  console.log("addItem triggered.");
  var itemInput = document.getElementById("itemInput");
  var itemList = document.getElementById("itemList");

  // Check if the input is not empty
  if (itemInput.value.trim() !== "") {
    // Create a new list item
    var listItem = document.createElement("li");

    // Set the text content to the input value
    listItem.textContent = itemInput.value;

    // Create a button for removing the item
    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = function () {
      removeItem(listItem);
    };

    // Clear the input field
    itemInput.value = "";

    // Send the new item to the server-side script for storage
    saveItem(listItem.textContent);

    // Append the remove button to the list item
    listItem.appendChild(removeButton);

    // Append the list item to the list
    itemList.appendChild(listItem);
  }
}

function removeItem(item) {
  // Send the item to the server-side script using fetch API
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
      listItem.textContent = item.name; // Assuming 'name' is a property of your items

      var removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.disabled = true;

      listItem.appendChild(removeButton);
      itemList.appendChild(listItem);
    });
  }

  try {
    // Load items from the database
    var dbItems = await loadFromDatabase();

    // If database items are available, replace the list with them
    if (dbItems) {
      itemList.innerHTML = "";
      
      dbItems.forEach(item => {
        var listItem = document.createElement("li");
        listItem.textContent = item.name; // Assuming 'name' is a property of your items
  
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = function () {
          removeItem(item.name);
          // Remove the item from the list
          itemList.removeChild(listItem);
        };
  
        listItem.appendChild(removeButton);
        itemList.appendChild(listItem);
      });
      localStorage.setItem('checklistItems', JSON.stringify(items));
    }
  } catch (error) {
      console.error('Error loading items from the database:', error);
      // Handle errors as needed
  }
}

function loadFromCache() {
  const storedItems = localStorage.getItem('checklistItems');

  if (storedItems) {
    // If available, parse the stored JSON
    items = JSON.parse(storedItems);
    return items;
  }
}

async function loadFromDatabase() {
  try {
        // Fetch items from the server
        const response = await fetch('/getItems');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const items = await response.json();
        
        // Process the items or any other logic here if needed
        
        // Return the items from the function
        return items;
    } catch (error) {
        console.error('Error:', error);
        // You might want to throw the error or handle it in a different way depending on your requirements
        throw error;
    }
}

function saveItem(item) {
  // Send the item to the server-side script using fetch API
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


function toggleThemeMenu() {
    var themeOptions = document.getElementById("themeOptions");
    themeOptions.classList.toggle("show");
}

function setTheme(theme) {
    var body = document.body;
    body.classList.remove("light-mode", "dark-mode");
    body.classList.add(theme + "-mode");

    // Save theme preference to local storage
    localStorage.setItem("theme", theme);

    // Hide the theme menu
    var themeOptions = document.getElementById("themeOptions");
    themeOptions.classList.remove("show");
}

function loadTheme() {
    // Load theme preference from local storage
    var savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        setTheme(savedTheme);
    }
}