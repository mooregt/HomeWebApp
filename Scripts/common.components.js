const ONE_HOUR = 60 * 60 * 1000;

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

function removeHtmlTags(html) {
  return html.replace(/<[^>]*>/g, ' ');
}

function updateWeather() {
  const weatherInfoDiv = document.getElementById('weatherInfo');
  const todayRegex = /<p>(.*?)<\/p><p>/s;
  const outlookRegex = /<\/p><p>(.*?)<\/p>/s;

  fetch('/getWeather')
    .then(response => response.json())
    .then(data => {
      const todayMatch = data.forecastDescription.match(todayRegex);
      const forecastToday = todayMatch ? removeHtmlTags(todayMatch[1]) : '';

      const outlookMatch = data.forecastDescription.match(outlookRegex);
      const forecastOutlook = outlookMatch ? removeHtmlTags(outlookMatch[1]) : '';

      weatherInfoDiv.innerHTML = `
        <h2 id="weatherHeader">Today</h2>
        <p>${forecastToday}</p>
        <h2 id="weatherHeader">Tomorrow</h2>
        <p>${forecastOutlook}</p>
        <p id="weatherUpdated">Updated: ${data.forecastPubDate}</p>
      `;
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

// Update widgets
updateClock();
updateWeather();