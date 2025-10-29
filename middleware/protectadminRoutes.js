import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

const protectAdminRoutes = async (req, res, next) => {
  try {
   
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ error: "Unauthorized: No token provided" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.userId).select("-password");

    if (!admin) return res.status(404).json({ error: "Admin not found" });
    if (admin.role !== "admin")
      return res.status(403).json({ error: "Access denied: Admins only" });

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Error in protectAdminRoutes:", error.message);
    if (error.name === "JsonWebTokenError")
      return res.status(401).json({ error: "Invalid token" });
    res.status(500).json({ error: "Server error during admin auth" });
  }
};

export default protectAdminRoutes;
