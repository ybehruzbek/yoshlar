import PizZip from "pizzip";
import fs from "fs";
import path from "path";
import { numberToWordsUz } from "./numberToWordsUz";

/**
 * Generates a DOCX document by smartly replacing raw text in the XML,
 * ignoring XML tags that might fragment the text.
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

  // Names & Basics (Kadirov was fragmented by proofErr)
  docXml = docXml.replace(/K(?:<[^>]*>)*A(?:<[^>]*>)*D(?:<[^>]*>)*I(?:<[^>]*>)*R(?:<[^>]*>)*O(?:<[^>]*>)*V(?:\s|<[^>]*>)*O(?:<[^>]*>)*D(?:<[^>]*>)*I(?:<[^>]*>)*L(?:\s|<[^>]*>)*M(?:<[^>]*>)*U(?:<[^>]*>)*R(?:<[^>]*>)*A(?:<[^>]*>)*T(?:<[^>]*>)*O(?:<[^>]*>)*V(?:<[^>]*>)*I(?:<[^>]*>)*C(?:<[^>]*>)*H/g, (data.FISH || "").toUpperCase());
  docXml = docXml.replace(/M(?:<[^>]*>)*U(?:<[^>]*>)*X(?:<[^>]*>)*A(?:<[^>]*>)*M(?:<[^>]*>)*M(?:<[^>]*>)*E(?:<[^>]*>)*D(?:<[^>]*>)*O(?:<[^>]*>)*V(?:\s|<[^>]*>)*J(?:<[^>]*>)*A(?:<[^>]*>)*M(?:<[^>]*>)*S(?:<[^>]*>)*H(?:<[^>]*>)*I(?:<[^>]*>)*D(?:\s|<[^>]*>)*A(?:<[^>]*>)*K(?:<[^>]*>)*B(?:<[^>]*>)*A(?:<[^>]*>)*R(?:<[^>]*>)*O(?:<[^>]*>)*V(?:<[^>]*>)*I(?:<[^>]*>)*C(?:<[^>]*>)*H/g, (data.FISH || "").toUpperCase());
  
  // Safe replacements for simple text that is not fragmented (Verified via mammoth/indexOf)
  docXml = docXml.replace(/AD 1114901/g, data.PASPORT || "");
  docXml = docXml.replace(/31602870171169/g, data.JSHSHIR || "");
  docXml = docXml.replace(/2019-yil 20-mart/g, data.SHARTNOMA_SANA || "");
  docXml = docXml.replace(/2019-yil 13-dekabr/g, data.SHARTNOMA_SANA || "");
  docXml = docXml.replace(/notarius Tursunkulova Kamila Ruslanovna/g, `notarius ${data.NOTARIUS || ""}`);
  docXml = docXml.replace(/201900043001468-son/g, data.SHARTNOMA_RAQAMI || "");
  docXml = docXml.replace(/201901137004736-son/g, data.SHARTNOMA_RAQAMI || "");
  docXml = docXml.replace(/20 \(yigirma\)/g, data.QARZ_MUDDATI || "10 (o'n)");
  docXml = docXml.replace(/2019-yil 26-mart/g, data.OTKAZILGAN_SANA || "");
  docXml = docXml.replace(/2019-yil 20-aprel/g, data.TOLOV_BOSHLANISH_SANA || "");
  docXml = docXml.replace(/2019-yil 15-dekabr/g, data.TOLOV_BOSHLANISH_SANA || "");
  docXml = docXml.replace(/2025-yil 15-dekabr/g, data.HOLAT_SANASI || "");
  docXml = docXml.replace(/2026-yil 15-aprel/g, data.HOLAT_SANASI || "");
  docXml = docXml.replace(/2025-yil 19-noyabr/g, data.TALABNOMA_SANA || "");
  docXml = docXml.replace(/2025-yil ____-dekabr/g, data.BUGUNGI_SANA || "");
  docXml = docXml.replace(/2021-yil 18-fevral, 2022-yil 4-mart, 2022-yil 16-iyun, 2023-yil 9-avgust, 2024-yil 27-iyul, 2025-yil 1-aprel sanalari/g, data.OGOHLANTIRISH_XATLARI || "");

  // Safe advanced regex for formatting numbers. .*? is replaced with [^<]* to prevent eating XML tags
  // This matches 68 590 000 (oltmish...) so'm but safely within a text node or adjacent nodes
  docXml = docXml.replace(/6(?:<[^>]*>)*8(?:\s|<[^>]*>)*5(?:<[^>]*>)*9(?:<[^>]*>)*0(?:\s|<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?so(?:<[^>]*>)*(?:‘|'|.)(?:<[^>]*>)*m/g, `${data.QARZ_SUMMASI} (${data.QARZ_SUMMA_SOZ}) so'm`);
  docXml = docXml.replace(/2(?:<[^>]*>)*2(?:\s|<[^>]*>)*8(?:<[^>]*>)*6(?:<[^>]*>)*3(?:\s|<[^>]*>)*2(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?so(?:<[^>]*>)*(?:‘|'|.)(?:<[^>]*>)*m/g, `${data.QARZ_QOLDIQ} (${data.QOLDIQ_SOZ}) so'm`);
  docXml = docXml.replace(/2(?:<[^>]*>)*8(?:<[^>]*>)*5(?:\s|<[^>]*>)*7(?:<[^>]*>)*9(?:<[^>]*>)*1(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?so(?:<[^>]*>)*(?:‘|'|.)(?:<[^>]*>)*m/g, `${data.OYLIK_TOLOV} (${data.OYLIK_TOLOV_SOZ}) so'm`);
  
  // Talabnoma specific number replacements
  docXml = docXml.replace(/6(?:<[^>]*>)*9(?:\s|<[^>]*>)*6(?:<[^>]*>)*5(?:<[^>]*>)*6(?:\s|<[^>]*>)*4(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, `${data.QARZ_SUMMASI} (${data.QARZ_SUMMA_SOZ}) so'm`);
  docXml = docXml.replace(/2(?:<[^>]*>)*2(?:\s|<[^>]*>)*3(?:<[^>]*>)*8(?:<[^>]*>)*6(?:\s|<[^>]*>)*4(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, `${data.QARZ_QOLDIQ} (${data.QOLDIQ_SOZ}) so'm`);
  docXml = docXml.replace(/3(?:<[^>]*>)*4(?:<[^>]*>)*6(?:\s|<[^>]*>)*4(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, `${data.OYLIK_TOLOV} (${data.OYLIK_TOLOV_SOZ}) so'm`);
  docXml = docXml.replace(/2(?:<[^>]*>)*9(?:<[^>]*>)*0(?:\s|<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)(?:[^<]|<(?!\/w:p>))*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, `${data.OYLIK_TOLOV} (${data.OYLIK_TOLOV_SOZ}) so'm`);

  // Addresses
  docXml = docXml.replace(/Toshkent shahri, Uchtepa tumani, Jurjoniy MFY, Zamaxshariy ko‘chasi 30-uy/g, data.MANZIL || "");
  docXml = docXml.replace(/Toshkent shahar, Yunusobod tumani,Markaz 4-kvartal, Qashqar MFY, 31-uy,26-xonadonda/g, data.MANZIL || "");
  docXml = docXml.replace(/Toshkent shahar, Yunusobod tumani, Markaz 4-kvartal, Qashqar MFY, 31-uy, 26-xonadonda/g, data.MANZIL || "");

  // Update the XML in the zip
  zip.file("word/document.xml", docXml);

  // Generate the new document buffer
  const buf = zip.generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buf;
}
