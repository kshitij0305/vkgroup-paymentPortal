import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "receipts.xlsx");

export const getExcelFilePath = () => filePath;

export const saveToExcel = (data) => {
  const sheetName = "Receipts";

  let workbook;
  let sheet;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    sheet = workbook.Sheets[sheetName] || workbook.Sheets[workbook.SheetNames[0]];
  } else {
    workbook = XLSX.utils.book_new();
    sheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  }

  const newData = XLSX.utils.sheet_to_json(sheet);
  newData.push(data);

  const newSheet = XLSX.utils.json_to_sheet(newData);
  workbook.Sheets[sheetName] = newSheet;

  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, filePath);
};
