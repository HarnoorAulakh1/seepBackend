import { Schema } from "mongoose";
import mongoose from "mongoose";

const site=new Schema({
    owner:{
        type:String,
    },
    url:{
        type:String,
        required:true,
    },
    total_users:{
        type:Object,
    },
    new_signups:{
        type:Number,
    },
    live_users:{
        type:Number,
    }
})

export default mongoose.model('website',site);