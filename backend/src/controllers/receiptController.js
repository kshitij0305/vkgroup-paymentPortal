import Receipt from "../models/receipt.js";
import { buildReceiptsWorkbookBuffer } from "../utils/excelWriter.js";

export const getReceipt = async (req, res) => {
  try {
    const data = await Receipt.findOne({ receiptId: req.params.id });

    if (!data) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadReceiptsExcel = async (req, res) => {
  try {
    const receipts = await Receipt.find({ status: "paid" })
      .sort({ createdAt: -1 })
      .lean();

    if (receipts.length === 0) {
      return res.status(404).json({
        error: "No paid receipts available for export yet"
      });
    }

    const workbookBuffer = buildReceiptsWorkbookBuffer(receipts);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="receipts.xlsx"'
    );

    res.send(workbookBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
