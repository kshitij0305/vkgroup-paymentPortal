import Razorpay from "razorpay";
import { buildReceiptsWorkbookBuffer } from "../utils/excelWriter.js";

const getRazorpayClient = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
  });

const mapOrderToReceipt = (order) => ({
  receiptId: order.notes?.receiptId || order.receipt || order.id,
  name: order.notes?.name || "",
  fatherName: order.notes?.fatherName || "",
  address: order.notes?.address || "",
  applyDate: order.notes?.applyDate || "",
  mobile1: order.notes?.mobile1 || "",
  mobile2: order.notes?.mobile2 || "",
  designation: order.notes?.designation || "",
  dob: order.notes?.dob || "",
  visitDate: order.notes?.visitDate || "",
  issueDate: order.notes?.issueDate || "",
  token: order.notes?.token || "",
  amount: (order.amount_paid || order.amount || 0) / 100,
  status: order.status || "created",
  paymentId: "",
  createdAt: order.created_at
    ? new Date(order.created_at * 1000).toISOString()
    : undefined
});

export const getReceipt = async (req, res) => {
  try {
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.fetch(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    res.json(mapOrderToReceipt(order));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadReceiptsExcel = async (req, res) => {
  try {
    const razorpay = getRazorpayClient();
    const receipts = [];
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await razorpay.orders.all({
        count: 100,
        skip
      });
      const items = response.items || [];

      receipts.push(
        ...items
          .filter((order) => order.status === "paid")
          .map(mapOrderToReceipt)
      );

      hasMore = items.length === 100;
      skip += items.length;
    }

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
