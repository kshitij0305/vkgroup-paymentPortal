import express from "express";
import { downloadReceiptsExcel, getReceipt } from "../controllers/receiptController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/export", protectAdmin, downloadReceiptsExcel);
router.get("/:id", getReceipt);

export default router;
