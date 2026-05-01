import { prisma } from "../../lib/prisma";
import { DebtorsClient, DebtorItem } from "./DebtorsClient";

export const forceDynamic = "force-dynamic";

export default async function DebtorsPage() {
  const loans = await prisma.loan.findMany({
    include: {
      debtor: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const debtorsData: DebtorItem[] = loans.map(loan => ({
    id: loan.debtor.id, // Fixed: use debtor id, not loan id
    fish: loan.debtor.fish,
    telefon: loan.debtor.telefon,
    loanType: loan.loanType,
    qarzSummasi: loan.qarzSummasi,
    muddatOtganSumma: loan.muddatOtganSumma,
    status: loan.status,
    riskScore: loan.riskScore,
    photo: loan.debtor.photo
  }));


  return <DebtorsClient initialDebtors={debtorsData} totalCount={debtorsData.length} />;
}
