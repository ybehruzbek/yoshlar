import { prisma } from "../../lib/prisma";
import { DebtorsClient, DebtorItem } from "./DebtorsClient";

export const dynamic = "force-dynamic";

export default async function DebtorsPage() {
  const loans = await prisma.loan.findMany({
    include: {
      debtor: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Group loans by debtor to avoid duplicates
  const debtorMap = new Map<string, DebtorItem>();
  
  for (const loan of loans) {
    const existing = debtorMap.get(loan.debtor.id);
    if (existing) {
      // Aggregate: sum amounts, keep worst status and highest risk
      existing.qarzSummasi += loan.qarzSummasi;
      existing.muddatOtganSumma += loan.muddatOtganSumma;
      existing.riskScore = Math.max(existing.riskScore, loan.riskScore);
      if (loan.status === 'kechikkan' || loan.status === 'sudda') {
        existing.status = loan.status;
      }
      // Show combined loan type
      if (existing.loanType !== loan.loanType) {
        existing.loanType = 'aralash';
      }
    } else {
      debtorMap.set(loan.debtor.id, {
        id: loan.debtor.id,
        fish: loan.debtor.fish,
        telefon: loan.debtor.telefon,
        loanType: loan.loanType,
        qarzSummasi: loan.qarzSummasi,
        muddatOtganSumma: loan.muddatOtganSumma,
        status: loan.status,
        riskScore: loan.riskScore,
        photo: loan.debtor.photo,
      });
    }
  }

  const debtorsData = Array.from(debtorMap.values());

  return <DebtorsClient initialDebtors={debtorsData} totalCount={debtorsData.length} />;
}
