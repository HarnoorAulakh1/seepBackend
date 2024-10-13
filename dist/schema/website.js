import { Schema } from "mongoose";
import mongoose from "mongoose";
const site = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    url: {
        type: String,
        required: true,
    },
    total_users: {
        type: Number,
    },
    new_signups: {
        type: Number,
    },
    live_users: {
        type: Number,
    }
});
export default mongoose.model('website', site);
