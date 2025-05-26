import Chats from "../../model/chatModel.js"
import Users from "../../model/userModel.js"
export default async function accessChat(req,res){
    try {
        const {chatWithUserId} = req.body
        const foundPreviousChat = await Chats.find({
            isGroupChat : false,
            $and : [{users: {$elemMatch : {$eq : chatWithUserId}}},
                    {users : {$elemMatch : {$eq : req.user._id}}}]
        }).populate("users", "-password -confirmPassword").populate({
            path : "latestMessage",
            populate : {
                path : "sender reciever",
                select : "-password -confirmPassword"
            }
        }) //senderid, recieverid, content
        if(foundPreviousChat.length > 0){
            return res.status(200).json({result : foundPreviousChat[0], error : null, message : "chat exists"})
        }else{
            const chatWithUserName = await Users.findById(chatWithUserId).select("name")
            if(!chatWithUserName){
                throw new Error("The user does not exists")
            }
            const newChat = new Chats({
                chatName : chatWithUserName.name,
                isGroupChat : false,
                users : [
                    chatWithUserId,
                    req.user._id
                ]
            })
            await newChat.save()
            const chatResult = await newChat.populate("users", "-password -confirmPassword")
            return res.status(200).json({result : chatResult, error : null, message : "chat created"})
        }
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({result : null, error : error.message, message : "something went wrong while creating chats"})
    }
}