import XLSX from "xlsx";

const sheetName = "Receipts";

const normalizeReceipt = (receipt) => ({
  receiptId: receipt.receiptId,
  name: receipt.name,
  fatherName: receipt.fatherName,
  address: receipt.address,
  applyDate: receipt.applyDate,
  mobile1: receipt.mobile1,
  mobile2: receipt.mobile2,
  designation: receipt.designation,
  dob: receipt.dob,
  visitDate: receipt.visitDate,
  issueDate: receipt.issueDate,
  token: receipt.token,
  amount: receipt.amount,
  paymentId: receipt.paymentId,
  status: receipt.status,
  createdAt: receipt.createdAt
});

export const buildReceiptsWorkbookBuffer = (receipts) => {
  const rows = receipts.map(normalizeReceipt);
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  });
};
