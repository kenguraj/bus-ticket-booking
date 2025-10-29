import { generatedToken } from "../token/generatedToken.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }


    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    generatedToken(newUser._id, res);

    
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });

  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const login =async(req,res)=>{
try{
const {username,password}=req.body
const user=await User.findOne({username})
const ispassword=await bcrypt.compare(password, user?.password || "")

if(!user || !ispassword){
  return res.status(400).json({error:"invaild username or password"})
}

generatedToken(user._id,res)

res.status(200).json({
  _id:user._id,
  username:user.username,
  email:user.email
})
}catch(error){
  console.error("error in login page",error.message)
  res.status(500).json({error:"invaild server"})
}
}

export const logout =async(req,res)=>{
  try{
res.cookie("jwt","",{maxAge:0})
res.status(200).json({message:"logout successfuly"})
  }catch(error){
    console.error("error in logout page",error.message)
  res.status(500).json({error:"invaild server"})
  }
}

export const getme=async(req,res)=>{
  try{
const user=await User.findById(req.user._id).select("-password")
res.status(200).json(user)
  }catch(error){
 console.error("error in getme page",error.message)
  res.status(500).json({error:"invaild server"})
  }
}

