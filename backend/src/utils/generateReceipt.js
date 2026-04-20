export const generateReceiptId = async () => {
  const year = new Date().getFullYear();
  const number = `${Date.now()}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`.slice(-8);

  return `REC-${year}-${number}`;
};
