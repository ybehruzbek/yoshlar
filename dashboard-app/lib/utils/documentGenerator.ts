import PizZip from "pizzip";
import fs from "fs";
import path from "path";
import { numberToWordsUz } from "./numberToWordsUz";

/**
 * Generates a DOCX document from a pre-prepared template.
 * 
 * Templates contain {{PLACEHOLDER}} codes that get replaced with actual values.
 * No regex gymnastics needed — just simple string replacement!
 * 
 * Templates were prepared using prepare-templates.js which:
 * 1. Removed Word's proofErr elements
 * 2. Stripped rsid attributes  
 * 3. Merged adjacent text runs
 * 4. Replaced hardcoded values with {{PLACEHOLDER}} codes
 */
export function generateDocument(templateName: string, data: Record<string, any>): Buffer {
  const templatePath = path.join(process.cwd(), "documents", "templates", templateName);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);

  let docXml = zip.file("word/document.xml")?.asText() || "";

  // Compute word forms of numbers
  const qarzSummaSoz = data.QARZ_SUMMASI 
    ? numberToWordsUz(Number(String(data.QARZ_SUMMASI).replace(/[^0-9]/g, ""))) 
    : "";
  const qoldiqSoz = data.QARZ_QOLDIQ 
    ? numberToWordsUz(Number(String(data.QARZ_QOLDIQ).replace(/[^0-9]/g, ""))) 
    : "";
  const oylikTolovSoz = data.OYLIK_TOLOV 
    ? numberToWordsUz(Number(String(data.OYLIK_TOLOV).replace(/[^0-9]/g, ""))) 
    : "";

  // Parse loan term: "15 (o'n besh)" → raqam=15, soz=o'n besh
  let muddatRaqam = "";
  let muddatSoz = "";
  if (data.QARZ_MUDDATI) {
    const match = String(data.QARZ_MUDDATI).match(/^(\d+)\s*\(([^)]+)\)$/);
    if (match) {
      muddatRaqam = match[1];
      muddatSoz = match[2];
    } else {
      muddatRaqam = String(data.QARZ_MUDDATI);
      muddatSoz = "";
    }
  }

  // Build replacement map: {{PLACEHOLDER}} → value
  const replacements: Record<string, string> = {
    "{{FISH}}": (data.FISH || "").toUpperCase(),
    "{{PASPORT}}": data.PASPORT || "",
    "{{JSHSHIR}}": data.JSHSHIR || "",
    "{{SHARTNOMA_SANA}}": data.SHARTNOMA_SANA || "",
    "{{NOTARIUS}}": data.NOTARIUS || "",
    "{{SHARTNOMA_RAQAMI}}": data.SHARTNOMA_RAQAMI || "",
    "{{OTKAZILGAN_SANA}}": data.OTKAZILGAN_SANA || "",
    "{{TOLOV_BOSHLANISH_SANA}}": data.TOLOV_BOSHLANISH_SANA || "",
    "{{HOLAT_SANASI}}": data.HOLAT_SANASI || "",
    "{{TALABNOMA_SANA}}": data.TALABNOMA_SANA || "",
    "{{BUGUNGI_SANA}}": data.BUGUNGI_SANA || "",
    "{{OGOHLANTIRISH_XATLARI}}": data.OGOHLANTIRISH_XATLARI || "",
    "{{QARZ_MUDDATI_RAQAM}}": muddatRaqam,
    "{{QARZ_MUDDATI_SOZ}}": muddatSoz,
    "{{QARZ_SUMMASI}}": data.QARZ_SUMMASI || "",
    "{{QARZ_SUMMA_SOZ}}": qarzSummaSoz,
    "{{QARZ_QOLDIQ}}": data.QARZ_QOLDIQ || "",
    "{{QOLDIQ_SOZ}}": qoldiqSoz,
    "{{OYLIK_TOLOV}}": data.OYLIK_TOLOV || "",
    "{{OYLIK_TOLOV_SOZ}}": oylikTolovSoz,
    "{{MANZIL}}": data.MANZIL || "",
    "{{DAVOGAR_MANZIL}}": data.DAVOGAR_MANZIL || "",
    "{{TUMAN}}": data.TUMAN || "",
    "{{NOTARIAL_TUMAN}}": data.NOTARIAL_TUMAN || "",
  };

  // Replace all placeholders
  for (const [placeholder, value] of Object.entries(replacements)) {
    docXml = docXml.split(placeholder).join(value);
  }

  // Update the XML in the zip
  zip.file("word/document.xml", docXml);

  // Generate the new document buffer
  const buf = zip.generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buf;
}
