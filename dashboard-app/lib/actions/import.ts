"use server";

import ExcelJS from "exceljs";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import fs from "fs-extra";
import path from "path";

/**
 * Excel ustunlari xaritasi (ikkala fayl uchun bir xil):
 * 
 * Col  1: T/r. (tartib raqami)
 * Col  2: Rasmi (rasm — image obyekti)
 * Col  3: Pasport bo'yicha manzili
 * Col  4: F.I.O.
 * Col  5: Pasport seriyasi va raqami
 * Col  6: Tug'ilgan vaqti (Date obyekti)
 * Col  7: JShShIR (number yoki bo'shliqli string)
 * Col  8: Olingan qarz summasi (number yoki "48.091.168,45" formatted string)
 * Col  9: Olingan qarz summasi matnda
 * Col 10: Qarz shartnomasi tasdiqlangan sana (string: "2019-yil 12-mart")
 * Col 11: Tasdiqlagan notarius
 * Col 12: Shartnoma reestr raqami
 * Col 13: Qarzdorlik holati sanasi (string)
 * Col 14: Muddati o'tkan qarz summasi (number yoki formatted string)
 * Col 15: Muddati o'tkan qarz summasi matnda
 * Col 16: Telefon raqami
 * Col 17: Ogohlantirish xati yuborilgan sana va raqami
 * Col 18: Sudga chiqarilganligi haqida ma'lumot
 */

// ─── Yordamchi funksiyalar ───

/** Hujayradan matn olish — formula, richText va oddiy qiymatlarni to'g'ri qaytaradi */
function getCellText(row: ExcelJS.Row, col: number): string {
  const cell = row.getCell(col);
  const val = cell.value;

  if (val === null || val === undefined) return "";

  // Formula natijasi
  if (typeof val === "object" && "result" in val) {
    return String(val.result ?? "").trim();
  }

  // RichText
  if (typeof val === "object" && "richText" in val) {
    return (val as any).richText.map((r: any) => r.text).join("").trim();
  }

  // Date
  if (val instanceof Date) {
    return val.toISOString();
  }

  // cell.text eng xavfsiz (ExcelJS o'zi formatlaydi)
  return cell.text?.trim() || String(val).trim();
}

/** 
 * Summani o'qish — har xil formatlarni qo'llab-quvvatlaydi:
 * - number: 52050500
 * - Yevropa formati string: "48.091.168,45" (nuqta = minglik, vergul = kasr)
 * - Xatoli format: "45.930.894.30" (nuqta vergul o'rniga)
 * - Formula: { formula: "...", result: 43667824.68 }
 */
function parseAmount(val: any): number {
  if (val === null || val === undefined || val === "") return 0;

  // Formula obyekti
  if (typeof val === "object" && val !== null && "result" in val) {
    val = val.result;
  }

  // Allaqachon raqam
  if (typeof val === "number") return Math.round(val * 100) / 100;

  // String formatni tozalash
  let str = String(val).trim();
  str = str.replace(/[^\d.,-]/g, "");
  if (!str) return 0;

  // Nuqtalarni sanash
  const dots = (str.match(/\./g) || []).length;
  const commas = (str.match(/,/g) || []).length;

  if (dots > 1 && commas === 1) {
    // "48.091.168,45" — standart Yevropa formati
    str = str.replace(/\./g, "").replace(",", ".");
  } else if (dots > 1 && commas === 0) {
    // "45.930.894.30" — xatoli format, oxirgi nuqta kasr
    const lastDot = str.lastIndexOf(".");
    const afterLastDot = str.substring(lastDot + 1);
    // Agar oxirgi nuqtadan keyin 1-2 raqam bo'lsa — kasr
    if (afterLastDot.length <= 2) {
      const intPart = str.substring(0, lastDot).replace(/\./g, "");
      str = intPart + "." + afterLastDot;
    } else {
      // hammasi minglik ajratuvchi
      str = str.replace(/\./g, "");
    }
  } else if (commas === 1 && dots === 0) {
    // "1234,56" — vergul kasr
    str = str.replace(",", ".");
  }

  return parseFloat(str) || 0;
}

/** JShShIR ni tozalash — bo'shliqlarni olib tashlash, faqat raqamlar */
function cleanJshshir(val: any): string {
  if (val === null || val === undefined) return "";
  
  // Formula
  if (typeof val === "object" && "result" in val) {
    val = val.result;
  }

  return String(val).replace(/\s/g, "").replace(/[^\d]/g, "");
}

/** Telefon raqamni tozalash */
function cleanPhone(text: string): string {
  if (!text) return "";
  // Faqat raqamlar va + belgi
  let cleaned = text.replace(/[^\d+]/g, "");
  // Agar 998 bilan boshlansa va + bo'lmasa, qo'shish
  if (cleaned.startsWith("998") && !cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }
  return cleaned;
}

/** Pasportni tozalash */
function cleanPassport(text: string): string {
  return text.replace(/\s/g, "").toUpperCase();
}

