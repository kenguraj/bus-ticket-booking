import mongoose from "mongoose";

const adminSchema=new mongoose.Schema({
     username:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true, 
            minLength:6
        },
       role:{
        type:String,
        default:"admin"
       }

},{timestamps:true})

const Admin=mongoose.model("Admin",adminSchema)
export default Admin