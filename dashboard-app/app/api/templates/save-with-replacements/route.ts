import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit, getIpFromRequest } from "@/lib/utils/auditLogger";
import PizZip from "pizzip";
import fs from "fs";
import path from "path";

interface Replacement {
  original: string;
  placeholder: string;
  context?: string; // Paragraph context for smart matching
}

/**
 * Extract all text from a paragraph XML, stripping tags.
 */
function extractParaText(paraXml: string): string {
  return paraXml.replace(/<[^>]+>/g, "");
}

/**
 * Replace the FIRST occurrence of `original` text in a paragraph's <w:t> elements.
 * Handles cases where Word splits text across multiple <w:r><w:t> runs.
 * Returns the modified paragraph XML, or null if not found.
 */
function replaceInParagraph(paraXml: string, original: string, placeholder: string): string | null {
  // Extract all <w:t> text nodes with their positions
  const tRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
  const tElements: { full: string; text: string; index: number }[] = [];
  let m;

  while ((m = tRegex.exec(paraXml)) !== null) {
    tElements.push({ full: m[0], text: m[1], index: m.index });
  }

  if (tElements.length === 0) return null;

  // Build the concatenated text and position map
  const fullText = tElements.map(t => t.text).join("");
  const textIdx = fullText.indexOf(original);
  if (textIdx === -1) return null;

  // Find which <w:t> elements span the original text
  let charPos = 0;
  let startTIdx = -1;
  let endTIdx = -1;
  let startCharInT = 0;
  let endCharInT = 0;

  for (let i = 0; i < tElements.length; i++) {
    const tLen = tElements[i].text.length;
    const tStart = charPos;
    const tEnd = charPos + tLen;

    if (startTIdx === -1 && textIdx < tEnd) {
      startTIdx = i;
      startCharInT = textIdx - tStart;
    }
    if (startTIdx !== -1 && textIdx + original.length <= tEnd) {
      endTIdx = i;
      endCharInT = textIdx + original.length - tStart;
      break;
    }

    charPos += tLen;
  }

  if (startTIdx === -1 || endTIdx === -1) return null;

  // Build the new paragraph XML with replacements
  let newPara = paraXml;

  if (startTIdx === endTIdx) {
    // Simple case: text is within a single <w:t> element
    const t = tElements[startTIdx];
    const before = t.text.substring(0, startCharInT);
    const after = t.text.substring(endCharInT);
    const newText = before + placeholder + after;
    newPara = newPara.replace(t.full, `<w:t xml:space="preserve">${newText}</w:t>`);
  } else {
    // Complex case: text spans multiple <w:t> elements
    // Put the placeholder in the first element, trim text in middle/end elements
    for (let i = startTIdx; i <= endTIdx; i++) {
      const t = tElements[i];
      if (i === startTIdx) {
        const before = t.text.substring(0, startCharInT);
        const newText = before + placeholder;
        newPara = newPara.replace(t.full, `<w:t xml:space="preserve">${newText}</w:t>`);
      } else if (i === endTIdx) {
        const after = t.text.substring(endCharInT);
        newPara = newPara.replace(t.full, `<w:t xml:space="preserve">${after}</w:t>`);
      } else {
        // Middle elements — clear them
        newPara = newPara.replace(t.full, `<w:t xml:space="preserve"></w:t>`);
      }
    }
  }

  return newPara;
}