// ─── 1-BOSQICH: Preview (Bazaga saqlamaydi) ───

export async function previewDebtorsExcel(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("Fayl topilmadi");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // ExcelJS.readFile diskdan o'qiganda rasmlarni to'liq oladi
    // load() bufferdan o'qiganda rasmlar kelmaydi
    const tmpDir = path.join(process.cwd(), "tmp");
    await fs.ensureDir(tmpDir);
    const tmpPath = path.join(tmpDir, `import_${Date.now()}.xlsx`);
    await fs.writeFile(tmpPath, buffer);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(tmpPath);
    
    // Vaqtincha faylni o'chirish
    await fs.remove(tmpPath).catch(() => {});
    
    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error("Varaq topilmadi");

    const data: any[] = [];
    const errors: { row: number; msg: string }[] = [];

    // Rasmlarni olish — faqat readFile bilan ishlaydi (load bilan rasm buferlari yo'q)
    // Server action'da FormData orqali kelgan faylni vaqtincha diskka yozamiz
    const images = worksheet.getImages();
    const imageMap = new Map<number, string>(); // row -> base64

    for (const img of images) {
      try {
        const tl = img.range?.tl;
        if (!tl) continue;
        const rowNum = Math.floor(tl.nativeRow ?? tl.row ?? 0) + 1;
        
        const media = workbook.getImage(Number(img.imageId));
        if (media && media.buffer) {
          const buf = Buffer.from(media.buffer as ArrayBuffer);
          if (buf.length > 100) { // Skip tiny/broken images
            const ext = media.extension || "jpeg";
            imageMap.set(rowNum, `data:image/${ext};base64,${buf.toString("base64")}`);
          }
        }
      } catch { /* skip broken images */ }
    }

    // Row 1 = Sarlavha (merged), Row 2 = Ustun nomlari, Row 3+ = Ma'lumot
    for (let i = 3; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      
      // F.I.O. bo'sh bo'lsa — qatorni o'tkazib yuborish
      const fish = getCellText(row, 4);
      if (!fish) continue;

      try {
        const tartibRaqam = parseInt(getCellText(row, 1)) || null;
        const manzil = getCellText(row, 3);
        const pasport = cleanPassport(getCellText(row, 5));
        
        // Tug'ilgan sana — Date yoki string bo'lishi mumkin
        let tugilganSana = "";
        const rawDate = row.getCell(6).value;
        if (rawDate instanceof Date) {
          tugilganSana = rawDate.toISOString().split("T")[0]; // "1987-09-21"
        } else if (rawDate) {
          tugilganSana = getCellText(row, 6);
        }

        const jshshir = cleanJshshir(row.getCell(7).value);
        const qarzSummasi = parseAmount(row.getCell(8).value);
        const qarzMatnda = getCellText(row, 9);
        const shartnomaSana = getCellText(row, 10);
        const notarius = getCellText(row, 11);
        const reestrRaqam = getCellText(row, 12);
        const holatSanasi = getCellText(row, 13);
        const muddatOtganSumma = parseAmount(row.getCell(14).value);
        const muddatOtganMatnda = getCellText(row, 15);
        const telefon = cleanPhone(getCellText(row, 16));
        const ogohlantirishXati = getCellText(row, 17);
        const sudMalumot = getCellText(row, 18);

        // Rasm bor-yo'qligini tekshirish
        const photoBase64 = imageMap.get(i) || null;

        data.push({
          row: i,
          tartibRaqam,
          fish,
          manzil,
          pasport,
          tugilganSana,
          jshshir,
          qarzSummasi,
          qarzMatnda,
          shartnomaSana,
          notarius,
          reestrRaqam,
          holatSanasi,
          muddatOtganSumma,
          muddatOtganMatnda,
          telefon,
          ogohlantirishXati,
          sudMalumot,
          photoBase64: photoBase64 || null,
          hasPhoto: !!photoBase64,
        });
      } catch (err: any) {
        errors.push({ row: i, msg: `${fish}: ${err.message}` });
      }
    }

    return { 
      success: true, 
      data, 
      errors,
      summary: {
        total: data.length,
        withPhone: data.filter(d => d.telefon).length,
        withPhoto: data.filter(d => d.hasPhoto).length,
        withOverdue: data.filter(d => d.muddatOtganSumma > 0).length,
        withCourt: data.filter(d => d.sudMalumot).length,
      }
    };
  } catch (error: any) {
    console.error("Preview error:", error);
    return { success: false, error: error.message };
  }
}

// ─── 2-BOSQICH: Tasdiqlangandan so'ng bazaga saqlash ───

