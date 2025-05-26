import Chat from "../../model/chatModel.js"
import Users from "../../model/userModel.js"
export const removeUserFromGroup = async(req, res) =>{
    try {
        const {chatId , userId} = req.body
        const currentLoggedInUserId = req.user._id
        if(!chatId || !userId){
            throw new Error("in-valid request")
        }
        const foundChat = await Chat.findById(chatId)
        const userToBeRemoved = await Users.findById(userId)

        // console.log(foundChat, userToBeRemoved)

        if(!foundChat || !userToBeRemoved){
            throw new Error("in-valid request")
        }

        //admin check -> user exists in group -> then added and popluated
                if(currentLoggedInUserId.equals(foundChat.groupAdmin) || currentLoggedInUserId.equals(userId)){

                    const checkUserAlreadyInGrp = await Chat.findOne({
                        _id : chatId,
                        users : userId
                    })

                    if(!checkUserAlreadyInGrp){
                        throw new Error("in-valid request user not in group!")
                    }

                    const newChat = await Chat.findByIdAndUpdate(chatId, {
                        $pull : {users : userId}
                    },{new : true}).populate("users", "-password -confirmPassword").populate("groupAdmin").populate({
                        path : "latestMessage",
                        populate : {
                            path : "sender reciever",
                            select : "-password -confirmPassword"
                        }
                    })
                    return res.status(200).json({result : newChat, error :null, message : "user successfully removed!"})
                }else{
                    throw new Error("Only admins can remove users")
                }

    } catch (error) {
        return res.status(400).json({result : null, error :error.message, message : "Failed to remove user to this group"})
    }
}