import express from "express";
import {
  getAdminProfile,
  getAuthStatus,
  loginAdmin,
  signupAdmin
} from "../controllers/authController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/status", getAuthStatus);
router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getAdminProfile);

export default router;
