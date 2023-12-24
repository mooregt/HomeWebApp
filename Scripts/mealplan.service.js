// Initialise global constants
const type = 'mealPlan';

// On page load
document.addEventListener('DOMContentLoaded', function () {
  loadItems();
});

function addItem() {
  var mealInput = document.getElementById("mealInput");
  const day = document.getElementById('day').value;

  if (mealInput.value.trim() !== "") {
    AddMealToCache(type, mealInput.value, (day.charAt(0).toUpperCase() + day.slice(1)));

    PostItemToServer('/removeItem', type, (day.charAt(0).toUpperCase() + day.slice(1)));
    PostItemToServer('/saveItem', type, mealInput.value, (day.charAt(0).toUpperCase() + day.slice(1)));

    loadItems();
    mealInput.value = "";
  }
}

async function loadItems() {

  var cacheItems = GetItemsFromCache(type);
  if (cacheItems)
  {
    cacheItems.forEach(item => {
      setMealForWeekday(item.weekday, item.name);
    });
  }

  try {
    var dbItems = await GetItemsFromServer(type);
    if (dbItems) {
      dbItems.forEach(item => {
        setMealForWeekday(item.weekday, item.name);
      });
      
      SaveItemsToCache(type, dbItems);
    }
  } catch (error) {
    console.error('Error loading items from the database:', error);
  }
}

function setMealForWeekday(weekday, name)
{
  var mondayMeal = document.getElementById("mondayMeal");
  var tuesdayMeal = document.getElementById("tuesdayMeal");
  var wednesdayMeal = document.getElementById("wednesdayMeal");
  var thursdayMeal = document.getElementById("thursdayMeal");
  var fridayMeal = document.getElementById("fridayMeal");
  var saturdayMeal = document.getElementById("saturdayMeal");
  var sundayMeal = document.getElementById("sundayMeal");

  switch (weekday) {
    case "Monday":
      mondayMeal.innerHTML = name;
      break;
    case "Tuesday":
      tuesdayMeal.innerHTML = name;
      break;
    case "Wednesday":
      wednesdayMeal.innerHTML = name;
      break;
    case "Thursday":
      thursdayMeal.innerHTML = name;
      break;
    case "Friday":
      fridayMeal.innerHTML = name;
      break;
    case "Saturday":
      saturdayMeal.innerHTML = name;
      break;
    case "Sunday":
      sundayMeal.innerHTML = name;
      break;
  }
}