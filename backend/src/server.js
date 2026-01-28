import express from 'express'
import authRouter from './routes/auth.route.js'
import messageRouter from './routes/message.route.js'
import path from 'path'
import {connectDB} from './lib/db.js'
import {ENV} from './lib/env.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express();
const __dirname = path.resolve();
const PORT = ENV.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: ENV.CLIENT_URL, credentials: true}))
app.use("/api/auth", authRouter)
app.use("/api/message", messageRouter)

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("/", (_,res) =>{
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"))
    })
}
app.listen(PORT, ()=> {console.log("server is running on port:" + PORT)
    connectDB()
} )