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

function loadItems() {
  var itemList = document.getElementById("itemList");

  // Fetch items from the server
  fetch('/getItems')
    .then(response => response.json())
    .then(items => {
      // Display items as list items
      items.forEach(item => {
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
    })
    .catch(error => console.error('Error:', error));
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