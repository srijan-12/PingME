import {Router} from "express"
import authCheck from "../middlewares/authCheck.js"
import sendMessage from "../controller/message/sendMessage.js";
import recieveMessage from "../controller/message/recieveMessage.js";
import { fetchAllChats } from "../controller/chat/fetchAllChats.js";
import fetchAllMessages from "../controller/message/fetchAllMessages.js";
const messageRouter = Router();

messageRouter.post("/sendMessage", authCheck, sendMessage);
messageRouter.get("/recieveMessage/:chatId", authCheck, recieveMessage);
messageRouter.get("/fetchAllMessages/:chatId", authCheck, fetchAllMessages);

export default messageRouter;