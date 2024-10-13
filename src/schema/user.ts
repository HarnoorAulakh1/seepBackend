import mongoose from 'mongoose';
import {Schema} from 'mongoose';

mongoose.connect('mongodb://localhost:27017/seep');

const schema=new Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true,
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    websites:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"website",
    },
    status:{
        type:String,
        required:true,
    }
})

export default mongoose.model('user',schema);