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
  const { item, item2, item3, item4 } = req.body;

  try {
    switch (type) {
      case "shoppingList":
        await shoppingListCollection.insertOne({ name: item });
        break;
      case "mealPlan":
        await mealPlanCollection.insertOne({ name: item, weekday: item2 });
        break;
      case "chores":
        await choresCollection.insertOne({ name: item, person: item2, lastCompleted: item3, frequency: item4 });
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
  const { item } = req.body;

  try {
    switch (type) {
      case "shoppingList":
        await shoppingListCollection.deleteOne({ name: item });
        break;
      case "mealPlan":
        await mealPlanCollection.deleteOne({ weekday: item });
        break;
      case "chores":
        await choresCollection.deleteOne({ name: item });
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

// setInterval(fetchAndStoreWeather, TWO_HOURS);

/**
 * Start up the server on the specified port.
 */
app.listen(port, '0.0.0.0', async () => {
    shoppingListCollection = await connectToMongo('shopping', 'items');
    mealPlanCollection = await connectToMongo('mealPlan', 'items');
    choresCollection = await connectToMongo('chores', 'items');
    weatherCollection = await connectToMongo('weather', 'items');

    fetchAndStoreWeather();
    
    console.log(`Server is running at http://${require('os').hostname()}:${port}`);
});
