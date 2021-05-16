const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;


const port = process.env.port || 5055;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hbvm0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const foodCollection = client.db("buyfood").collection("products");
    const ordersCollection = client.db("buyfood").collection("order1");
    console.log(err);

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

   

      app.get("/product/:_id", (req, res) => {
        foodCollection
            .find({ _id: ObjectId(req.params._id) })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });


      app.delete("/delete/:_id", (req, res) => {
        console.log("id:", req.params._id)
    
        foodCollection.deleteOne({ _id: ObjectId(req.params._id) })
            .then((result) => {
                console.log(result);
                res.send(result.deletedCount > 0)
            })
    })


    app.post("/addOrder", (req, res) => {
      const order = req.body;
      ordersCollection.insertOne(order).then((result) => {
          res.send(result.insertedCount > 0);
      });
  });

  app.get("/orders", (req, res) => {
    ordersCollection
        .find({ email: req.query.email })
        .toArray((err, items) => {
            res.send(items);
        });
});




      
      app.get('/', (req, res) => {
          res.send('Its working');
      })


});



app.listen(process.env.PORT || port)