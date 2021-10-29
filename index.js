const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tllgu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('world_tours');
        const travelCollection = database.collection('tours');

        // GET TOUR API
        app.get('/tours', async (req, res) => {
            const cursor = travelCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        })

        // GET Single Tour
        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const tour = await travelCollection.findOne(query);
            res.json(tour);
        })
        // DELETE API
        app.delete('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await travelCollection.deleteOne(query);
            res.json(result);
        })

        // POST API
        app.post('/tours', async (req, res) => {
            const tour = req.body;
            console.log('Hitting the post api', tour);
            const result = await travelCollection.insertOne(tour);
            console.log(result);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('World Tours is going on.');
});

app.listen(port, () => {
    console.log('World Tours server is running on port', port);
})