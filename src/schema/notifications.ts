import { Schema } from "mongoose";
import mongoose from "mongoose";

const schema=new Schema({
    sender_id:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    reciever_id:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    type:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    read:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

schema.index({createdAt: 1},{expireAfterSeconds: 3600});

export default mongoose.model('notifications',schema);
