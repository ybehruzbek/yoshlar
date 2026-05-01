import ExcelJS from "exceljs";
import path from "path";

async function analyzeExcel(filePath: string) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`📂 FILE: ${path.basename(filePath)}`);
  console.log("=".repeat(80));

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  for (let wsIdx = 0; wsIdx < workbook.worksheets.length; wsIdx++) {
    const ws = workbook.worksheets[wsIdx];
    console.log(`\n📄 Sheet: "${ws.name}" | Rows: ${ws.rowCount} | Columns: ${ws.columnCount}`);
    console.log("-".repeat(60));

    // Print first 5 rows to understand structure
    for (let r = 1; r <= Math.min(5, ws.rowCount); r++) {
      const row = ws.getRow(r);
      console.log(`\n--- ROW ${r} ---`);
      for (let c = 1; c <= ws.columnCount; c++) {
        const cell = row.getCell(c);
        const val = cell.value;
        const type = typeof val;
        let display = "";
        
        if (val === null || val === undefined) {
          display = "(empty)";
        } else if (type === 'object' && val !== null) {
          if ('result' in (val as any)) {
            display = `FORMULA → result: ${(val as any).result}`;
          } else if ('richText' in (val as any)) {
            display = `RICHTEXT: ${(val as any).richText?.map((r: any) => r.text).join("")}`;
          } else if (val instanceof Date) {
            display = `DATE: ${val.toISOString()}`;
          } else {
            display = `OBJ: ${JSON.stringify(val)}`;
          }
        } else {
          display = `${type}: ${String(val).substring(0, 80)}`;
        }
        
        if (display !== "(empty)") {
          console.log(`  Col ${c}: ${display}`);
        }
      }
    }

    // Check for images
    const images = ws.getImages();
    console.log(`\n🖼️ Images in sheet: ${images.length}`);
    if (images.length > 0) {
      images.slice(0, 3).forEach((img, i) => {
        console.log(`  Image ${i + 1}: range=${JSON.stringify(img.range)}, imageId=${img.imageId}`);
      });
    }

    // Print a data row (row 3+) to see actual debtor data
    console.log(`\n--- SAMPLE DATA ROWS (3-6) ---`);
    for (let r = 3; r <= Math.min(6, ws.rowCount); r++) {
      const row = ws.getRow(r);
      console.log(`\nROW ${r}:`);
      for (let c = 1; c <= Math.min(20, ws.columnCount); c++) {
        const cell = row.getCell(c);
        const val = cell.value;
        const text = cell.text;
        if (val !== null && val !== undefined && String(val).trim() !== "") {
          let valStr = "";
          if (typeof val === 'object' && val !== null && 'result' in val) {
            valStr = `FORMULA→${(val as any).result}`;
          } else if (val instanceof Date) {
            valStr = `DATE:${val.toISOString()}`;
          } else {
            valStr = `${typeof val}:${String(val).substring(0, 60)}`;
          }
          console.log(`  Col ${c}: text="${text}" | raw=${valStr}`);
        }
      }
    }
  }
}

async function main() {
  const files = [
    "/Users/skyhill.uz/Desktop/project/yoshlar/hujjatlar-namunalari/Ro'yxat 20 yillik.xlsx",
    "/Users/skyhill.uz/Desktop/project/yoshlar/hujjatlar-namunalari/Ro'yxat 7 yillik.xlsx",
    "/Users/skyhill.uz/Desktop/project/yoshlar/hujjatlar-namunalari/7 yillik foizlik.xlsx",
  ];

  for (const f of files) {
    try {
      await analyzeExcel(f);
    } catch (e: any) {
      console.error(`Error reading ${f}: ${e.message}`);
    }
  }
}

main();
