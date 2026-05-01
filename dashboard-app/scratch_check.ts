import ExcelJS from "exceljs";

async function deepAnalyze() {
  const files = [
    "/Users/skyhill.uz/Desktop/project/yoshlar/hujjatlar-namunalari/Ro'yxat 20 yillik.xlsx",
    "/Users/skyhill.uz/Desktop/project/yoshlar/hujjatlar-namunalari/Ro'yxat 7 yillik.xlsx",
  ];

  for (const filePath of files) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`FILE: ${filePath.split("/").pop()}`);
    console.log("=".repeat(60));

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const ws = workbook.worksheets[0];

    console.log(`Sheet: "${ws.name}" | Rows: ${ws.rowCount} | Cols: ${ws.columnCount}`);

    // ── Images ──
    const images = ws.getImages();
    console.log(`\n🖼️ IMAGES: ${images.length}`);

    for (let i = 0; i < Math.min(5, images.length); i++) {
      const img = images[i];
      const tl = img.range?.tl;
      const tlRow = tl?.nativeRow ?? tl?.row ?? '?';
      const tlCol = tl?.nativeCol ?? tl?.col ?? '?';
      console.log(`  #${i}: imageId=${img.imageId}, row=${tlRow}, col=${tlCol}`);
      
      try {
        const media = workbook.getImage(Number(img.imageId));
        if (media) {
          const buf = media.buffer as Buffer;
          console.log(`    ✅ ext=${media.extension}, size=${buf?.byteLength || buf?.length || 0} bytes`);
        } else {
          console.log(`    ❌ getImage returned null`);
        }
      } catch (e: any) {
        console.log(`    ❌ ERROR: ${e.message}`);
      }
    }

    // ── Row 3: every cell ──
    console.log(`\n📋 ROW 3 (FULL):`);
    const row3 = ws.getRow(3);
    for (let c = 1; c <= 18; c++) {
      const cell = row3.getCell(c);
      const val = cell.value;
      const text = cell.text;
      const typeName = ExcelJS.ValueType[cell.type];
      
      if (val === null || val === undefined) {
        console.log(`  Col${c}: (empty)`);
        continue;
      }

      let desc = "";
      if (val instanceof Date) {
        desc = `DATE: ${val.toISOString()}`;
      } else if (typeof val === 'object' && 'result' in (val as any)) {
        desc = `FORMULA→${(val as any).result}`;
      } else if (typeof val === 'object' && 'richText' in (val as any)) {
        desc = `RICHTEXT: ${(val as any).richText?.map((r: any) => r.text).join("")}`;
      } else if (typeof val === 'object') {
        try { desc = `OBJ keys=[${Object.keys(val as any).join(',')}]`; } catch { desc = `OBJ`; }
      } else {
        desc = `${typeof val}: ${String(val).substring(0, 60)}`;
      }

      console.log(`  Col${c} [${typeName}]: text="${text?.substring(0, 50)}" | ${desc}`);
    }

    // ── Row 4 ──
    console.log(`\n📋 ROW 4:`);
    const row4 = ws.getRow(4);
    for (let c = 1; c <= 18; c++) {
      const cell = row4.getCell(c);
      if (cell.value !== null && cell.value !== undefined) {
        let desc = "";
        const val = cell.value;
        if (val instanceof Date) desc = `DATE:${val.toISOString()}`;
        else if (typeof val === 'object' && 'result' in (val as any)) desc = `F→${(val as any).result}`;
        else desc = `${typeof val}:${String(val).substring(0, 50)}`;
        console.log(`  Col${c}: text="${cell.text?.substring(0, 40)}" | ${desc}`);
      }
    }

    // ── All data rows summary ──
    console.log(`\n📊 ALL DATA ROWS SUMMARY:`);
    let count = 0;
    for (let r = 3; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const fish = row.getCell(4).text?.trim();
      const col8 = row.getCell(8);
      const col14 = row.getCell(14);
      
      if (!fish) {
        console.log(`  Row ${r}: SKIP (no name)`);
        continue;
      }
      count++;
      const c8type = typeof col8.value;
      const c14type = typeof col14.value;
      console.log(`  Row ${r}: "${fish.substring(0, 30)}" | col8: ${c8type}="${col8.text?.substring(0, 20)}" | col14: ${c14type}="${col14.text?.substring(0, 20)}" | col16: "${row.getCell(16).text?.substring(0, 20)}"`);
    }
    console.log(`\n  TOTAL DATA ROWS: ${count}`);
  }
}

deepAnalyze().catch(console.error);
