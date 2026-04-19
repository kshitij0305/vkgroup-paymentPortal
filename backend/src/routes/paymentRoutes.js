import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

// 🔹 Create Razorpay Order
router.post("/order", createOrder);

// 🔹 Verify Payment (signature check)
router.post("/verify", verifyPayment);

export default router;