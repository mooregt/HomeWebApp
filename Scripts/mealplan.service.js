document.addEventListener('DOMContentLoaded', function () {
  loadItems();
});

function addItem() {
  console.log("addItem triggered.");
  var mealInput = document.getElementById("mealInput");
  var mealPlan = document.getElementById("mealPlan");
  const day = document.getElementById('day').value;

  if (mealInput.value.trim() !== "") {
    var listItem = document.createElement("li");

    listItem.textContent = `${day.charAt(0).toUpperCase() + day.slice(1)}: ${mealInput.value}`;

    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = async function () {
      PostItemToServer('/removeMealItem', listItem);
      mealPlan.removeChild(listItem);
      dbItems = await GetItemsFromServer('/getMealItems')
      SaveItemsToCache('mealItems', dbItems);
    };
    AddItemToCache('mealItems', mealInput.value);

    mealInput.value = "";

    
    PostItemToServer('/saveMealItem', listItem.textContent);
    

    listItem.appendChild(removeButton);

    mealPlan.appendChild(listItem);
  }
}

async function loadItems() {
  var mealPlan = document.getElementById("mealPlan");

  var cacheItems = GetItemsFromCache('mealItems');
  if (cacheItems)
  {
    cacheItems.forEach(item => {
      var listItem = document.createElement("li");
      listItem.textContent = item.name;

      var removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.disabled = true;

      listItem.appendChild(removeButton);
      mealPlan.appendChild(listItem);
    });
  }

  try {
    var dbItems = await GetItemsFromServer('/getMealItems');
    if (dbItems) {
      mealPlan.innerHTML = "";
      
      dbItems.forEach(item => {
        var listItem = document.createElement("li");
        listItem.textContent = item.name;
  
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = async function () {
          PostItemToServer('/removeMealItem', item.name);
          mealPlan.removeChild(listItem);
          dbItems = await GetItemsFromServer('/getMealItems')
          SaveItemsToCache('mealItems', dbItems);
        };
  
        listItem.appendChild(removeButton);
        mealPlan.appendChild(listItem);
      });
      
      SaveItemsToCache('mealItems', dbItems);
    }
  } catch (error) {
    console.error('Error loading items from the database:', error);
  }
}