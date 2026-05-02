import PizZip from "pizzip";
import fs from "fs";
import path from "path";
import { numberToWordsUz } from "./numberToWordsUz";

function createFuzzyRegex(text: string) {
    return new RegExp(text.split('').map(c => {
        if (c === ' ') return '\\s*(?:<[^>]*>)*\\s*';
        const escapedChar = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return escapedChar + '(?:<[^>]*>)*';
    }).join(''), 'g');
}

/**
 * Generates a DOCX document by smartly replacing raw text in the XML.
 */
export function generateDocument(templateName: string, data: Record<string, any>): Buffer {
  const templatePath = path.join(process.cwd(), "documents", "templates", templateName);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);

  // Read the main document XML
  let docXml = zip.file("word/document.xml")?.asText() || "";

  // Helper to convert numbers to text
  if (data.QARZ_SUMMASI) data.QARZ_SUMMA_SOZ = numberToWordsUz(Number(data.QARZ_SUMMASI.replace(/[^0-9]/g, "")));
  if (data.QARZ_QOLDIQ) data.QOLDIQ_SOZ = numberToWordsUz(Number(data.QARZ_QOLDIQ.replace(/[^0-9]/g, "")));
  if (data.OYLIK_TOLOV) data.OYLIK_TOLOV_SOZ = numberToWordsUz(Number(data.OYLIK_TOLOV.replace(/[^0-9]/g, "")));

  // Names & Basics
  docXml = docXml.replace(createFuzzyRegex("KADIROV ODIL MURATOVICH"), (data.FISH || "").toUpperCase());
  docXml = docXml.replace(createFuzzyRegex("MUXAMMEDOV JAMSHID AKBAROVICH"), (data.FISH || "").toUpperCase());
  docXml = docXml.replace(createFuzzyRegex("AD 1114901"), data.PASPORT || "");
  docXml = docXml.replace(createFuzzyRegex("31602870171169"), data.JSHSHIR || "");
  
  docXml = docXml.replace(createFuzzyRegex("2019-yil 20-mart"), data.SHARTNOMA_SANA || "");
  docXml = docXml.replace(createFuzzyRegex("2019-yil 13-dekabr"), data.SHARTNOMA_SANA || "");
  docXml = docXml.replace(createFuzzyRegex("notarius Tursunkulova Kamila Ruslanovna"), `notarius ${data.NOTARIUS || ""}`);
  docXml = docXml.replace(createFuzzyRegex("201900043001468-son"), data.SHARTNOMA_RAQAMI || "");
  docXml = docXml.replace(createFuzzyRegex("201901137004736-son"), data.SHARTNOMA_RAQAMI || "");
  docXml = docXml.replace(createFuzzyRegex("20 (yigirma) yil"), `${data.QARZ_MUDDATI} yil` || "10 (o'n) yil");
  docXml = docXml.replace(createFuzzyRegex("2019-yil 26-mart"), data.OTKAZILGAN_SANA || "");
  docXml = docXml.replace(createFuzzyRegex("2019-yil 20-aprel"), data.TOLOV_BOSHLANISH_SANA || "");
  docXml = docXml.replace(createFuzzyRegex("2019-yil 15-dekabr"), data.TOLOV_BOSHLANISH_SANA || "");
  docXml = docXml.replace(createFuzzyRegex("2025-yil 15-dekabr"), data.HOLAT_SANASI || "");
  docXml = docXml.replace(createFuzzyRegex("2026-yil 15-aprel"), data.HOLAT_SANASI || "");
  docXml = docXml.replace(createFuzzyRegex("2025-yil 19-noyabr"), data.TALABNOMA_SANA || "");
  docXml = docXml.replace(createFuzzyRegex("2025-yil ____-dekabr"), data.BUGUNGI_SANA || "");
  docXml = docXml.replace(/\(2021-yil 18-fevral(?:[^<]|<(?!\/w:p>))*?sanalari\)/g, data.OGOHLANTIRISH_XATLARI || "");

  // Da'vo ariza Numbers
  docXml = docXml.replace(/6(?:<[^>]*>)*8(?:\s|<[^>]*>)*5(?:<[^>]*>)*9(?:<[^>]*>)*0(?:\s|<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?so(?:<[^>]*>)*(?:‘|'|.)(?:<[^>]*>)*m/g, `${data.QARZ_SUMMASI} (${data.QARZ_SUMMA_SOZ}) so'm`);
  docXml = docXml.replace(/2(?:<[^>]*>)*2(?:\s|<[^>]*>)*8(?:<[^>]*>)*6(?:<[^>]*>)*3(?:\s|<[^>]*>)*2(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?so(?:<[^>]*>)*(?:‘|'|.)(?:<[^>]*>)*m/g, `${data.QARZ_QOLDIQ} (${data.QOLDIQ_SOZ}) so'm`);
  docXml = docXml.replace(/2(?:<[^>]*>)*8(?:<[^>]*>)*5(?:\s|<[^>]*>)*7(?:<[^>]*>)*9(?:<[^>]*>)*1(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?so(?:<[^>]*>)*(?:‘|'|.)(?:<[^>]*>)*m/g, `${data.OYLIK_TOLOV} (${data.OYLIK_TOLOV_SOZ}) so'm`);
  
  // Talabnoma Numbers
  docXml = docXml.replace(/6(?:<[^>]*>)*9(?:\s|<[^>]*>)*6(?:<[^>]*>)*5(?:<[^>]*>)*6(?:\s|<[^>]*>)*4(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, `${data.QARZ_SUMMASI} (${data.QARZ_SUMMA_SOZ}) so'm`);
  docXml = docXml.replace(/2(?:<[^>]*>)*2(?:\s|<[^>]*>)*3(?:<[^>]*>)*8(?:<[^>]*>)*6(?:\s|<[^>]*>)*4(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, `${data.QARZ_QOLDIQ} (${data.QOLDIQ_SOZ}) so'm`);
  docXml = docXml.replace(/3(?:<[^>]*>)*4(?:<[^>]*>)*6(?:\s|<[^>]*>)*4(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, `${data.OYLIK_TOLOV} (${data.OYLIK_TOLOV_SOZ}) so'm`);
  docXml = docXml.replace(/2(?:<[^>]*>)*9(?:<[^>]*>)*0(?:\s|<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, `${data.OYLIK_TOLOV} (${data.OYLIK_TOLOV_SOZ}) so'm`);

  // Addresses
  docXml = docXml.replace(createFuzzyRegex("Toshkent shahri, Uchtepa tumani, Jurjoniy MFY, Zamaxshariy ko‘chasi 30-uy"), data.MANZIL || "");
  docXml = docXml.replace(createFuzzyRegex("Toshkent shahar, Yunusobod tumani,Markaz 4-kvartal, Qashqar MFY, 31-uy,26-xonadonda"), data.MANZIL || "");
  docXml = docXml.replace(createFuzzyRegex("Toshkent shahar, Yunusobod tumani, Markaz 4-kvartal, Qashqar MFY, 31-uy, 26-xonadonda"), data.MANZIL || "");

  // Update the XML in the zip
  zip.file("word/document.xml", docXml);

  // Generate the new document buffer
  const buf = zip.generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buf;
}
