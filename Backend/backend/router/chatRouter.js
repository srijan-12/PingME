import {Router} from "express"
import authCheck from "../middlewares/authCheck.js"
import accessChat from "../controller/chat/accessChat.js"
import { fetchAllChats } from "../controller/chat/fetchAllChats.js"
import { createGroupChat } from "../controller/chat/createGroupChat.js"
import { renameChat } from "../controller/chat/renameChat.js"
import { addUserToGroup } from "../controller/chat/addUserToGroup.js"
import { removeUserFromGroup } from "../controller/chat/removeUserFromGroup.js"
const chatRouter = Router()

chatRouter.post("/accessChat", authCheck, accessChat)
chatRouter.get("/allChats", authCheck, fetchAllChats)
chatRouter.post("/createGroupChat", authCheck, createGroupChat)
chatRouter.patch("/renameGroup", authCheck, renameChat)
chatRouter.patch("/addUser", authCheck, addUserToGroup)
chatRouter.patch("/removeUser", authCheck, removeUserFromGroup)


export default chatRouter