const express = require('express');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT  || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.owgtc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('connected to databse');

    const database = client.db('onlineFoodDelivery');
    console.log('database');
    const servicesCollection = database.collection('services');
    const ordersCollection = database.collection('orders');

    //GET API
    app.get('/services', async(req,res)=>{
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //GET DETAILS

    app.get('/showDetails/:id', async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id:ObjectId(id)};

      const result = await servicesCollection.findOne(query);
      res.json(result);
    })

    //GET  API ORDERS
    app.get('/myOrders', async(req,res)=>{
      const  cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    })

    //Get MY ALL ORDERS API
    app.get('/myAllOrders/:email', async (req,res)=>{
      const email = req.params.email;
      console.log(email);
      // const query = ;
      // console.log(query);
      const result = await ordersCollection.find({userEmail:email}).toArray();
      console.log(result);
      res.send(result);

    });

    //GET API MANAGING ALL ORDERS
    app.get('/managingAllOrders', async(req,res)=>{
      const cursor = await ordersCollection.find({}).toArray();
      res.send(cursor);
    })

    //Post API
    app.post('/services', async (req, res) => {
      const service = req.body;
        // console.log('hit the post api', service);
       
      
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result)
      
      });

      //POST API MY ORDERS
      app.post('/myOrders', async(req,res)=>{
         const orders = req.body;
        //  console.log(orders)
        const result = await ordersCollection.insertOne(orders);
        res.json(result);
      });
      
      //DELETE API
      app.delete('/deleteOrder/:id', async(req,res)=>{
        const result = await ordersCollection.deleteOne({_id:ObjectId(req.params.id)});
        res.send(result);
      });

      //PUT API
      app.put('/managingAllOrders', async(req,res)=>{
         console.log(req.body);
         const filter= {_id:ObjectId(req.body.idName)};
         console.log(filter);
         const updateDoc = {
          $set: {
            status : `approve`
          },

        };
        const result = await ordersCollection.updateOne(filter, updateDoc);
        res.send(result);

      
      })
    }
  
finally {
      // await client.close();
    }

  }

run().catch(console.dir);

  app.get('/', (req, res) => {
    res.send('online food delivery server running');
  });

  app.listen(port, () => {
    console.log('running the server on port', port);
  })