export async function commitDebtorsImport(data: any[], loanType: "20_yil" | "7_yil") {
  try {
    let importedCount = 0;
    const errors: any[] = [];

    // Rasmlar uchun papka
    const uploadDir = path.join(process.cwd(), "public", "uploads", "debtors");
    await fs.ensureDir(uploadDir);

    for (const item of data) {
      try {
        const { 
          fish, telefon, manzil, pasport, jshshir, tugilganSana,
          qarzSummasi, qarzMatnda, notarius, reestrRaqam, 
          muddatOtganSumma, shartnomaSana, holatSanasi,
          tartibRaqam, ogohlantirishXati, sudMalumot, photoBase64
        } = item;

        // ── 1. Qarzdorni topish yoki yaratish ──
        let debtor = null;

        // Avval JShShIR bo'yicha qidirish (eng ishonchli identifikator)
        if (jshshir && jshshir.length >= 10) {
          debtor = await prisma.debtor.findUnique({ where: { jshshir } });
        }

        // Keyin pasport bo'yicha qidirish
        if (!debtor && pasport && pasport.length >= 5) {
          debtor = await prisma.debtor.findUnique({ where: { pasport } });
        }

        // Yangilash yoki yaratish
        if (debtor) {
          debtor = await prisma.debtor.update({
            where: { id: debtor.id },
            data: { 
              fish, 
              telefon: telefon || debtor.telefon,
              manzil: manzil || debtor.manzil,
              tartibRaqam: tartibRaqam ?? debtor.tartibRaqam,
              tugilganSana: tugilganSana ? new Date(tugilganSana) : debtor.tugilganSana,
            }
          });
        } else {
          debtor = await prisma.debtor.create({
            data: { 
              fish, 
              telefon: telefon || null,
              manzil: manzil || null,
              pasport: pasport || null,
              jshshir: jshshir || null,
              tartibRaqam,
              tugilganSana: tugilganSana ? new Date(tugilganSana) : null,
            }
          });
        }

        // ── Rasmni saqlash ──
        if (photoBase64 && photoBase64.startsWith("data:image/")) {
          try {
            const matches = photoBase64.match(/^data:image\/(\w+);base64,(.+)$/);
            if (matches) {
              const ext = matches[1];
              const imgBuffer = Buffer.from(matches[2], "base64");
              const fileName = `${jshshir || debtor.id}.${ext}`;
              const filePath = path.join(uploadDir, fileName);
              await fs.writeFile(filePath, imgBuffer);
              
              // Debtor foto maydonini yangilash
              await prisma.debtor.update({
                where: { id: debtor.id },
                data: { photo: `/uploads/debtors/${fileName}` }
              });
            }
          } catch { /* rasm saqlanmasa ham davom etamiz */ }
        }

        // ── 2. Qarzni topish yoki yaratish ──
        const existingLoan = await prisma.loan.findFirst({
          where: { debtorId: debtor.id, loanType }
        });

        // Holat aniqlash
        let status = "faol";
        if (sudMalumot && sudMalumot.trim().length > 3) {
          status = "sudda";
        } else if (muddatOtganSumma > 0) {
          status = "kechikkan";
        }

        // Xavf darajasini hisoblash
        let riskScore = 10;
        if (status === "sudda") {
          riskScore = 95;
        } else if (muddatOtganSumma > 0 && qarzSummasi > 0) {
          const ratio = muddatOtganSumma / qarzSummasi;
          if (ratio > 0.5) riskScore = 90;
          else if (ratio > 0.3) riskScore = 75;
          else if (ratio > 0.1) riskScore = 55;
          else riskScore = 35;
        }

        const loanData = {
          debtorId: debtor.id,
          loanType,
          qarzSummasi,
          qarzMatnda: qarzMatnda || null,
          notarius: notarius || null,
          reestrRaqam: reestrRaqam || null,
          muddatOtganSumma,
          status,
          riskScore,
          shartnomaSana: shartnomaSana ? parseDateString(shartnomaSana) : null,
          holatSanasi: holatSanasi ? parseDateString(holatSanasi) : null,
        };

        if (existingLoan) {
          await prisma.loan.update({ where: { id: existingLoan.id }, data: loanData });
        } else {
          await prisma.loan.create({ data: loanData });
        }

        importedCount++;
      } catch (err: any) {
        errors.push({ fish: item.fish || `Qator ${item.row}`, msg: err.message });
      }
    }

    revalidatePath("/debtors");
    revalidatePath("/");
    return { success: true, count: importedCount, errors };
  } catch (error: any) {
    console.error("Commit error:", error);
    return { success: false, error: error.message };
  }
}

/** "2019-yil 12-mart" formatidagi sanani Date ga aylantirish */
function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;

  const months: Record<string, number> = {
    yanvar: 0, fevral: 1, mart: 2, aprel: 3,
    may: 4, iyun: 5, iyul: 6, avgust: 7,
    sentabr: 8, oktyabr: 9, noyabr: 10, dekabr: 11,
  };

  // "2019-yil 12-mart" yoki "2025-yil 5-noyabr"
  const match = dateStr.match(/(\d{4})-yil\s+(\d{1,2})-(\w+)/i);
  if (match) {
    const year = parseInt(match[1]);
    const day = parseInt(match[2]);
    const monthName = match[3].toLowerCase();
    const month = months[monthName];
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }

  // ISO format fallback
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
  } catch { /* ignore */ }

  return null;
}
