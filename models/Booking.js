import mongoose from "mongoose";
const { Schema } = mongoose;

const bookingSchema = new Schema({
  bus: { 
    type: Schema.Types.ObjectId, 
    ref: "Bus", 
    required: true 
  }, 
   user: {                              
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },                        
  seatNumber: { 
    type: String, 
    required: true 
  },                       
  passengerName: { 
    type: String, 
    required: true,
    trim: true
  },
  passengerAge: { 
    type: Number, 
    required: true,
    min: 0
  },
  phoneNumber: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true
  },
  pricePaid: { 
    type: Number, 
    required: true,
    min: 0
  },
  pickupLocation: { 
    type: String, 
    required: true,
    trim: true
  },
  pickupTime: { 
    type: String, 
    required: true,
    trim: true
  },
  dropLocation: { 
    type: String, 
    required: true,
    trim: true
  },
  dropTime: { 
    type: String, 
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["booked", "cancelled", "completed"],
    default: "booked"
  },
  travelDate: {           
    type: Date,
    required: true
  },
   busName: {
    type: String,
    required: true,
  },
  busNumber: {
    type: String,
    required: true,
  },
  bookedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
