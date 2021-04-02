const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;


const port = process.env.port || 5055;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hbvm0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const foodCollection = client.db("buyfood").collection("products");

    app.post('/addFoods', (req, res) => {
        const newEvent = req.body;
        console.log('add', newEvent);
        foodCollection.insertOne(newEvent)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })
    //list of foods show in Database
    app.get('/foods', (req, res) => {
        foodCollection.find()
        .toArray((err,items)=>{
            res.send(items);
            // console.log('from database', items);
        })
    })

    //get single product by id
    app.get('/addProduct/_:id', (req, res) => {
        foodCollection
          .find({ _id: ObjectId(req.params._id) })
          .toArray((err, documents) => {
            res.send(documents[0]);
          });
      });
      



});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})