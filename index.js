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
 const studentCollection = client.db("college").collection("student");
 const feedbackCollection = client.db("college").collection("feedback");


// get university data
app.get("/university", async (req, res) => {
  const result =await collegeCollection.find().toArray();
  res.send(result);
});

// get single data from id
app.get("/postdata/:id", async (req, res) => {
  const id = req.params.id;
  
  const filter = { _id: new ObjectId(id)};
  const result = await collegeCollection.findOne(filter);
  res.send(result);
});

// insert student data
app.post("/postdata", async (req, res) => {
  const body = req.body;
  const result = await studentCollection.insertOne(body);
  res.send(result);
});
// get student data
app.get("/users/:email", async (req, res) => {
  const result = await studentCollection
    .find({enroll_email: req.params.email })
    .toArray();
  res.send(result);
});
// insert feedback data
app.post("/feedback", async (req, res) => {
  const body = req.body;
  const result = await feedbackCollection.insertOne(body);
  res.send(result);
});

// get feedback data
app.get("/feedbackdata", async (req, res) => {
  const result =await feedbackCollection.find().toArray();
  res.send(result);
});

// get single data from id
app.get("/studentdata/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id)};
  const result = await studentCollection.findOne(filter);
  res.send(result);
});
// update student data
app.put("/updatedata/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = req.body;
  const update = {
    $set: {
      name: updateDoc.name,
      email: updateDoc.email,
      college_name: updateDoc.college_name,
      address: updateDoc.address,

    },
  };
  const result = await studentCollection.updateOne(
    filter,
    update,
    options
  );
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
