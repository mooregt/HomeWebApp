const ONE_HOUR = 60 * 60 * 1000;

document.addEventListener('DOMContentLoaded', function () {
  updateClock();
  updateWeather();
  updateTemperature();
});

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12;
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
          <p id="weatherUpdated">${data.forecastPubDate}</p>
        `;
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }
  
  function updateTemperature() {
    const tempTodayMax = document.getElementById('tempTodayMax');
    const tempTodayMin = document.getElementById('tempTodayMin');
    const tempTomorrowMax = document.getElementById('tempTomorrowMax');
    const tempTomorrowMin = document.getElementById('tempTomorrowMin');
    const tempWeekendMax = document.getElementById('tempWeekendMax');
    const tempWeekendMin = document.getElementById('tempWeekendMin');
  
    fetch('/getTemperature')
      .then(response => response.json())
      .then(data => {
        tempTodayMax.innerHTML = `<p class="tempHeader">TODAY</p><p class="temp">${data.temperature[0].max}°</p>`;
        tempTodayMin.innerHTML = `<p class="temp">${data.temperature[0].min}°</p>`;
        tempTomorrowMax.innerHTML = `<p class="tempHeader">TOMORROW</p><p  class="temp">${data.temperature[1].max}°</p>`;
        tempTomorrowMin.innerHTML = `<p class="temp">${data.temperature[1].min}°</p>`;
  
        if (data.temperature[0].day >= 1 && data.temperature[0].day < 3){ // if Monday or Tuesday
          tempWeekendMax.innerHTML = `<p class="tempHeader">WEEKEND</p><p class="temp">${data.temperature[4].max}°</p>`;
          tempWeekendMin.innerHTML = `<p class="temp">${data.temperature[4].min}°</p>`;
        }
        else if (data.temperature[0].day == 3) { // if Wednesday
          tempWeekendMax.innerHTML = `<p class="tempHeader">WEEKEND</p><p class="temp">${data.temperature[3].max}°</p>`;
          tempWeekendMin.innerHTML = `<p class="temp">${data.temperature[3].min}°</p>`;
        }
        else if (data.temperature[0].day == 4 || data.temperature[0].day == 5) { // if Thursday or Friday
          tempWeekendMax.innerHTML = `<p class="tempHeader">WEEKEND</p><p class="temp">${data.temperature[2].max}°</p>`;
          tempWeekendMin.innerHTML = `<p class="temp">${data.temperature[2].min}°</p>`;
        }
        else if (data.temperature[0].day == 6) { // if Saturday
          tempWeekendMax.innerHTML = `<p class="tempHeader">MONDAY</p><p class="temp">${data.temperature[2].max}°</p>`;
          tempWeekendMin.innerHTML = `<p class="temp">${data.temperature[2].min}°</p>`;
        }
        else if (data.temperature[0].day == 0) { // if Sunday
          tempWeekendMax.innerHTML = `<p class="tempHeader">MONDAY</p><p class="temp">${data.temperature[1].max}°</p>`;
          tempWeekendMin.innerHTML = `<p class="temp">${data.temperature[1].min}°</p>`;
        }
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }