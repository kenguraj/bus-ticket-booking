import Bus from "../models/bus.js"
import Booking from "../models/Booking.js"
import Review from "../models/Review.js"
import { sendTicketEmail } from "./emai.controllers.js"

export const searchBusByDate = async (req, res) => {
  try {
    const { from, to, date, bustype, minPrice, maxPrice } = req.body;

    if (!from || !to || !date) {
      return res.status(400).json({
        error: "Fields 'from', 'to', and 'date' are required",
      });
    }

    const selectedDate = new Date(date);
    const dayStart = new Date(selectedDate.setHours(0, 0, 0, 0));
    const dayEnd = new Date(selectedDate.setHours(23, 59, 59, 999));

    //  Both direction routes
    const query = {
      $or: [
        {
          from: { $regex: new RegExp(`^${from}$`, "i") },
          to: { $regex: new RegExp(`^${to}$`, "i") },
          startDate: { $lte: dayEnd },
          endDate: { $gte: dayStart },
        },
        {
          from: { $regex: new RegExp(`^${to}$`, "i") },
          to: { $regex: new RegExp(`^${from}$`, "i") },
          startDate: { $lte: dayEnd },
          endDate: { $gte: dayStart },
        },
      ],
    };

    const buses = await Bus.find(query);

    if (buses.length === 0) {
      return res
        .status(404)
        .json({ message: "No buses found for this route on the selected date" });
    }

    //  Filter seats based on type & price
    const filteredBuses = buses
      .map((bus) => {
        let filteredSeats = bus.seats;

        if (bustype) {
          filteredSeats = filteredSeats.filter((seat) =>
            seat.seatType.toLowerCase().includes(bustype.toLowerCase())
          );
        }

        if (minPrice || maxPrice) {
          filteredSeats = filteredSeats.filter((seat) => {
            const price = seat.price;
            if (minPrice && price < minPrice) return false;
            if (maxPrice && price > maxPrice) return false;
            return true;
          });
        }

        // Return only if seats match
        if (filteredSeats.length > 0) {
          return { ...bus.toObject(), seats: filteredSeats };
        }
        return null;
      })
      .filter(Boolean);

    if (filteredBuses.length === 0) {
      return res.status(404).json({
        message: "No buses found with the selected seat type or price range",
      });
    }

    return res.status(200).json({
      total: filteredBuses.length,
      buses: filteredBuses,
    });
  } catch (error) {
    console.error("Error in searchBusByDate:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};



export const ticketBook = async (req, res) => {
  try {
    const {
      busId,
      seatNumber,
      passengerName,
      passengerAge,
      phoneNumber,
      email,
      pickupLocation,
      pickupTime,
      dropLocation,
      dropTime,
      date,
    } = req.body;

  
    if (
      !busId ||
      !seatNumber ||
      !passengerName ||
      !passengerAge ||
      !phoneNumber ||
      !email ||
      !date
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields (including date)" });
    }

    const travelDate = new Date(date);

    //  Find the bus running on that date
    const bus = await Bus.findOne({
      _id: busId,
      startDate: { $lte: travelDate },
      endDate: { $gte: travelDate },
    });

    if (!bus) {
      return res.status(404).json({ message: "No bus found on this date" });
    }

    //  Check if that seat already booked for this bus & date
    const existingBooking = await Booking.findOne({
      bus: busId,
      seatNumber,
      travelDate,
      status: "booked",
    });

    if (existingBooking) {
      return res.status(400).json({
        message: `Seat ${seatNumber} is already booked for ${travelDate.toDateString()}. Please choose another seat.`,
      });
    }
    if (
      bus.pickupLocation !== pickupLocation ||
      bus.pickupTime !== pickupTime ||
      bus.dropLocation !== dropLocation ||
      bus.dropTime !== dropTime
    ) {
      return res
        .status(400)
        .json({ message: "Pickup/Drop details do not match bus schedule" });
    }

    //  Get seat info and mark booked
    const seat = bus.seats.find((s) => s.seatNumber === seatNumber);
    if (!seat) {
      return res.status(400).json({ message: "Invalid seat number" });
    }

    if (seat.isBooked) {
      return res
        .status(400)
        .json({ message: "This seat is already booked. Please choose another seat." });
    }

    seat.isBooked = true;
    await bus.save();

    const booking = await Booking.create({
      bus: bus._id,
      user: req.user?._id, 
      seatNumber,
      passengerName,
      passengerAge,
      phoneNumber,
      email,
      pricePaid: seat.price || 0,
      pickupLocation,
      pickupTime,
      dropLocation,
      dropTime,
      travelDate,
      busName: bus.busName,
      busNumber: bus.busNumber,
    });

    //  Send email after success
    await sendTicketEmail({
      to: email,
      passengerName,
      journeyDate: travelDate.toDateString(),
      seatNumber,
      pickupLocation,
      pickupTime,
      dropLocation,
      dropTime,
      busName: bus.busName,
      busNumber: bus.busNumber,
    });

    return res.status(201).json({
      success: true,
      message: "Ticket booked successfully and email sent.",
      booking,
    });
  } catch (error) {
    console.error("Error in ticketBook:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getTicket=async(req,res)=>{
  try{
const {id}=req.params
const getticket=await Booking.findById(id)
if(!getticket){
  return res.status(404).json({error:"ticket not found"})
}
res.status(200).json(getticket)
  }catch(error){
    console.error("Error in getticketBook:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    //  Find booking
    const booking = await Booking.findById(bookingId).populate("bus");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    //  Check if already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "This booking is already cancelled." });
    }

    //  Calculate journey start time
    const journeyDateTime = new Date(booking.travelDate);
    const [pickupHour, pickupMinute] = booking.pickupTime.split(":");
    const isPM = booking.pickupTime.toLowerCase().includes("pm");
    let hours = parseInt(pickupHour);
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0; 

    journeyDateTime.setHours(hours);
    journeyDateTime.setMinutes(parseInt(pickupMinute));

    //  Check time difference
    const now = new Date();
    const diffHours = (journeyDateTime - now) / (1000 * 60 * 60); 

    if (diffHours < 3) {
      return res.status(400).json({
        message: "Tickets can only be cancelled at least 3 hours before departure.",
      });
    }

    //  Update booking status
    booking.status = "cancelled";
    await booking.save();

  
    await Bus.updateOne(
      { _id: booking.bus._id, "seats.seatNumber": booking.seatNumber },
      { $set: { "seats.$.isBooked": false } }
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully. Seat is now available.",
    });
  } catch (error) {
    console.error("Error in cancelBooking:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//post the review after the droptime end
export const review =async(req,res)=>{
  try{
    const userId = req.user.id;
    const { busId, bookingId } = req.params;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Verify booking exists and belongs to this bus and user
    const booking = await Booking.findOne({ _id: bookingId, bus: busId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    if ( new Date() < booking.dropTime ) {
      return res.status(400).json({ message: "Journey not completed yet — cannot review now" });
    }

    const review = await Review.create({
      bus: busId,
      booking: bookingId,
       user: userId,
      rating,
      comment
    });

  
    const bus = await Bus.findById(busId);
    const reviews = await Review.find({ bus: busId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    bus.numReviews = reviews.length;
    bus.rating = avgRating;
    await bus.save();

    return res.status(201).json({ success: true, review });
  }catch(error){
     console.error("Error in review:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}