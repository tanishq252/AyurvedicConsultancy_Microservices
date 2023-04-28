import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongosse from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import User from './models/user.js';
import Query from './models/query.js';


// initializing the app
const app  = express();
dotenv.config();

// cross origin resource sharing
app.use(cors());

// for images and posting data
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

// simple get request
app.get('/userService', (req, res)=>{
    res.send("userService");
})

// create a query
app.post('/userService/:uid/query', async (req, res) => {
    try{
        const userId = req.params.uid;
        const user = await User.findById(userId);
        console.log(user);
        if(!user){
            return res.status(402).json({message: "No user exists with given id"})
        }
        const newQuery = new Query({
            userID: req.params.uid,
            body: req.body.body,
            prescriptions: []
        })
        const query = await newQuery.save();
        return res.status(200).json({message:"query created successfully", query: query})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
})

// get all the queries
app.get('/userService/queries', async (req, res) => {
    try{
        const queries = await Query.find();
        return res.status(200).json(queries)
    }catch(error){
        return res.status(500).json({error:error.message})
    }
})

const PORT = process.env.PORT || 3002

mongosse.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(PORT, ()=>console.log(`user service running on PORT ${PORT}`)))
.catch((error)=>console.log(error));