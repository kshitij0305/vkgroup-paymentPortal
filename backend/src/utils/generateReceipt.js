import Counter from "../models/counter.js";

export const generateReceiptId = async () => {
  const year = new Date().getFullYear();
  const counter = await Counter.findByIdAndUpdate(
    `receipt:${year}`,
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true
    }
  );

  const number = counter.seq.toString().padStart(4, "0");

  return `REC-${year}-${number}`;
};
