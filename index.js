const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9njqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db('tutorial-db')
    const tutorialCollection = db.collection('tutor')
    const bookCollection = db.collection('book')

    // save book in the server
    app.post('/add-book',async(req,res)=>{
        const bookData = req.body;
        // delete bookData._id
        const result = await bookCollection.insertOne(bookData);
        res.send(result)
        // console.log(tutorData)
    })

    app.get('/books',async(req,res)=>{
        const result = await bookCollection.find().toArray();
        res.send(result)
    })

    // get all books for a specific user
    app.get('/books/:email',async(req,res)=>{
        const email = req.params.email;
        const query = {userEmail:email}
        console.log(email)
        const result = await bookCollection.find(query).toArray();
        res.send(result);
        console.log(result)
    })


    // save data in the server
    app.post('/tutorials',async(req,res)=>{
        const tutorData = req.body;
        const result = await tutorialCollection.insertOne(tutorData);
        res.send(result)
        // console.log(tutorData)
    })

    // get all tutors
    app.get('/all-tutors',async(req,res)=>{
        const result = await tutorialCollection.find().toArray();
        res.send(result);
    })

    // get all tutorials posted by user
    app.get('/tutor/:email',async(req,res)=>{
        const email = req.params.email;
        const query = {'tutor.email': email};
        const result = await tutorialCollection.find(query).toArray();
        res.send(result);
    })

    // get for delete
    app.delete('/tutor/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await tutorialCollection.deleteOne(query);
        res.send(result);
    })

    // get a single data
    app.get('/all-tutors/:id',async(req,res)=>{
        const id = req.params.id;
        console.log('single id',id)
        const query = {_id: new ObjectId(id)};
        const result = await tutorialCollection.findOne(query);
        res.send(result);
    })

    // get for update 
    app.put('/update-tutor/:id',async(req,res)=>{
        const id = req.params.id;
        const tutorData = req.body;
        const update = {
            $set: tutorData,
        }
        const query = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const result = await tutorialCollection.updateOne(query,update,options);
        res.send(result);
    })
    
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('assignment-11 is running')
})

app.listen(port, ()=>{
    console.log(`assignment 11 running on port: ${port}`)
})