import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit, getIpFromRequest } from "@/lib/utils/auditLogger";
import bcrypt from "bcryptjs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.password) updateData.passwordHash = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    await logAudit({
      userId: Number(session.user.id),
      amal: `Foydalanuvchini yangiladi: ${user.email}`,
      turi: "AMAL",
      model: "User",
      modelId: String(id),
      yangiQiymat: { role: body.role, isActive: body.isActive },
      ipAddress: getIpFromRequest(req),
    });

    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
