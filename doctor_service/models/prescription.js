import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Prescription = new Schema({
    doctorname: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

export default mongoose.model('Prescription', Prescription);