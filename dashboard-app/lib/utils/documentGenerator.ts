import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";

/**
 * Generates a DOCX document from a template using docxtemplater.
 * 
 * @param templateName The name of the template file in documents/templates (e.g. "Da'vo ariza.docx")
 * @param data The data object containing tag replacements
 * @returns Buffer containing the generated DOCX file
 */
export function generateDocument(templateName: string, data: Record<string, any>): Buffer {
  const templatePath = path.join(process.cwd(), "documents", "templates", templateName);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  // Load the docx file as binary content
  const content = fs.readFileSync(templatePath, "binary");

  // Unzip the content
  const zip = new PizZip(content);

  // Initialize docxtemplater
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Render the document (replace tags with data)
  doc.render(data);

  // Get the generated document as a nodejs Buffer
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buf;
}
