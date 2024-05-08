const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c42djsb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const infoCollection = client.db("userInfoStore").collection("userInfoCollection");
    const infoCollectionAnother = client.db("userInfoStore").collection("userInfoCollectionAnother");

    app.post("/addInfo", async (req, res) => {
      console.log(req.body);
      const result = await infoCollection.insertOne(req.body);
      res.send(result)
    })

    app.get("/myInfo/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await infoCollection.find({
        email: req.params.email
      }).toArray();
      res.send(result)
    })
    

    // Second Second
    app.get("/anotherAllInfo/:country", async (req, res) => {
      console.log(req.params.country);
      const result = await infoCollectionAnother.find({
        country: req.params.country
      }).toArray();
      res.send(result)
    })

    app.get("/allInfo", async (req, res) => {
      const cursor = infoCollection.find();
      const allInfo = await cursor.toArray();
      res.send(allInfo);
    })

    // Second
    app.get("/anotherAllInfo", async (req, res) => {
      const cursor = infoCollectionAnother.find();
      const allInfo = await cursor.toArray();
      res.send(allInfo);
    })

    app.get("/singleInfo/:id", async (req, res) => {
      const result = await infoCollection.findOne({
        _id: new ObjectId(req.params.id)
      });
      res.send(result);
    })

    app.put("/updateInfo/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          spotName: req.body.spotName,
          location: req.body.location,
          seasonality: req.body.seasonality,
          visitor: req.body.visitor,
          country: req.body.country,
          cost: req.body.cost,
          travelTime: req.body.travelTime,
          imageUrl: req.body.imageUrl,
          description: req.body.description
          
        }
      }
      const result = await infoCollection.updateOne(query, data);
      res.send(result)
    })

    app.delete("/delete/:id", async (req, res) => {
      const result = await infoCollection.deleteOne({
        _id: new ObjectId(req.params.id)
      })
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Server Is Running.......');
});

app.listen(port, () => {
  console.log(`Server is Running on Port: ${port}`);
});



