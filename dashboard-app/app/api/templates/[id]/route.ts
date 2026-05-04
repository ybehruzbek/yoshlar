import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit, getIpFromRequest } from "@/lib/utils/auditLogger";
import fs from "fs";
import path from "path";

// PUT: Update template settings
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const template = await prisma.template.update({
      where: { id: Number(id) },
      data: {
        nomi: body.nomi,
        turi: body.turi,
        rollar: body.rollar ? JSON.stringify(body.rollar) : undefined,
        faol: body.faol,
      },
    });

    await logAudit({
      userId: Number(session.user.id),
      amal: `Shablonni yangiladi: ${template.nomi}`,
      turi: "AMAL",
      model: "Template",
      modelId: String(template.id),
      ipAddress: getIpFromRequest(req),
    });

    return NextResponse.json(template);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a template
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }

    const { id } = await params;
    const template = await prisma.template.findUnique({ where: { id: Number(id) } });
    if (!template) {
      return NextResponse.json({ error: "Shablon topilmadi" }, { status: 404 });
    }

    // Remove file
    const filePath = path.join(process.cwd(), "documents", "templates", template.faylNomi);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from DB
    await prisma.template.delete({ where: { id: Number(id) } });

    await logAudit({
      userId: Number(session.user.id),
      amal: `Shablonni o'chirdi: ${template.nomi}`,
      turi: "AMAL",
      model: "Template",
      modelId: String(id),
      ipAddress: getIpFromRequest(req),
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
