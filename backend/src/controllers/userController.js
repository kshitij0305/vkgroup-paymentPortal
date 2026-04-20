import { generateReceiptId } from "../utils/generateReceipt.js";

export const createUser = async (req, res) => {
  try {
    const receiptId = await generateReceiptId();

    res.json({
      success: true,
      receiptId,
      data: {
        ...req.body,
        receiptId
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
