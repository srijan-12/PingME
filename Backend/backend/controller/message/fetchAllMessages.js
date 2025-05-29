import Chat from "../../model/chatModel.js";
import Message from "../../model/messageModel.js";

export default async function fetchAllMessages(req, res){
    try {
        const {chatId} = req.params;
        const foundChat = await Message.find({chat : chatId}).populate("sender", "-password -confirmPassword").populate({
            path : "chat",
            populate : {
                path : "users",
                select : "-password -confirmPassword"
            }
        }).populate({
            path : 'chat',
            populate : {
                path : 'latestMessage'
            }
        }).populate({
            path : 'chat',
            populate :{
                path :  'groupAdmin',
                select : '-password -confirmPassword'
            }
        });
        if(foundChat.length < 1){
            return res.status(200).json({result : null, error : null, message : "all messages"})
        }
        return res.status(200).json({result : foundChat, error : null, message : "all messages"})
    } catch (error) {
       return res.status(400).json({result : null, error : error.message, message : "failed to fetch messages"})
    }
}