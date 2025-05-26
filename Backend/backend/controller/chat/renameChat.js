import Chat from "../../model/chatModel.js"

export const renameChat = async(req,res) =>{
    try {
        const {chatId, newGroupName} = req.body
        const currentLoggedInUserId = req.user?._id
        if(!currentLoggedInUserId){
            throw new Error("un-authorised")
        }
        if(!chatId || !newGroupName?.trim()){
            throw new Error("Provide all required fields")
        }

        const foundChat = await Chat.findById(chatId)
        if(!foundChat){
            throw new Error("no such group exists")
        }
        //admin check then update
        if(currentLoggedInUserId.equals(foundChat.groupAdmin)){
            const updatedGroupName = await Chat.findByIdAndUpdate(chatId, {chatName: newGroupName}, {new: true}).populate("users", "-password -confirmPassword").populate("groupAdmin", "-password -confirmPassword").populate({
                path : "latestMessage",
                populate : {
                    path : "sender reciever",
                    select : "-password -confirmPassword"
                }
            })
            return res.status(200).json({result : updatedGroupName, error : null, message : "Name updated"})
        }
        else{
            throw new Error("Only admins can update Group name")
        }
    } catch (error) {
        return res.status(400).json({result : null, error : error.message, message : "Failed to Update Group name"})
    }
}