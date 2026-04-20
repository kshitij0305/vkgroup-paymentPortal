import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpayClient = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
  });

// Create Razorpay order with receipt details attached to order notes.
export const createOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayClient();
    const { receiptId, formData = {} } = req.body || {};

    if (!receiptId) {
      return res.status(400).json({
        success: false,
        error: "Receipt ID is required"
      });
    }

    const order = await razorpay.orders.create({
      amount: 250 * 100,
      currency: "INR",
      receipt: receiptId,
      notes: {
        receiptId,
        name: formData.name || "",
        fatherName: formData.fatherName || "",
        address: formData.address || "",
        applyDate: formData.applyDate || "",
        mobile1: formData.mobile1 || "",
        mobile2: formData.mobile2 || "",
        designation: formData.designation || "",
        dob: formData.dob || "",
        visitDate: formData.visitDate || "",
        issueDate: formData.issueDate || "",
        token: formData.token || ""
      }
    });

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY,
      order,
      receiptId
    });
  } catch (err) {
    console.error("Create Order Error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Verify payment signature and return the order that now acts as the receipt source.
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      receiptId
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.fetch(razorpay_order_id);

    res.json({
      success: true,
      message: "Payment verified successfully",
      receiptId: receiptId || order?.receipt || order?.notes?.receiptId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      data: order
    });
  } catch (err) {
    console.error("Verify Payment Error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
