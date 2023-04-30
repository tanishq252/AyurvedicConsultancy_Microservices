import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongosse from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import User from './models/user.js';
import Query from './models/query.js';
import Prescription from './models/prescription.js';
import Doctor from './models/doctor.js';

// initializing the app
const app  = express();
dotenv.config();

// cross origin resource sharing
app.use(cors());

// for images and posting data
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

// simple get request
app.get('/doctorService', (req, res)=>{
    res.send("doctorService");
})

// create a prescription
app.post('/doctorService/:did/:qid/prescription', async (req, res) => {
    try{
        const docId = req.params.did;
        const doctor = await Doctor.findById(docId);
        console.log(doctor);
        if(!doctor){
            return res.status(402).json({message: "No doctor exists with given id"})
        }
        const queryId = req.params.qid;
        const qry = await Query.findById(queryId)
        if(!qry){
            return res.status(402).json({message: "No such query exists"})
        }
        const newPrescription = new Prescription({
            doctorname: doctor.doctorname,
            doctorId: docId,
            queryId: queryId,
            body: req.body.body,
        })
        const prescription = await newPrescription.save();
        qry.prescriptions.push(prescription._id)
        await Query.findByIdAndUpdate(queryId, {prescriptions: qry.prescriptions},{new:true})
        return res.status(200).json({message:"prescription created successfully", prescription: prescription, Query: qry})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
})

// update a prescription
app.patch('/doctorService/:pid', async(req, res) => {
    try{
        const prescId = req.params.pid;
        const presc = await Prescription.findById(prescId)
        if(!presc){
            return res.status(402).json({message: "No such prescription exists"})
        }
        const {body} = req.body;
        console.log(body);

        await Prescription.findByIdAndUpdate(prescId, {body: body},{new:true})

        return res.status(200).json({message: "prescription updated successfully", prescription : presc})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
})

// delete a prescription
app.delete('/doctorService/:qid/:pid', async(req, res) => {
    try{
        const prescId = req.params.pid;
        const presc = await Prescription.findById(prescId)
        if(!presc){
            return res.status(402).json({message: "No such prescription exists"})
        }

        const queryId = req.params.qid
        const qry = await Query.findById(queryId)

        // find the index of prescription in the prescriptions array of query
        const prescIndex = qry.prescriptions.findIndex((obj => obj._id == prescId))
        qry.prescriptions.splice(prescIndex, 1);

        await Query.findByIdAndUpdate(queryId, {prescriptions: qry.prescriptions},{new:true})

        await Prescription.findByIdAndDelete(prescId)

        return res.status(200).json({message: "deleted successfully", query: qry})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
})

// get all the queries
app.get('/doctorService/prescriptions', async (req, res) => {
    try{
        const prescriptions = await Prescription.find();
        return res.status(200).json(prescriptions)
    }catch(error){
        return res.status(500).json({error:error.message})
    }
})

const client = new MongoClient(process.env.CONNECTION_URL);

const PORT = process.env.PORT || 3001

mongosse.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(PORT, ()=>console.log(`doctor service running on PORT ${PORT}`)))
.catch((error)=>console.log(error));