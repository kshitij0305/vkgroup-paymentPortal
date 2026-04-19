import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
  receiptId: {
    type: String,
    unique: true,
    required: true
  },

  name: String,
  fatherName: String,
  address: String,
  applyDate: String,
  mobile1: String,
  mobile2: String,
  designation: String,
  dob: String,
  visitDate: String,
  issueDate: String,
  token: String,

  amount: {
    type: Number,
    default: 250
  },

  paymentId: String,
  status: {
    type: String,
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Receipt || mongoose.model("Receipt", receiptSchema);
