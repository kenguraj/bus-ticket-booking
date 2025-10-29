import mongoose from "mongoose";
import { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema({
  bus: { 
    type: Schema.Types.ObjectId, 
    ref: "Bus", 
    required: true 
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",      
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  reviewDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
