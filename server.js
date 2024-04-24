const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, Int32 } = require('mongodb');
const axios = require('axios');
const xml2js = require('xml2js');

const app = express();
const port = process.env.PORT || 3000;

const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const DAY_START_HOUR = 6; // Adjust as per your daytime start hour
const DAY_END_HOUR = 22; // Adjust as per your daytime end hour

app.use(express.static(__dirname));
app.use(bodyParser.json());

/**
 * Creates a connection to a MongoDB collection.
 * @param {string} dbName 
 * @param {string} collectionName 
 * @returns {Collection<Document>} The MongoDB collection.
 */
async function connectToMongo(dbName, collectionName) {
  const uri = 'mongodb+srv://mooretgeorge:3oHsSAXAoX6jvoMk@cluster0.sv6wfeu.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(uri);
  
  await client.connect();
  return client.db(dbName).collection(collectionName);
}

async function fetchAndStoreTemperature() {
  const currentHour = new Date().getHours();
  
  // Check if the current time is within daytime hours
  if (currentHour >= DAY_START_HOUR && currentHour < DAY_END_HOUR) {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=54.2242&longitude=-4.5357&hourly=temperature_2m&timezone=Europe%2FLondon&forecast_days=1";
    var currentDate = new Date();

    try {
      const response = await axios.get(url);
      var lowestTemp = 100;
      var highestTemp = 0;
      var avgTemp = 0;
      var countTemp = 0;

      // Remove the first 6 and last 6 elements
      var daylightTemps = response.data.hourly.temperature_2m.splice(6, response.data.hourly.temperature_2m.length);
      daylightTemps = daylightTemps.splice(0, daylightTemps.length - 6);

      daylightTemps.forEach(temp => {
        if (temp < lowestTemp){
          lowestTemp = temp;
        }
        if (temp > highestTemp){
          highestTemp = temp;
        }
        avgTemp = avgTemp + temp;
        countTemp++;
      });
      avgTemp = avgTemp / countTemp;

      console.log(lowestTemp);
      console.log(highestTemp);
      console.log(avgTemp);

      temperatureCollection.insertOne({
        minTemp: lowestTemp,
        maxTemp: highestTemp,
        avgTemp: avgTemp,
        datetime: currentDate
      });

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
}

async function fetchAndStoreWeather() {
  const currentHour = new Date().getHours();

  // Check if the current time is within daytime hours
  if (currentHour >= DAY_START_HOUR && currentHour < DAY_END_HOUR) {
    const weatherUrl = 'https://www.gov.im/weather/RssCurrentForecast';
    var currentDate = new Date();

    try {
      const response = await axios.get(weatherUrl);
      const xmlData = response.data;

      const parser = new xml2js.Parser();
      const parsedData = await parser.parseStringPromise(xmlData);

      const title = parsedData.rss.channel[0].title[0];
      const description = parsedData.rss.channel[0].description[0];
      const forecastTitle = parsedData.rss.channel[0].item[0].title[0];
      const forecastDescription = parsedData.rss.channel[0].item[0].description[0];
      const forecastPubDate = parsedData.rss.channel[0].item[0].pubDate[0];

      const latestWeather = await getWeatherLatest();
      if (!latestWeather || latestWeather.forecastPubDate !== forecastPubDate) {
        weatherCollection.insertOne({
          title: title,
          description: description,
          pubDate: currentDate,
          forecastTitle: forecastTitle,
          forecastDescription: forecastDescription,
          forecastPubDate: forecastPubDate
        });
      }

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
}

async function getWeatherLatest() {
  return await weatherCollection.findOne({}, {sort: {pubDate: -1}});
}

async function getTemperatureLatest() {
  return await temperatureCollection.findOne({}, {sort: {datetime: -1}});
}

/**
 * / endpoint.
 * Retrieves the index page.
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/**
 * /getItems endpoint.
 * Retrieves the items from the specified MongoDB collections.
 * @param {string} type the name of the collection (one of shoppingList, mealPlan, chores)
 */
app.get('/getItems', async (req, res) => {
  try {
    const type = req.query.type;
    var items;

    switch (type) {
      case "shoppingList":
        items = await shoppingListCollection.find({}).toArray();
        break;
      case "mealPlan":
        items = await mealPlanCollection.find({}).toArray();
        break;
      case "chores":
        items = await choresCollection.find({}).toArray();
        break;
    }
    
    res.json(items);
  }
  catch (error) {
    console.error('Error reading items from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * /saveItem endpoint.
 * Writes the item to the MongoDB collection called items.
 */
app.post('/saveItem', async (req, res) => {
  const type = req.query.type;

  try {
    switch (type) {
      case "shoppingList":
        await shoppingListCollection.insertOne({ name: req.body.item });
        break;
      case "mealPlan":
        await mealPlanCollection.insertOne({ name: req.body.item, weekday: req.body.weekday });
        break;
      case "chores":
        await choresCollection.insertOne({ name: req.body.item, person: req.body.person, lastCompleted: req.body.lastCompleted, frequency: req.body.frequency });
        break;
    }

    res.json({ success: true });
  }
  catch (error) {
    console.error('Error writing item to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * /removeItem endpoint.
 * Removes the item from the MongoDB collection called items.
 */
app.post('/removeItem', async (req, res) => {
  const type = req.query.type;

  try {
    switch (type) {
      case "shoppingList":
        await shoppingListCollection.deleteOne({ name: req.body.item });
        break;
      case "mealPlan":
        await mealPlanCollection.deleteOne({ weekday: req.body.weekday });
        break;
      case "chores":
        await choresCollection.deleteOne({ name: req.body.item });
        break;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error writing item to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/getWeather', async (req, res) => {
  try {
    var item;

    item = await getWeatherLatest();
    
    res.json(item);
  }
  catch (error) {
    console.error('Error reading items from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/getTemperature', async (req, res) => {
  try {
    var item;

    item = await getTemperatureLatest();
    
    res.json(item);
  }
  catch (error) {
    console.error('Error reading items from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

setInterval(function () {
  fetchAndStoreWeather();
  fetchAndStoreTemperature();
}, TWO_HOURS);

/**
 * Start up the server on the specified port.
 */
app.listen(port, '0.0.0.0', async () => {
    shoppingListCollection = await connectToMongo('shopping', 'items');
    mealPlanCollection = await connectToMongo('mealPlan', 'items');
    choresCollection = await connectToMongo('chores', 'items');
    weatherCollection = await connectToMongo('weather', 'items');
    temperatureCollection = await connectToMongo('temperature', 'items');
    
    console.log(`Server is running at http://${require('os').hostname()}:${port}`);
});
