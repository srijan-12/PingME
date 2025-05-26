import mongoose from "mongoose"
import Chat from "../../model/chatModel.js"
import Users from "../../model/userModel.js"

export const addUserToGroup = async(req,res) =>{
    try {
        const {chatId , userId} = req.body
        const currentLoggedInUserId = req.user._id
        if(!chatId || !userId){
            throw new Error("in-valid request")
        }
        const foundChat = await Chat.findById(chatId)
        const userToBeAdded = await Users.findById(userId)

        // console.log(foundChat, userToBeAdded)

        if(!foundChat || !userToBeAdded){
            throw new Error("in-valid request")
        }

        //admin check -> duplicate user check -> then added and popluated
        if(currentLoggedInUserId.equals(foundChat.groupAdmin)){

            const checkUserAlreadyInGrp = await Chat.findOne({
                _id : chatId,
                users : userId
            })

            if(checkUserAlreadyInGrp){
                throw new Error("User already in group")
            }

            const newChat = await Chat.findByIdAndUpdate(chatId, {
                $push : {users : userId}
            },{new : true}).populate("users", "-password -confirmPassword").populate("groupAdmin").populate({
                path : "latestMessage",
                populate : {
                    path : "sender reciever",
                    select : "-password -confirmPassword"
                }
            })
            return res.status(200).json({result : newChat, error :null, message : "user successfully added!"})
        }else{
            throw new Error("Only admins can add new users")
        }
    } catch (error) {
        return res.status(400).json({result : null, error :error.message, message : "Failed to add user to this group"})
    }
}