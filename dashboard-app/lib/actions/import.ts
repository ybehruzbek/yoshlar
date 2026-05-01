"use server";

import ExcelJS from "exceljs";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import fs from "fs-extra";
import path from "path";

// Helper for parsing numbers
const parseNum = (val: any): number => {
  if (val === undefined || val === null || val === "") return 0;
  let target = val;
  if (typeof val === 'object' && val.result !== undefined) {
    target = val.result;
  }
  if (typeof target === 'number') return target;
  const cleanStr = String(target).replace(/\s/g, "").replace(/[^\d.,-]/g, "");
  if (cleanStr.includes(".") && cleanStr.includes(",")) {
    return parseFloat(cleanStr.replace(/\./g, "").replace(",", "."));
  }
  if (cleanStr.includes(",") && !cleanStr.includes(".")) {
    return parseFloat(cleanStr.replace(",", "."));
  }
  return parseFloat(cleanStr) || 0;
};

// 1-bosqich: Excelni o'qish va preview qaytarish (Bazaga saqlamaydi)
export async function previewDebtorsExcel(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("Fayl topilmadi");

    const bytes = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Buffer.from(bytes));
    
    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error("Varaq topilmadi");

    const data: any[] = [];
    const errors: { row: number; msg: string }[] = [];

    for (let i = 3; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const getCellText = (col: number) => {
        const cell = row.getCell(col);
        if (typeof cell.value === 'object' && cell.value !== null && 'result' in cell.value) {
          return String(cell.value.result || "").trim();
        }
        return cell.text?.trim() || "";
      };

      const fish = getCellText(4);
      if (!fish || fish === "") continue;

      data.push({
        row: i,
        fish,
        manzil: getCellText(3),
        pasport: getCellText(5).replace(/\s/g, "").toUpperCase(),
        jshshir: getCellText(7).replace(/\s/g, ""),
        qarzSummasi: parseNum(row.getCell(8).value),
        qarzMatnda: getCellText(9),
        notarius: getCellText(11),
        reestrRaqam: getCellText(12),
        muddatOtganSumma: parseNum(row.getCell(14).value),
        telefon: getCellText(16).replace(/[^\d+]/g, ""),
      });
    }

    return { success: true, data, errors };
  } catch (error: any) {
    console.error("Preview error:", error);
    return { success: false, error: error.message };
  }
}

// 2-bosqich: Tasdiqlangan ma'lumotlarni saqlash
export async function commitDebtorsImport(data: any[], loanType: "20_yil" | "7_yil") {
  try {
    let importedCount = 0;
    const errors: any[] = [];

    for (const item of data) {
      try {
        const { fish, telefon, manzil, pasport, jshshir, qarzSummasi, qarzMatnda, notarius, reestrRaqam, muddatOtganSumma } = item;

        // Upsert Debtor
        const debtor = await prisma.debtor.upsert({
          where: { jshshir: jshshir || "N/A-" + Math.random(), pasport: pasport || "N/A-" + Math.random() },
          update: { fish, telefon, manzil },
          create: { fish, telefon, manzil, pasport, jshshir }
        });

        // Find existing loan
        const existingLoan = await prisma.loan.findFirst({
          where: { debtorId: debtor.id, loanType }
        });

        const loanData = {
          debtorId: debtor.id,
          loanType,
          qarzSummasi,
          qarzMatnda,
          notarius,
          reestrRaqam,
          muddatOtganSumma,
          status: muddatOtganSumma > 0 ? "kechikkan" : "faol",
          riskScore: muddatOtganSumma > (qarzSummasi * 0.3) ? 85 : (muddatOtganSumma > 0 ? 45 : 10)
        };

        if (existingLoan) {
          await prisma.loan.update({ where: { id: existingLoan.id }, data: loanData });
        } else {
          await prisma.loan.create({ data: loanData });
        }

        importedCount++;
      } catch (err: any) {
        errors.push({ fish: item.fish, msg: err.message });
      }
    }

    revalidatePath("/debtors");
    revalidatePath("/dashboard");
    return { success: true, count: importedCount, errors };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
