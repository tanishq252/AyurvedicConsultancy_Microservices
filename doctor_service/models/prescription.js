import mongoose from "mongoose";
import user from "./user";

const Schema = mongoose.Schema;

let Prescription = new Schema({
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

export default mongoose.model('Prescription', Prescription);