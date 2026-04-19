import Razorpay from "razorpay";
import crypto from "crypto";
import Receipt from "../models/receipt.js"; // make sure filename matches exactly
import { saveToExcel } from "../utils/excelWriter.js";

// 🔹 Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET
    });

    const options = {
      amount: 250 * 100, // ₹250 in paise
      currency: "INR",
      receipt: "receipt_order_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY,
      order
    });

  } catch (err) {
    console.error("Create Order Error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


// 🔹 Verify Payment (MOST IMPORTANT)
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      receiptId
    } = req.body;

    // Step 1: Generate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    // Step 2: Compare signatures
    if (expectedSignature === razorpay_signature) {

      // Step 3: Update DB (mark as paid)
      const updated = await Receipt.findOneAndUpdate(
        { receiptId },
        {
          status: "paid",
          paymentId: razorpay_payment_id
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Receipt not found"
        });
      }

      saveToExcel({
        receiptId: updated.receiptId,
        name: updated.name,
        fatherName: updated.fatherName,
        address: updated.address,
        applyDate: updated.applyDate,
        mobile1: updated.mobile1,
        mobile2: updated.mobile2,
        designation: updated.designation,
        dob: updated.dob,
        visitDate: updated.visitDate,
        issueDate: updated.issueDate,
        token: updated.token,
        amount: updated.amount,
        paymentId: updated.paymentId,
        status: updated.status,
        createdAt: updated.createdAt
      });

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: updated
      });

    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

  } catch (err) {
    console.error("Verify Payment Error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
