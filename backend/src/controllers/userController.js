import Receipt from "../models/receipt.js";
import { generateReceiptId } from "../utils/generateReceipt.js";

export const createUser = async (req, res) => {
  try {
    const receiptId = await generateReceiptId();

    const newUser = new Receipt({
      ...req.body,
      receiptId
    });

    await newUser.save();

    res.json({
      success: true,
      receiptId,
      data: newUser
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
