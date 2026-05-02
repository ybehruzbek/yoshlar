import { prisma } from "../../../lib/prisma";
import { DebtorsClient } from "./DebtorsClient";

export const dynamic = "force-dynamic";

export default async function DebtorsPage() {
  // Only load first batch + total count (fast!)
  const loans = await prisma.loan.findMany({
    include: { 
      debtor: true,
      payments: { select: { summa: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 60,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debtorMap = new Map<number, any>();
  for (const loan of loans) {
    const paidForLoan = loan.payments.reduce((acc, p) => acc + p.summa, 0);
    const existing = debtorMap.get(loan.debtor.id);
    if (existing) {
      existing.qarzSummasi += loan.qarzSummasi;
      existing.tolanganSumma += paidForLoan;
      existing.muddatOtganSumma += loan.muddatOtganSumma;
      existing.riskScore = Math.max(existing.riskScore, loan.riskScore);
      if (loan.status === 'kechikkan' || loan.status === 'sudda') existing.status = loan.status;
      if (existing.loanType !== loan.loanType) existing.loanType = 'aralash';
    } else {
      debtorMap.set(loan.debtor.id, {
        id: loan.debtor.id,
        fish: loan.debtor.fish,
        telefon: loan.debtor.telefon,
        loanType: loan.loanType,
        qarzSummasi: loan.qarzSummasi,
        tolanganSumma: paidForLoan,
        muddatOtganSumma: loan.muddatOtganSumma,
        status: loan.status,
        riskScore: loan.riskScore,
        photo: loan.debtor.photo,
      });
    }
  }

  const initialDebtors = Array.from(debtorMap.values()).slice(0, 20);
  const totalDebtors = await prisma.debtor.count();

  return <DebtorsClient initialDebtors={initialDebtors} totalCount={totalDebtors} />;
}
