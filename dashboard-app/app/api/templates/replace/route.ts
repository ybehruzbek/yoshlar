import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit, getIpFromRequest } from "@/lib/utils/auditLogger";
import PizZip from "pizzip";
import fs from "fs";
import path from "path";

// POST: Replace template file + update metadata
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
    const replaceId = formData.get("replaceId") as string;

    if (!file || !file.name.endsWith(".docx")) {
      return NextResponse.json({ error: "Faqat .docx fayllar qabul qilinadi" }, { status: 400 });
    }

    if (!replaceId) {
      return NextResponse.json({ error: "replaceId majburiy" }, { status: 400 });
    }

    // Find existing template
    const existing = await prisma.template.findUnique({ where: { id: Number(replaceId) } });
    if (!existing) {
      return NextResponse.json({ error: "Shablon topilmadi" }, { status: 404 });
    }

    // Read new file
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract placeholders from new docx
    const zip = new PizZip(buffer);
    const docXml = zip.file("word/document.xml")?.asText() || "";
    
    // Method 1: Direct XML search
    const placeholders: string[] = [];
    const regex = /\{\{([^}]+)\}\}/g;
    let match;
    while ((match = regex.exec(docXml)) !== null) {
      if (!placeholders.includes(match[0])) {
        placeholders.push(match[0]);
      }
    }
    
    // Method 2: Clean text search (handles XML-split placeholders)
    const cleanText = docXml.replace(/<[^>]+>/g, "");
    const regex2 = /\{\{([^}]+)\}\}/g;
    while ((match = regex2.exec(cleanText)) !== null) {
      if (!placeholders.includes(match[0])) {
        placeholders.push(match[0]);
      }
    }

    // Remove old file
    const oldFilePath = path.join(process.cwd(), "documents", "templates", existing.faylNomi);
    if (fs.existsSync(oldFilePath) && existing.faylNomi !== file.name) {
      fs.unlinkSync(oldFilePath);
    }

    // Save new file
    const templatesDir = path.join(process.cwd(), "documents", "templates");
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }
    const newFilePath = path.join(templatesDir, file.name);
    fs.writeFileSync(newFilePath, buffer);

    // Update DB
    const updated = await prisma.template.update({
      where: { id: Number(replaceId) },
      data: {
        nomi: nomi || existing.nomi,
        turi: turi || existing.turi,
        faylNomi: file.name,
        faylHajmi: buffer.length,
        ozgaruvchilar: JSON.stringify(placeholders),
      },
    });

    await logAudit({
      userId: Number(session.user.id),
      amal: `Shablon faylini almashtirdi: ${updated.nomi}`,
      turi: "AMAL",
      model: "Template",
      modelId: String(updated.id),
      ipAddress: getIpFromRequest(req),
    });

    return NextResponse.json({
      ...updated,
      ozgaruvchilar: placeholders,
    });
  } catch (error: any) {
    console.error("Template replace error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
