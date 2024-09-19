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

console.log('Server connected');

//create MongoClient
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
    console.log("Pinged your deployment. You have been connected to MongoDB");
  } finally {
    
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', function (req, res) {
  res.sendFile('index.html');
})

app.get('/ejs', (req,res)=>{
``
  res.render('index', {
    myServerVariable : "something from server"
  });
})

app.get('/read', async (req,res)=>{

  console.log('in /mongo');
  await client.connect();
  
  console.log('connected?');
  //ping to confirm 
  
  let result = await client.db("jab-db").collection("dev-john(allen)")
    .find({}).toArray(); 
  console.log(result); 

  res.render('mongo', {
    postData : result
  });

})

app.get('/insert', async (req,res)=> {

  console.log('in /insert');
  await client.connect();
  await client.db("jab-db").collection("dev-john(allen)").insertOne({ post: 'hardcoded post insert '});
  await client.db("jab-db").collection("dev-john(allen)").insertOne({ iJustMadeThisUp: 'hardcoded new key '});  
  res.render('insert');

}); 

app.post('/update/:id', async (req,res)=>{

  console.log("req.parms.id: ", req.params.id)

  client.connect; 
  const collection = client.db("jab-db").collection("dev-john(allen)");
  let result = await collection.findOneAndUpdate( 
  {"_id": new ObjectId(req.params.id)}, { $set: {"post": "CUMBIE IS THE GOAT!!!!" } }
)
.then(result => {
  console.log(result); 
  res.redirect('/read');
})

});

app.post('/delete/:id', async (req,res)=>{

  console.log("req.parms.id: ", req.params.id)

  client.connect; 
  const collection = client.db("jab-db").collection("dev-john(allen");
  let result = await collection.findOneAndDelete( 
  {"_id": new ObjectId(req.params.id)})

.then(result => {
  console.log(result); 
  res.redirect('/read');
})

//port 3000

})
app.listen(5500)