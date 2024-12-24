const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const logger = (req, res, next) => {
    console.log('inside the api')
    next();
}

const verifyToken = (req, res, next) => {
    // console.log('inside the verify', req.cookies)
    const token = req?.cookies?.token;

    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' })
        }
        req.user = decoded;
        next();
    })
}

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

        // jwt token related
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '5h' });
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: false, // http://localhost:5173/login
                })
                .send({ success: true });
        })

        app.post('/logout',async(req,res)=>{
            res
            .clearCookie('token',{
                httpOnly: true,
                secure: false
            })
            .send({ success: true });
        })


        // save book in the server
        app.post('/add-book', async (req, res) => {
            const bookData = req.body;
            const result = await bookCollection.insertOne(bookData);
            res.send(result)
        })

        app.get('/books', async (req, res) => {
            const result = await bookCollection.find().toArray();
            res.send(result)
        })

        // get all books for a specific user
        app.get('/books/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const result = await bookCollection.find(query).toArray();
            res.send(result);
        })


        // save data in the server
        app.post('/tutorials', async (req, res) => {
            const tutorData = req.body;
            const result = await tutorialCollection.insertOne(tutorData);
            res.send(result)
            // console.log(tutorData)
        })

        // get all tutors
        app.get('/all-tutors', logger, async (req, res) => {
            console.log('this is logger')
            // console.log('token',req.cookies)
            const result = await tutorialCollection.find().toArray();
            res.send(result);
        })

        // get all tutorials posted by user
        app.get('/all-tutors/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            const query = { email };

            if(req.user.email !== req.params.email){
                return res.status(403).send({message: 'forbidden access'})
            }
            const result = await tutorialCollection.find(query).toArray();
            res.send(result);
        })

        // get for delete
        app.delete('/tutor/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tutorialCollection.deleteOne(query);
            res.send(result);
        })

        // get a single data
        app.get('/all-tutor/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tutorialCollection.findOne(query);
            res.send(result);
        })

        // get for update 
        app.put('/update-tutor/:id', async (req, res) => {
            const id = req.params.id;
            const tutorData = req.body;
            const update = {
                $set: tutorData,
            }
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const result = await tutorialCollection.updateOne(query, update, options);
            res.send(result);
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('assignment-11 is running')
})

app.listen(port, () => {
    console.log(`assignment 11 running on port: ${port}`)
})