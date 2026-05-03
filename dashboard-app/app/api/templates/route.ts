import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit, getIpFromRequest } from "@/lib/utils/auditLogger";
import PizZip from "pizzip";
import fs from "fs";
import path from "path";

// GET: List all templates (filtered by role)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
    }

    const templates = await prisma.template.findMany({
      where: { faol: true },
      include: { kimYaratdi: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Filter by role
    const role = session.user.role;
    const filtered = templates.filter(t => {
      if (role === "SUPER_ADMIN") return true;
      const rollar: string[] = JSON.parse(t.rollar);
      return rollar.includes(role);
    });

    return NextResponse.json(filtered);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Upload a new template
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const nomi = formData.get("nomi") as string || file.name;
    const turi = formData.get("turi") as string || "boshqa";
    const rollar = formData.get("rollar") as string || '["SUPER_ADMIN","YURIST"]';

    if (!file || !file.name.endsWith(".docx")) {
      return NextResponse.json({ error: "Faqat .docx fayllar qabul qilinadi" }, { status: 400 });
    }

    // Read file
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract placeholders from docx XML
    const zip = new PizZip(buffer);
    const docXml = zip.file("word/document.xml")?.asText() || "";
    const placeholders: string[] = [];
    const regex = /\{\{([^}]+)\}\}/g;
    let match;
    while ((match = regex.exec(docXml)) !== null) {
      if (!placeholders.includes(match[0])) {
        placeholders.push(match[0]);
      }
    }

    // Save file to templates directory
    const templatesDir = path.join(process.cwd(), "documents", "templates");
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }
    const filePath = path.join(templatesDir, file.name);
    fs.writeFileSync(filePath, buffer);

    // Save to database
    const template = await prisma.template.create({
      data: {
        nomi,
        turi,
        faylNomi: file.name,
        faylHajmi: buffer.length,
        ozgaruvchilar: JSON.stringify(placeholders),
        kimYaratdiId: Number(session.user.id),
        rollar,
      },
    });

    await logAudit({
      userId: Number(session.user.id),
      amal: `Shablon yukladi: ${nomi}`,
      turi: "YUKLASH",
      model: "Template",
      modelId: String(template.id),
      ipAddress: getIpFromRequest(req),
    });

    return NextResponse.json({
      ...template,
      ozgaruvchilar: placeholders,
    });
  } catch (error: any) {
    console.error("Template upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
