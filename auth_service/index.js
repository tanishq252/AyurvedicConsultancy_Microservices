import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongosse from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import User from './models/user.js';
import Doctor from './models/doctor.js';

// mongo db client
// const client = new MongoClient(process.env.CONNECTION_URL);

// initializing the app
const app  = express();
dotenv.config();

// cross origin resource sharing
app.use(cors());

// for images and posting data
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

// simple get request
app.get('/authService', (req, res)=>{
    res.send("authService");
})

// signup
app.post('/authService/signup', async (req, res) => {
    const{client, email} = req.body;
    if(req.body.client == "doctor"){
        try{
            const emailExist = await Doctor.findOne({email:email})
            console.log(`${emailExist}`);
            if(emailExist){
                return res.status(400).json("This email already exists!")
            }
            else{
                const {doctorname, password, registrationNo} = req.body;
                console.log(doctorname + " " + password);
                const newDoctor = new Doctor({
                    doctorname: doctorname,
                    email: email,
                    password: password,
                    client: client,
                    registrationNo: registrationNo
                })
                console.log(newDoctor);
                const doctor = await newDoctor.save();
                // return res.status(200).json(doctor)
                return res.status(200).json({"doctor": doctor, "message": "doctor created successfully!"});
            }
        }catch(error){
            res.status(500).json({error:error.message});
        }
    }else{
        try{
            const emailExist = await User.findOne({email:email})
            if(emailExist){
                return res.status(400).json("This email already exists!")
            }
            else{
                const {username, password} = req.body;
                const newUser = new User({
                    username: username,
                    email: email,
                    password: password,
                    client: client,
                    queries: []
                })
                const user = await newUser.save();
                return res.status(200).json({"user": user, "message": "user created successfully!"});
            }
        }catch(error){
            res.status(500).json({error:error.message});
        }
    }
})

// sign in
app.post('/authService/signin', async(req, res) => {
    const {client, email} = req.body;
    if(req.body.client == "doctor"){
        try{
            const doctor = await Doctor.findOne({email: email});
            if(!doctor){
                return res.status(402).json("No such doctor exists")
            }
            if(req.body.password != doctor.password){
                return res.status(402).json("Password does not match for any of the doctor")
            }
            res.status(200).json(doctor)
        }catch(error){
            res.status(500).json({error:error.message})
        }
    }else{
        try{
            const user = await User.findOne({email: email});
            if(!user){
                return res.status(402).json("No such user exists")
            }
            if(req.body.password != user.password){
                return res.status(402).json("Password does not match for any of the user")
            }
            res.status(200).json(user)
        }catch(error){
            res.status(500).json({error:error.message})
        }
    }
})

const PORT = process.env.PORT || 3000

mongosse.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(PORT, ()=>console.log(`auth service running on PORT ${PORT}`)))
.catch((error)=>console.log(error));