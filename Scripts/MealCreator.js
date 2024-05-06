const type = 'mealCreator';

document.addEventListener('DOMContentLoaded', function () {
  loadItems();
});

function addItem() {
  const mealName = document.getElementById("mealName").value;
  const mealIngredients = document.getElementById("mealIngredients").value;
  const mealRequiresDefrosting = document.getElementById("mealRequiresDefrosting").checked;

  var ingredientsArray = [];
  var ingredients = mealIngredients.split(";");
  ingredients.forEach(ingredient => {
    if (ingredient !== null && ingredient !== '' && ingredient.includes(',')) {
        ingredient = ingredient.split(',');
        ingredientsArray.push({item: ingredient[0], quantity: ingredient[1]});
    }
  })

  PostItemToServer('/saveItem', type, { item: mealName, ingredients: ingredientsArray, defrost: mealRequiresDefrosting });

//   if (meal.trim() !== "") {
//     AddItemToCache(type, {_id: "", name: meal, weekday: formattedDay})

//     PostItemToServer('/removeItem', type, { weekday: formattedDay });
//     PostItemToServer('/saveItem', type, { item: meal, weekday: formattedDay });

  loadItems();
//     meal = "";
//   }
}

async function loadItems()
{
  var itemList = document.getElementById("itemList");

//   loadFromCache(itemList);
  await loadFromDatabase(itemList);
}

async function loadFromDatabase(itemList)
{
  try {
    var dbItems = await GetItemsFromServer(type);
    console.log(dbItems);
    if (dbItems) {
      itemList.innerHTML = "";
      
      dbItems.forEach(item => {
        const itemName = item.name;
        var listItem = createListItem(itemName);
  
        var removeButton = createCompleteButton(async function () {
          PostItemToServer('/removeItem', type, { item: itemName });
          itemList.removeChild(listItem);
          dbItems = await GetItemsFromServer(type)
        //   SaveItemsToCache(type, dbItems);
        });
  
        listItem.appendChild(removeButton);
        itemList.appendChild(listItem);
      });
      
    //   SaveItemsToCache(type, dbItems);
    }
  } catch (error) {
    console.error('Error loading items from the database:', error);
  }
}