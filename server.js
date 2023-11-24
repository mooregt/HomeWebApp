const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

const uri = 'mongodb+srv://mooretgeorge:3oHsSAXAoX6jvoMk@cluster0.sv6wfeu.mongodb.net/?retryWrites=true&w=majority';

const dbName = 'shopping';
const collectionName = 'items';

async function connectToMongo() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db(dbName).collection(collectionName);
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/getItems', async (req, res) => {
  try {
    const collection = await connectToMongo();
    const items = await collection.find({}).toArray();
    res.json(items);
  } catch (error) {
    console.error('Error reading items from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/saveItem', async (req, res) => {
  const { item } = req.body;
  try {
    const collection = await connectToMongo();
    await collection.insertOne({ name: item });
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing item to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/removeItem', async (req, res) => {
  const { item } = req.body;
  try {
    const collection = await connectToMongo();
    await collection.deleteOne({ name: item });
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing item to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://${require('os').hostname()}:${port}`);
});

