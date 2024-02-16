const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Helper function to create a list item.
 */
function createListItem(text) {
  var listItem = document.createElement("li");
  listItem.textContent = text;
  return listItem;
}

/**
 * Helper function to create a remove button.
 */
function createRemoveButton(clickHandler) {
  var removeButton = document.createElement("button");
  removeButton.id = "removeButton";
  removeButton.className = "fa-solid fa-trash";
  removeButton.onclick = clickHandler;
  return removeButton;
}

/**
 * Helper function to create a remove button.
 */
function createCompleteButton(clickHandler) {
  var completeButton = document.createElement("button");
  completeButton.id = "completeButton";
  completeButton.className = "fa-solid fa-check";
  completeButton.onclick = clickHandler;
  return completeButton;
}

/**
 * Helper function to create a label.
 */
function createLabel(labelText) {
  var label = document.createElement("button");
  label.textContent = labelText;
  label.disabled = true;
  label.id = labelText;
  return label;
}

function updateClock() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;

  var timeString = hours + ':' + minutes + ' ' + ampm;
  var dateString = now.toDateString();

  document.getElementById('time').innerHTML = timeString;
  document.getElementById('date').innerHTML = dateString;
}

function updateWeather() {
  const weatherInfoDiv = document.getElementById('weatherInfo');
  const lastFetchTimestamp = localStorage.getItem('lastFetchTimestamp');
  const currentTimestamp = new Date().getTime();

  // Make a request to the /fetchWeather endpoint
  fetch('/fetchWeather')
    .then(response => response.json())
    .then(data => {
      // Update the content of the weatherInfo div
      populateWeather(data.title,data.description,data.pubDate)

      // Update the last fetch timestamp in local storage
      localStorage.setItem('WeatherTimestamp', currentTimestamp);
      localStorage.setItem('WeatherTitle', data.title);
      localStorage.setItem('WeatherDescription', data.description);
      localStorage.setItem('WeatherPubDate', data.pubDate);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function populateWeather(title, description, pubDate) {
  try {
    const weatherInfoDiv = document.getElementById('weatherInfo');

    weatherInfoDiv.innerHTML = `
      <h2>${title}</h2>
      <p>${description}</p>
      <p>Publication Date: ${pubDate}</p>
    `;
  } catch (error) {
    console.error('Error populating weather data:', error);
    // Handle the error appropriately, e.g., display a message to the user
  }
}

updateClock();
populateWeather(localStorage.getItem('WeatherTitle'),localStorage.getItem('WeatherDescription'),localStorage.getItem('WeatherPubDate'))
setInterval(updateWeather, ONE_HOUR);