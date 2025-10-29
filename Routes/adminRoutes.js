import express from "express"
import { createBus, deletebus, deleteticket, getme, login, logout, signupadmin, updatebus,getCancelledBookings } from "../controller/admin.controller.js"
import protectAdminRoutes from "../middleware/protectadminRoutes.js"
const router=express.Router()
router.get("/adminget",protectAdminRoutes,getme)
router.post("/adminsignup",signupadmin)
router.post("/adminlogin",login)
router.post("/adminlogout",logout)
router.post("/createbus",protectAdminRoutes,createBus)
router.post("/updatebus/:id",protectAdminRoutes,updatebus)
router.delete("/deleteticket/:id",protectAdminRoutes,deleteticket)
router.delete("/deletebus/:id",protectAdminRoutes,deletebus)
router.get("/cancelled",protectAdminRoutes, getCancelledBookings);
export default router