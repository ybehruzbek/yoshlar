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
  if (data.QARZ_SUMMA_SOZ) data.QARZ_SUMMA_SOZ = numberToWordsUz(Number(data.QARZ_SUMMA_SOZ));
  if (data.QOLDIQ_SOZ) data.QOLDIQ_SOZ = numberToWordsUz(Number(data.QOLDIQ_SOZ));
  if (data.OYLIK_TOLOV_SOZ) data.OYLIK_TOLOV_SOZ = numberToWordsUz(Number(data.OYLIK_TOLOV_SOZ));

  // Names & Basics
  docXml = docXml.replace(/KADIROV ODIL MURATOVICH/g, (data.FISH || "").toUpperCase());
  docXml = docXml.replace(/Kadirov Odil Muratovich/g, data.FISH || "");
  docXml = docXml.replace(/MUXAMMEDOV JAMSHID AKBAROVICH/g, (data.FISH || "").toUpperCase());
  docXml = docXml.replace(/Muxammedov Jamshid Akbarovich/g, data.FISH || "");
  
  docXml = docXml.replace(/AD 1114901/g, data.PASPORT || "Noma'lum");
  docXml = docXml.replace(/31602870171169/g, data.JSHSHIR || "Noma'lum");
  
  // Addresses
  docXml = docXml.replace(/Toshkent shahri, Uchtepa tumani, Jurjoniy MFY, Zamaxshariy ko‘chasi 30-uy/g, data.MANZIL || "");
  docXml = docXml.replace(/Toshkent shahar, Yunusobod tumani,Markaz 4-kvartal, Qashqar MFY, 31-uy,26-xonadonda/g, data.MANZIL || "");

  // Advanced Regex for formatted Numbers with Text representations:
  // Matches "68 590 000" and EVERYTHING until "so'm", ignoring any XML tags in between.
  docXml = docXml.replace(/68 590 000.*?so(?:‘|'|.)m/g, `${data.QARZ_SUMMASI} (${data.QARZ_SUMMA_SOZ}) so‘m`);
  docXml = docXml.replace(/22 863 280.*?so(?:‘|'|.)m/g, `${data.QARZ_QOLDIQ} (${data.QOLDIQ_SOZ}) so‘m`);
  docXml = docXml.replace(/285 791.*?so(?:‘|'|.)m/g, `${data.OYLIK_TOLOV} (${data.OYLIK_TOLOV_SOZ}) so‘m`);
  
  // Shartnoma raqamlari
  docXml = docXml.replace(/201900043001468-son/g, data.SHARTNOMA_RAQAMI || "");
  docXml = docXml.replace(/201901137004736-son/g, data.SHARTNOMA_RAQAMI || "");

  // Update the XML in the zip
  zip.file("word/document.xml", docXml);

  // Generate the new document buffer
  const buf = zip.generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buf;
}
