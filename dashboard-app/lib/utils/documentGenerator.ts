import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import { numberToWordsUz } from "./numberToWordsUz";

/**
 * Generates a DOCX document using docxtemplater
 */
export function generateDocument(templateName: string, data: Record<string, any>): Buffer {
  const templatePath = path.join(process.cwd(), "documents", "templates", templateName);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);

  // Initialize docxtemplater
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Convert numbers to text where needed
  if (data.QARZ_SUMMASI) data.QARZ_SUMMA_SOZ = numberToWordsUz(Number(data.QARZ_SUMMASI.replace(/[^0-9]/g, "")));
  if (data.QARZ_QOLDIQ) data.QOLDIQ_SOZ = numberToWordsUz(Number(data.QARZ_QOLDIQ.replace(/[^0-9]/g, "")));
  if (data.OYLIK_TOLOV) data.OYLIK_TOLOV_SOZ = numberToWordsUz(Number(data.OYLIK_TOLOV.replace(/[^0-9]/g, "")));

  // Render the document
  doc.render(data);

  // Generate the new document buffer
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buf;
}
