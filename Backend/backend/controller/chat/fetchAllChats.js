import Chat from "../../model/chatModel.js"

export const fetchAllChats = async(req,res) =>{
    try {
        const user = req.user
        if(!user){
            throw new Error("un-authorised")
        }
        const allChats = await Chat.find({
            users : {$elemMatch : {$eq : user._id}}
        }).populate("users", "-password -confirmPassword").populate({
            path : "latestMessage",
            populate: {
                path : "sender reciever",
                select : "-password -confirmPassword"
            }
        }).populate("groupAdmin", "-password -confirmPassword")
        .sort({updatedAt : -1})
        if(allChats.length > 0){
            return res.status(200).json({result : allChats, error : null, message : "chats exists"})
        }else{
            return res.status(200).json({result : allChats, error : null, message : "no chat found"})
        }
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({result : null, error : error.message, message : "something went wrong while fetching chats"})
    }
}