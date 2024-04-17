const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("welcome to clothing store server");
});

// GET request to get all the posts

app.get("/posts", async (req, res) => {
    const posts = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await posts.json();
    res.send(data);
});


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qwpvc8e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    
    const clothCollection = client.db("clothingStoreDb").collection("clothes");
    const productCollection = client.db("clothingStoreDb").collection("productCollection");
    const kidsCollection = client.db("clothingStoreDb").collection("kidsCategories");
  
    
    app.get("/clothes", async (req, res) => {
        const result = await clothCollection.find().toArray();
        res.send(result);
    });
    app.get("/products", async (req, res) => {
        const result = await productCollection.find().toArray();
        res.send(result);
    });
  



    app.get("/kids", async (req, res) => {
      const result = await kidsCollection.find().toArray();
      res.send(result);
      console.log(result)
  });
     
  app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await productCollection.findOne(query);
    res.send(result);
});




     app.put('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productCollection.insertOne(query);
        res.send(result);
    });
      
//     const result = await productCollection.find().toArray();
//     res.send(result);
// });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);










app.listen(port, () => {
    console.log(`Clothing store server listening on http://localhost:${port}`);
});