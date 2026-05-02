import PizZip from "pizzip";
import fs from "fs";
import path from "path";

/**
 * Generates a DOCX document by replacing raw text in the XML.
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

  // Replace hardcoded dummy values with actual data
  // For Da'vo ariza
  docXml = docXml.replace(/KADIROV ODIL MURATOVICH/g, (data.FISH || "").toUpperCase());
  docXml = docXml.replace(/Kadirov Odil Muratovich/g, data.FISH || "");
  docXml = docXml.replace(/AD 1114901/g, data.PASPORT || "Noma'lum");
  docXml = docXml.replace(/31602870171169/g, data.JSHSHIR || "Noma'lum");
  docXml = docXml.replace(/Toshkent shahri, Uchtepa tumani, Jurjoniy MFY, Zamaxshariy ko‘chasi 30-uy/g, data.MANZIL || "");
  docXml = docXml.replace(/68 590 000/g, data.QARZ_SUMMASI || "0");
  docXml = docXml.replace(/22 863 280/g, data.QARZ_QOLDIQ || "0");
  
  // For Talabnoma
  docXml = docXml.replace(/MUXAMMEDOV JAMSHID AKBAROVICH/g, (data.FISH || "").toUpperCase());
  docXml = docXml.replace(/Muxammedov Jamshid Akbarovich/g, data.FISH || "");

  // Update the XML in the zip
  zip.file("word/document.xml", docXml);

  // Generate the new document buffer
  const buf = zip.generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buf;
}
