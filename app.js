require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')
const { ObjectId } = require('mongodb')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('./public/'))

console.log(uri);
console.log('Server is running with MongoDB connection');

//client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

//get index
app.get('/', (req, res) => {
  res.sendFile('index.html');
})

// Serve EJS
app.get('/ejs', (req, res) => {
  res.render('index', {
    myServerVariable: "something from server"
  });
})

// read data
app.get('/read', async (req, res) => {
  await client.connect();
  let result = await client.db("jab-db").collection("dev-john(allen)").find({}).toArray();
  console.log(result);
  
  res.render('mongo', {
    postData: result
  });
})

// hardcode mongodb
app.get('/insert', async (req, res) => {
  await client.connect();
  await client.db("jab-db").collection("dev-john(allen)").insertOne({ post: 'hardcoded post insert' });
  await client.db("jab-db").collection("dev-john(allen)").insertOne({ iJustMadeThisUp: 'hardcoded new key' });
  
  res.render('insert');
})

// Update mongodb
app.post('/update/:id', async (req, res) => {
  await client.connect();
  const collection = client.db("jab-db").collection("dev-john(allen)");
  let result = await collection.findOneAndUpdate(
    { "_id": new ObjectId(req.params.id) },
    { $set: { "post": "NEW POST" } }
  );
  
  console.log(result);
  res.redirect('/read');
})

// Delete on mongodb
app.post('/delete/:id', async (req, res) => {
  await client.connect();
  const collection = client.db("jab-db").collection("dev-john(allen)");
  let result = await collection.findOneAndDelete(
    { "_id": new ObjectId(req.params.id) }
  );
  
  console.log(result);
  res.redirect('/read');
})

// server
app.listen(5500, () => {
  console.log('Server is on port 5500');
});