// POST: Save template with manual placeholder replacements
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const nomi = formData.get("nomi") as string;
    const turi = formData.get("turi") as string;
    const replacementsJson = formData.get("replacements") as string;

    if (!file || !file.name.endsWith(".docx")) {
      return NextResponse.json({ error: "Faqat .docx fayllar qabul qilinadi" }, { status: 400 });
    }

    let replacements: Replacement[] = [];
    try {
      replacements = JSON.parse(replacementsJson);
    } catch {
      return NextResponse.json({ error: "Almashtirishlar formati noto'g'ri" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new PizZip(buffer);
    let docXml = zip.file("word/document.xml")?.asText() || "";

    // Apply each replacement with context-aware matching
    const appliedPlaceholders: string[] = [];
    const failedReplacements: string[] = [];

    // Extract all paragraphs once
    const pRegex = /<w:p[ >][\s\S]*?<\/w:p>/g;

    for (const r of replacements) {
      const { original, placeholder, context } = r;
      if (!original || !placeholder) continue;

      let applied = false;

      // Strategy 1: Context-aware paragraph matching (most precise)
      if (context) {
        const paragraphs = docXml.match(pRegex) || [];

        for (const para of paragraphs) {
          const paraText = extractParaText(para);

          // Check if this paragraph matches the context
          // Use substring matching since mammoth HTML may slightly differ from raw XML text
          const contextClean = context.replace(/\s+/g, " ").trim();
          const paraClean = paraText.replace(/\s+/g, " ").trim();

          // Context similarity check: the paragraph text should overlap significantly
          const hasContext = paraClean.includes(original) && (
            // If we have meaningful context, check if the paragraph text contains it
            contextClean.length < 10 ||
            paraClean.includes(contextClean) ||
            contextClean.includes(paraClean) ||
            // Fuzzy: check if at least part of the context words appear
            contextClean.split(" ").filter(w => w.length > 3 && paraClean.includes(w)).length >= 2
          );

          if (hasContext) {
            const newPara = replaceInParagraph(para, original, placeholder);
            if (newPara) {
              docXml = docXml.replace(para, newPara);
              applied = true;
              break; // Only replace FIRST match
            }
          }
        }
      }

      // Strategy 2: Direct string match (fallback, only if text is unique enough)
      if (!applied) {
        // Count occurrences
        const count = (docXml.match(new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;

        if (count === 1) {
          // Only one occurrence — safe to replace directly
          docXml = docXml.replace(original, placeholder);
          applied = true;
        } else if (count > 1 && original.length >= 10) {
          // Multiple occurrences but long text — replace all (likely the same entity)
          docXml = docXml.split(original).join(placeholder);
          applied = true;
        } else if (count > 1) {
          // Multiple short occurrences — try paragraph-level fallback
          const paragraphs = docXml.match(pRegex) || [];
          for (const para of paragraphs) {
            const paraText = extractParaText(para);
            if (paraText.includes(original)) {
              const newPara = replaceInParagraph(para, original, placeholder);
              if (newPara) {
                docXml = docXml.replace(para, newPara);
                applied = true;
                break;
              }
            }
          }
        }
      }

      // Strategy 3: Merged-run fallback (for split text)
      if (!applied) {
        const paragraphs = docXml.match(pRegex) || [];
        for (const para of paragraphs) {
          const newPara = replaceInParagraph(para, original, placeholder);
          if (newPara) {
            docXml = docXml.replace(para, newPara);
            applied = true;
            break;
          }
        }
      }

      if (applied) {
        if (!appliedPlaceholders.includes(placeholder)) {
          appliedPlaceholders.push(placeholder);
        }
      } else {
        failedReplacements.push(`${original} → ${placeholder}`);
        console.warn(`Could not apply replacement: "${original}" → "${placeholder}"`);
      }
    }

    // Save modified docx
    zip.file("word/document.xml", docXml);
    const output = zip.generate({ type: "nodebuffer" });

    const templatesDir = path.join(process.cwd(), "documents", "templates");
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }

    const fileName = file.name;
    const filePath = path.join(templatesDir, fileName);
    fs.writeFileSync(filePath, output);

    // Save to database
    const template = await prisma.template.create({
      data: {
        nomi: nomi || fileName.replace(".docx", ""),
        turi: turi || "Boshqa",
        faylNomi: fileName,
        faylHajmi: output.length,
        ozgaruvchilar: JSON.stringify(appliedPlaceholders),
        kimYaratdiId: Number(session.user.id),
        rollar: JSON.stringify(["SUPER_ADMIN", "YURIST"]),
      },
    });

    await logAudit({
      userId: Number(session.user.id),
      amal: `Shablon yaratdi (placeholder belgilash): ${nomi}`,
      turi: "YUKLASH",
      model: "Template",
      modelId: String(template.id),
      ipAddress: getIpFromRequest(req),
    });

    return NextResponse.json({
      id: template.id,
      appliedPlaceholders,
      totalReplacements: replacements.length,
      appliedCount: appliedPlaceholders.length,
      failedReplacements,
    });
  } catch (error: any) {
    console.error("Save with replacements error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
