import fs from "fs";
import Receipt from "../models/receipt.js";
import { getExcelFilePath } from "../utils/excelWriter.js";

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

export const downloadReceiptsExcel = (req, res) => {
  const excelPath = getExcelFilePath();

  if (!fs.existsSync(excelPath)) {
    return res.status(404).json({ error: "No Excel file has been generated yet" });
  }

  res.download(excelPath, "receipts.xlsx");
};
