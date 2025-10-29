import express from "express"
import { getme, login, logout, signup } from "../controller/authu.controller.js"
import {protectRoutes} from "../middleware/protectRoutes.js"

const router=express.Router()
router.get("/getme",protectRoutes,getme)
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
export default router