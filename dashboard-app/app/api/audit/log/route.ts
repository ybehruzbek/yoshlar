import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logAudit, getIpFromRequest, getUserAgent } from "@/lib/utils/auditLogger";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    await logAudit({
      userId: session?.user?.id ? Number(session.user.id) : undefined,
      amal: body.amal || "Sahifani ochdi",
      turi: body.turi || "SAHIFA_OCHISH",
      sahifa: body.sahifa || null,
      davomiyligi: body.davomiyligi || null,
      ipAddress: getIpFromRequest(req),
      userAgent: getUserAgent(req),
      meta: body.meta || null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: true }); // Always succeed — don't break client
  }
}
