import mongoose from 'mongoose'

const messages= new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile",
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile",
    },
    message:{
        type:String,
        required:true
    },
    read:{
        type:Boolean,
        default:false,
    },
    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "room",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model('messages',messages)