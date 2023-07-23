const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.ENV_DB_USER}:${process.env.ENV_DB_PASS}@cluster0.ph1akes.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

 //  College Collection
 const collegeCollection = client.db("college").collection("collegeinfo");


// get university data
app.get("/university", async (req, res) => {
  const result =await collegeCollection.find().toArray();
  res.send(result);
});

// get single data from id
app.get("/postdata/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const filter = { _id: new ObjectId(id)};
  const result = await collegeCollection.findOne(filter);
  res.send(result);
});

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("college running with server!");
});

app.listen(port, () => {
  console.log(`college running on port ${port}`);
});
