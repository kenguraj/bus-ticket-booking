import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  seatType: {
    type: String,
    enum: [
      "seater",
      "sleeper",
      "AC seater",
      "AC sleeper",
      "Non-AC seater",
      "Non-AC sleeper",
      
    ],
    required: true,
  },
  price: { type: Number, required: true }, 
  isBooked: { type: Boolean, default: false },
});

const busSchema = new mongoose.Schema(
  {
    busName: { type: String, required: true, trim: true },
    busNumber: { type: String, required: true, unique: true, uppercase: true },
    totalSeats: { type: Number, required: true, min: 1 },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    bustype: {
      type: String,
      enum: [
        "Seater",
        "Sleeper",
        "AC Seater",
        "AC Sleeper",
        "AC Sleeper + Seater",
        "Non AC Seater + Sleeper", 
      ],
      required: true,
    },
    image: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    pickupTime: { type: String, required: true }, 
    dropTime: { type: String, required: true },   
    numReviews:{
      type:Number,
      default:0,
    },
     rating: {
    type: Number,
    default: 0
  },
   numReviews: {
    type: Number,
    default: 0
  },
    
    seats: [seatSchema], 
  },
  { timestamps: true }
);

const Bus = mongoose.model("Bus", busSchema);
export default Bus;
