document.addEventListener('DOMContentLoaded', function () {
  loadItems();
});

function addItem() {
  console.log("addItem triggered.");
  var mealInput = document.getElementById("mealInput");
  const day = document.getElementById('day').value;

  if (mealInput.value.trim() !== "") {
    AddMealToCache('mealItems', mealInput.value, (day.charAt(0).toUpperCase() + day.slice(1)));

    PostItemToServer('/removeMealItem', (day.charAt(0).toUpperCase() + day.slice(1)));
    PostMealToServer('/saveMealItem', mealInput.value, (day.charAt(0).toUpperCase() + day.slice(1)));

    loadItems();
    mealInput.value = "";
  }
}

async function loadItems() {
  var mondayMeal = document.getElementById("mondayMeal");
  var tuesdayMeal = document.getElementById("tuesdayMeal");
  var wednesdayMeal = document.getElementById("wednesdayMeal");
  var thursdayMeal = document.getElementById("thursdayMeal");
  var fridayMeal = document.getElementById("fridayMeal");
  var saturdayMeal = document.getElementById("saturdayMeal");
  var sundayMeal = document.getElementById("sundayMeal");

  var cacheItems = GetItemsFromCache('mealItems');
  if (cacheItems)
  {
    cacheItems.forEach(item => {
      switch (item.weekday) {
        case "Monday":
          mondayMeal.innerHTML = item.name;
          break;
        case "Tuesday":
          tuesdayMeal.innerHTML = item.name;
          break;
        case "Wednesday":
          wednesdayMeal.innerHTML = item.name;
          break;
        case "Thursday":
          thursdayMeal.innerHTML = item.name;
          break;
        case "Friday":
          fridayMeal.innerHTML = item.name;
          break;
        case "Saturday":
          saturdayMeal.innerHTML = item.name;
          break;
        case "Sunday":
          sundayMeal.innerHTML = item.name;
          break;
      }
    });
  }

  try {
    var dbItems = await GetItemsFromServer('/getMealItems');
    if (dbItems) {
      dbItems.forEach(item => {
        switch (item.weekday) {
          case "Monday":
            mondayMeal.innerHTML = item.name;
            break;
          case "Tuesday":
            tuesdayMeal.innerHTML = item.name;
            break;
          case "Wednesday":
            wednesdayMeal.innerHTML = item.name;
            break;
          case "Thursday":
            thursdayMeal.innerHTML = item.name;
            break;
          case "Friday":
            fridayMeal.innerHTML = item.name;
            break;
          case "Saturday":
            saturdayMeal.innerHTML = item.name;
            break;
          case "Sunday":
            sundayMeal.innerHTML = item.name;
            break;
        }
      });
      
      SaveItemsToCache('mealItems', dbItems);
    }
  } catch (error) {
    console.error('Error loading items from the database:', error);
  }
}