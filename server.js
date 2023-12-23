const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

var shoppingListCollection;
var mealPlanCollection;

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

/**
 * / endpoint.
 * Retrieves the index page.
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/getShoppingListItems', async (req, res) => {
  try {
    const items = await shoppingListCollection.find({}).toArray();
    res.json(items);
  } catch (error) {
    console.error('Error reading items from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/getMealItems', async (req, res) => {
  try {
    const items = await mealPlanCollection.find({}).toArray();
    res.json(items);
  } catch (error) {
    console.error('Error reading items from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/getChoresItems', async (req, res) => {
  try {
    const items = await choresCollection.find({}).toArray();
    res.json(items);
  } catch (error) {
    console.error('Error reading items from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * /saveShoppingListItem endpoint.
 * Writes the item to the MongoDB collection called items.
 */
app.post('/saveShoppingListItem', async (req, res) => {
  const { item } = req.body;

  try {
    await shoppingListCollection.insertOne({ name: item });
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing item to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/saveMealItem', async (req, res) => {
  const { item, day } = req.body;

  try {
    await mealPlanCollection.insertOne({ name: item, weekday: day});
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing item to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/saveChoresItem', async (req, res) => {
  const { item, day } = req.body;

  try {
    await choresCollection.insertOne({ name: item });
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing item to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * /removeShoppingListItem endpoint.
 * Removes the item from the MongoDB collection called items.
 */
app.post('/removeShoppingListItem', async (req, res) => {
  const { item } = req.body;

  try {
    await shoppingListCollection.deleteOne({ name: item });
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing item to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/removeMealItem', async (req, res) => {
  const { item } = req.body;
  console.log(item);

  try {
    await mealPlanCollection.deleteOne({ weekday: item });
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing item to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/removeChoresItem', async (req, res) => {
  const { item } = req.body;
  console.log(item);

  try {
    await choresCollection.deleteOne({ name: item });
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing item to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * Start up the server on the specified port.
 */
app.listen(port, '0.0.0.0', async () => {
    shoppingListCollection = await connectToMongo('shopping', 'items');
    mealPlanCollection = await connectToMongo('mealPlan', 'items');
    choresCollection = await connectToMongo('chores', 'items');
    console.log(`Server is running at http://${require('os').hostname()}:${port}`);
});

