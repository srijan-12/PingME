import express from "express"
import {chats} from "./data/data.js"
import {configDotenv} from "dotenv"
import cors from "cors"
import { connectToDB } from "./database/dbConfig.js"
import userRouter from "./router/userRouter.js"
import cookieParser from 'cookie-parser';
import chatRouter from "./router/chatRouter.js"
import messageRouter from "./router/messageRouter.js"

const app = express()
app.use(cookieParser())
configDotenv()
const PORT = process.env.PORT||3001

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))
app.use(express.json())

app.use("/api/users", userRouter)
app.use("/api/chats", chatRouter)
app.use("/api/message", messageRouter)






//page not found should be added to avoid unnecessary url requests


app.listen(PORT,()=>{
    connectToDB().then(()=>{
        console.log("DB connected")
        console.log("Server started")
    }).catch((e)=>{
        console.log("failed to connect to db",e)
    })
})