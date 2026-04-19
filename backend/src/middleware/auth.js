import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

const getJwtSecret = () => process.env.JWT_SECRET || "change-this-jwt-secret";

export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, getJwtSecret());
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ error: "Admin account not found" });
    }

    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
