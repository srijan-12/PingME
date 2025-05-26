import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    chatName : {
        type : String,
        trim : true,
        required : true
    },
    isGroupChat : {
        type : Boolean,
        required : true
    },
    users : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    }],
    latestMessage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Message"
    },
    groupAdmin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    }
},{
    timestamps : true
})

const Chat = mongoose.model("Chat", chatSchema)
export default Chat