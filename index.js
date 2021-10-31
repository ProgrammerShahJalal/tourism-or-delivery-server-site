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

        const touristDatabase = client.db('world_tourist');
        const touristCollection = touristDatabase.collection('tourist');

        const bookingDatabase = client.db('booking_tour');
        const ordersCollection = bookingDatabase.collection('orders');

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
        // GET Single Tourist
        app.get('/allTourist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const tourist = await touristCollection.findOne(query);
            res.json(tourist);
        })
        // GET Single order
        app.get('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const order = await ordersCollection.findOne(query);
            res.json(order);
        })
        // DELETE API for tours
        app.delete('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await travelCollection.deleteOne(query);
            res.json(result);
        })
        // DELETE API for Tourist
        app.delete('/allTourist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await touristCollection.deleteOne(query);
            res.json(result);
        })
        // DELETE API for orders
        app.delete('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
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

        // ADD TOURIST
        app.post("/addTourist", async (req, res) => {
            console.log(req.body);
            const result = await touristCollection.insertOne(req.body);
            res.send(result);
        });
        // ADD ORDER
        app.post("/addOrders", async (req, res) => {
            console.log(req.body);
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        });

        // GET ALL TOURIST
        app.get("/allTourist", async (req, res) => {
            const result = await touristCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });
        // GET ALL ORDERS
        app.get("/allOrders", async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });

        // My Orders (specific orders according to email)
        app.get("/allOrders/:email", async (req, res) => {
            const result = await ordersCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        // DELETE API for orders according to email
        app.delete('/allOrders/:email', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

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