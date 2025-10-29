import express from "express"
import { getTicket, review, searchBusByDate, ticketBook,cancelBooking } from "../controller/bus.controller.js"
import { protectRoutes } from "../middleware/protectRoutes.js"
const router=express.Router()

router.post("/search-by-date", searchBusByDate);
router.post("/ticket",protectRoutes,ticketBook)
router.get("/getticket/:id",protectRoutes,getTicket)
router.put("/cancel/:bookingId",protectRoutes, cancelBooking)
router.post("/:busId/booking/:bookingId/review", protectRoutes, review);

export default router