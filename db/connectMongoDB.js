import mongoose from "mongoose";

const connectMongoDB=async()=>{
    try{
const connect=await mongoose.connect(process.env.MONGO_URL)
console.log(`MongoDB CONNECTED: ${connect.connection.host}`)
    }catch(error){
console.error(`error connection to  mongodb: ${error.message}`)
process.exit(1)
    }
}

export default connectMongoDB