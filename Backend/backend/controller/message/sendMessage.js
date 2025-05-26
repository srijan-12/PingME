import Chat from "../../model/chatModel.js";
import Message from "../../model/messageModel.js"
export default async function sendMessage(req,res){
    try {
        const {content, chatId, reciever} = req.body;
        if(!content || !content.trim()){
            throw new Error("Enter a message to send");
        }
        if(!chatId){
            throw new Error("in-valid request, no chat found");
        }

        const loggedInUserId = req.user?._id;

        const foundChat = await Chat.findById(chatId);

        if(!foundChat){
            throw new Error("in-valid request, no chat found");
        }

        const newMessage = new Message({
            sender : loggedInUserId,
            content : content,
            reciever : reciever,
            chat :chatId
        })

        await newMessage.save();

        // console.log(newMessage._id)

        const newFoundMessage = await Message.findById(newMessage._id).populate("sender", "-password -confirmPassword").populate({
            path : "chat",
            populate : {
                path : "users",
                select : "-password -confirmPassword"
            }
        })

        if(!newFoundMessage){
            throw new Error("in-valid request, no newchat found");
        }

        const updateChatLatestMessage = await Chat.findByIdAndUpdate(chatId, {
            latestMessage : newMessage
        })

        console.log(newMessage);

        

        return res.status(200).json({result : newFoundMessage, error : null, message : "chat"})

    } catch (error) {
        console.log(error.message);
        return res.status(400).json({result : null, error : error.message, message : "error occured while sending new message"})
    }
}