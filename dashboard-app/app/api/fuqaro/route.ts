import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit, getIpFromRequest, getUserAgent } from "@/lib/utils/auditLogger";

export async function POST(req: Request) {
  try {
    const { jshshir } = await req.json();

    if (!jshshir || jshshir.length < 10) {
      return NextResponse.json({ error: "JSHSHIR noto'g'ri formatda" }, { status: 400 });
    }

    // Log the search
    await logAudit({
      amal: `Fuqaro qidirdi: ${jshshir.substring(0, 4)}****`,
      turi: "FUQARO_QIDIRUV",
      ipAddress: getIpFromRequest(req),
      userAgent: getUserAgent(req),
      meta: { jshshir: jshshir.substring(0, 4) + "****" },
    });

    const debtor = await prisma.debtor.findUnique({
      where: { jshshir },
      include: {
        loans: {
          include: {
            payments: {
              orderBy: { tolovSana: "desc" },
            },
          },
        },
      },
    });

    if (!debtor) {
      return NextResponse.json({ error: "Ma'lumot topilmadi" }, { status: 404 });
    }

    // Return sanitized read-only data
    const result = {
      fish: debtor.fish,
      manzil: debtor.manzil || "—",
      telefon: debtor.telefon ? debtor.telefon.replace(/.{4}$/, "****") : "—",
      loans: debtor.loans.map(loan => {
        const totalPaid = loan.payments.reduce((s, p) => s + p.summa, 0);
        const qoldiq = Math.max(0, loan.qarzSummasi - totalPaid);
        return {
          turi: loan.loanType === "20_yil" ? "20 yillik" : "7 yillik",
          qarzSummasi: loan.qarzSummasi,
          tolanganSumma: totalPaid,
          qoldiq,
          holat: loan.status,
          shartnomaSana: loan.shartnomaSana,
          tolovlar: loan.payments.map(p => ({
            summa: p.summa,
            sana: p.tolovSana,
            usul: p.usul,
          })),
        };
      }),
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Fuqaro API error:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
