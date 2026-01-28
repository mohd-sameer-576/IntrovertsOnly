import express from 'express'
import authRouter from './routes/auth.route.js'
import messageRouter from './routes/message.route.js'
import path from 'path'
import {connectDB} from './lib/db.js'
import {ENV} from './lib/env.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: ENV.NODE_ENV === "production" ? ENV.CLIENT_URL : "http://localhost:5173",
        credentials: true
    }
})

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000

// Store online users
const userSocketMap = {} // {userId: socketId}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id)
    
    const userId = socket.handshake.auth.userId
    if(userId) {
        userSocketMap[userId] = socket.id
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    }
    
    socket.on('sendMessage', (data) => {
        const {receiverId, text, image, senderId, messageId, _id} = data
        const receiverSocketId = userSocketMap[receiverId]
        
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', {
                _id: messageId || _id,
                senderId,
                text,
                image,
                sender: senderId,
                receiverId,
                createdAt: new Date()
            })
        }
    })
    
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id)
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ENV.NODE_ENV === "production" ? ENV.CLIENT_URL : "http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRouter)
app.use("/api/message", messageRouter)

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (_,res) =>{
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"))
    })
}
server.listen(PORT, ()=> {console.log("server is running on port:" + PORT)
    connectDB()
} )