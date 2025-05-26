import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender : {
        type : Schema.Types.ObjectId,
        ref : "Users",
        required : true
    },
    content : {
        type : String,
        trim : true,
        required : true
    },
    reciever : {
        type : Schema.Types.ObjectId,
        ref : "Users",
    },
    chat :{
        type : Schema.Types.ObjectId,
        ref : "Chat",
        required : true
    }
}, {timestamps : true})

const Message = mongoose.model("Message", messageSchema)

export default Message