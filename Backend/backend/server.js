import express from "express"
import {chats} from "./data/data.js"
import {configDotenv} from "dotenv"
import cors from "cors"
import { connectToDB } from "./database/dbConfig.js"
import userRouter from "./router/userRouter.js"
import cookieParser from 'cookie-parser';
import chatRouter from "./router/chatRouter.js"
import messageRouter from "./router/messageRouter.js"
import {createServer} from 'http'
import {Server} from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server,{
    cors : {
        origin: 'http://localhost:5173'
    },
    pingTimeout : 300000
});

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


io.on("connection", (socket)=>{
    console.log('connected to socket.io')

    //as soon as user will get loggedin to our app they will join this room
    socket.on("joinApplication", (userData)=>{
        socket.join(userData);
        // console.log('user joined the app ',userData)
        socket.emit('joinedApplicationSucessfully')
    })

    socket.on("join room", (roomId)=>{
        socket.join(roomId);
        // console.log('User joined the room', roomId)
    })

    socket.on('send message', (messageData)=>{
        let chat = messageData?.chat
        if(!chat?.users || chat?.users.length < 1) return console.log(`chat?.users is undefined`)

        //if we are sewnding a message we want that the message is recieved by the other user of the group or single chat

        chat?.users?.forEach((user)=>{
            if(messageData?.sender?._id === user._id){
                return
            }
            socket.in(user._id).emit('recieve message', messageData)
        })
    })

    socket.on('typing', (roomId)=>{
        // console.log('typing emitting to room ', roomId)
        socket.in(roomId).emit('typing',roomId)
    })

    socket.on('stop typing', (roomId)=>{
        socket.in(roomId).emit('stop typing')
    })

    socket.on('leave chat',(chatRoomId)=>{
        socket.leave(chatRoomId);
        // console.log('user left the chat')
    })

    socket.on('Group created', (userIdArr)=>{
    userIdArr.forEach((userId)=>{
        io.to(userId).emit('Group created');
    });
});

    socket.on('leave group', (usersArr)=>{
        usersArr.forEach((user)=>{
            let userId = user._id
        io.to(userId).emit('leave group');
    });
    })

    socket.on('update group', (usersArr)=>{
        usersArr.forEach((user)=>{
            let userId = user._id
        io.to(userId).emit('update group');
    });
    })

    socket.on('added to group', (userId)=>{
        socket.in(userId).emit('added to group')
    })



    socket.on('disconnect', () => {
    console.log('User disconnected');
});
})



//page not found should be added to avoid unnecessary url requests


server.listen(PORT,()=>{
    connectToDB().then(()=>{
        console.log("DB connected")
        console.log("Server started")
    }).catch((e)=>{
        console.log("failed to connect to db",e)
    })
})