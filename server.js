import express from "express"
import path from "path"
import  dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectMongoDB from "./db/connectMongoDB.js"
import authuRoutes from "./Routes/authu.route.js"
import busRoutes from "./Routes/bus.route.js"
import adminRoutes from "./Routes/adminRoutes.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path'
dotenv.config()
const app=express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const PORT=process.env.PORT || 5000

app.use(cookieParser())
app.use(express.json());

app.use("/api/auth",authuRoutes)
app.use("/api/bus",busRoutes)
app.use("/api/admin",adminRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, 'public')));

}

app.listen(PORT,()=>{
    console.log(`server is runing on port ${PORT}`)
    connectMongoDB()
})