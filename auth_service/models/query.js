import mongoose from "mongoose";
import user from "./user";

const Schema = mongoose.Schema;

let Query = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    prescriptions: {
        type: Array,
    }
});

export default mongoose.model('Query', Query);