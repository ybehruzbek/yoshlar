import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
    }

    const documents = await prisma.document.findMany({
      include: {
        kimYaratdi: { select: { name: true } },
        shablon: { select: { nomi: true, turi: true } },
        loan: {
          include: {
            debtor: { select: { fish: true, jshshir: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 100, // Show last 100 docs
    });

    return NextResponse.json(documents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
