import mongoose from "mongoose";
import { Schema } from "mongoose";
const room = new Schema({
    name: {
        type: String,
        required: true
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
export default mongoose.model('room', room);
