import Chat from "../../model/chatModel.js"

export const createGroupChat = async(req,res) =>{
    try {
        const {groupName, usersArray} = req.body
        if(!groupName || !usersArray){
            throw new Error("Please fill all the fields")
        }
        else{
            if(usersArray.length < 2){
                throw new Error("Please add atleast 2 yours to start group chatting")
            }
            else{
                usersArray.push(req.user)

                const newGroupChat = new Chat({
                    chatName : groupName,
                    isGroupChat : true,
                    users : usersArray.map(user => user._id),
                    groupAdmin : req.user._id
                })
                const resultGrpChat = await newGroupChat.save()

                const newFoundChat = await Chat.findById(resultGrpChat._id).populate("users", "-password -confirmPassword").populate({
                    path:"latestMessage",
                    populate:{
                        path : "sender reciever",
                        select : "-password -confirmPassword"
                    }
                }).populate("groupAdmin", "-password -confirmPassword")
                
                // console.log(newGroupChat)

                return res.status(200).json({result : newFoundChat, error : null, message : "Group chat created"})
            }
        }
    } catch (error) {
        return res.status(400).json({result : null, error : error.message, message : "something went wrong while creating chats"})
    }
}