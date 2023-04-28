import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongosse from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

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

const client = new MongoClient(process.env.CONNECTION_URL);

const PORT = process.env.PORT || 3002

mongosse.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(PORT, ()=>console.log(`user service running on PORT ${PORT}`)))
.catch((error)=>console.log(error));