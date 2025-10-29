import { generatedToken } from "../token/generatedToken.js";
import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import Bus from "../models/bus.js";
import Booking from "../models/Booking.js"


export const signupadmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Admin username already exists" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });
    await newAdmin.save();

    generatedToken(newAdmin._id, res);

    res.status(201).json({
      _id: newAdmin._id,
      username: newAdmin.username,
      message: "Admin registered successfully",
    });

  } catch (error) {
    console.error("Error in admin signup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login =async(req,res)=>{
try{
const {username,password}=req.body
const admin=await Admin.findOne({username})
const ispassword=await bcrypt.compare(password, admin?.password || "")

if(!admin || !ispassword){
  return res.status(400).json({error:"invaild adminname or password"})
}

generatedToken(admin._id,res)

res.status(200).json({
  _id:admin._id,
  username:admin.username,

})
}catch(error){
  console.error("error in adminlogin page",error.message)
  res.status(500).json({error:"invaild server"})
}
}

export const logout =async(req,res)=>{
  try{
res.cookie("jwt","",{maxAge:0})
res.status(200).json({message:"adminlogout successfuly"})
  }catch(error){
    console.error("error in logout page",error.message)
  res.status(500).json({error:"invaild server"})
  }
}

export const getme=async(req,res)=>{
  try{
const admin=await Admin.findById(req.admin._id).select("-password")
if(!admin){
  return res.status(400).json({error:"admin not found"})
}
res.status(200).json(admin)
  }catch(error){
 console.error("error in getme page",error.message)
  res.status(500).json({error:"invaild server"})
  }
}

export const createBus = async (req, res) => {
  try {
    const {
      busName,
      busNumber,
      totalSeats,
      from,
      to,
      bustype,
      image,
      pickupLocation,
      dropLocation,
      pickupTime,
      dropTime,
      startDate,
      endDate,
      seats, 
    } = req.body;

    
    if (
      !busName ||
      !busNumber ||
      !totalSeats ||
      !from ||
      !to ||
      !bustype ||
      !pickupLocation ||
      !dropLocation ||
      !pickupTime ||
      !dropTime ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: "At least one seat must be added" });
    }
    for (const seat of seats) {
      if (!seat.seatNumber || !seat.seatType || !seat.price) {
        return res.status(400).json({
          error: "Each seat must have seatNumber, seatType, and price",
        });
      }
    }

    const newBus = new Bus({
      busName,
      busNumber,
      totalSeats,
      from,
      to,
      bustype,
      image,
      pickupLocation,
      dropLocation,
      pickupTime,
      dropTime,
      startDate,
      endDate,
      seats,
    });

    await newBus.save();

    return res.status(201).json({
      message: "Bus created successfully",
      bus: newBus,
    });
  } catch (error) {
    console.error("Error in createBus:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updatebus = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedBus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    res.status(200).json(updatedBus);
  } catch (error) {
    console.error("Error in updateBus:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteticket =async(req,res)=>{
  try{
const {id}=req.params
const deleteTicket=await Booking.findByIdAndDelete(id)
if(!deleteTicket){
  return res.status(404).json({error:"ticket not found"})
}
res.status(200).json({error:"deleted successfuly"})
  }catch(error){
     console.error("Error in deleteticket:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const deletebus=async(req,res)=>{
  try{
const {id}=req.params

const bus=await Bus.findByIdAndDelete(id)
if(!bus){
  res.status(404).json({error:"deleted bus sussfuly"})
}

res.status(200).json({message:"deleted bus succesfuly"})
  }catch(error){
console.error("Error in deletebus:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
//admin get all cancelled ticket
export const getCancelledBookings = async (req, res) => {
  try {
    // Only admins should access this endpoint — you can verify via middleware
    const cancelledBookings = await Booking.find({ status: "cancelled" })
      .populate("bus", "busName busNumber") 
      .populate("user", "username email")   
      .sort({ cancelledAt: -1 });           

    if (cancelledBookings.length === 0) {
      return res.status(200).json({ message: "No cancelled bookings found." });
    }

    res.status(200).json({
      success: true,
      count: cancelledBookings.length,
      cancelledBookings,
    });
  } catch (error) {
    console.error("Error fetching cancelled bookings:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};