import { prisma } from "../lib/prisma";
import { DashboardClient, DashboardProps } from "../components/dashboard/DashboardClient";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export const dynamic = 'force-dynamic';


export default async function DashboardPage() {
  // 1. Fetch basic stats
  const totalDebtors = await prisma.debtor.count();
  const debtors20Years = await prisma.loan.count({ where: { loanType: "20_yil" } });
  const debtors7Years = await prisma.loan.count({ where: { loanType: "7_yil" } });
  
  const loans = await prisma.loan.findMany({
    select: {
      qarzSummasi: true,
      muddatOtganSumma: true,
      status: true,
      riskScore: true,
      payments: {
        select: { summa: true }
      }
    }
  });

  const totalLoanAmount = loans.reduce((acc, l) => acc + l.qarzSummasi, 0);
  const totalPaidAmount = loans.reduce((acc, l) => acc + l.payments.reduce((pacc, p) => pacc + p.summa, 0), 0);
  const totalRemaining = totalLoanAmount - totalPaidAmount;

  const delayedLoans = loans.filter(l => l.status === "kechikkan");
  const delayedCount = delayedLoans.length;
  const delayedAmount = delayedLoans.reduce((acc, l) => acc + l.muddatOtganSumma, 0);

  // 2. This month stats
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const schedulesThisMonth = await prisma.loanSchedule.findMany({
    where: {
      tolovSana: {
        gte: monthStart,
        lte: monthEnd,
      }
    }
  });

  const expectedThisMonth = schedulesThisMonth.reduce((acc, s) => acc + s.jami, 0);
  const paidThisMonth = await prisma.payment.aggregate({
    where: {
      tolovSana: {
        gte: monthStart,
        lte: monthEnd,
      }
    },
    _sum: { summa: true }
  }).then(res => res._sum.summa || 0);

  const remainingThisMonth = expectedThisMonth - paidThisMonth;
  const paymentActivityPct = expectedThisMonth > 0 ? (paidThisMonth / expectedThisMonth) * 100 : 0;

  // 3. Status distribution
  const statusCounts = await prisma.loan.groupBy({
    by: ['status'],
    _count: { _all: true }
  });

  const statusMap: Record<string, { color: string; label: string }> = {
    faol: { color: "#30d158", label: "Faol" },
    kechikkan: { color: "#ff9f0a", label: "Kechikkan" },
    sudda: { color: "#ff453a", label: "Sudda" },
    tolangan: { color: "#0071e3", label: "To'langan" },
  };

  const statusColors: DashboardProps["statusColors"] = {};
  statusCounts.forEach(s => {
    const info = statusMap[s.status as keyof typeof statusMap] || { color: "#8e8e93", label: s.status };
    statusColors[info.label] = {
      color: info.color,
      count: s._count._all,
      pct: (s._count._all / (loans.length || 1)) * 100
    };
  });

  // 4. Monthly payments (Current Year: Jan to Dec)
  const currentYear = now.getFullYear();
  const monthlyPayments: DashboardProps["monthlyPayments"] = [];
  for (let month = 0; month < 12; month++) {
    const start = new Date(currentYear, month, 1);
    const end = endOfMonth(start);

    const bankSum = await prisma.payment.aggregate({
      where: {
        tolovSana: { gte: start, lte: end },
        usul: "bank"
      },
      _sum: { summa: true }
    }).then(res => res._sum.summa || 0);

    const paymeSum = await prisma.payment.aggregate({
      where: {
        tolovSana: { gte: start, lte: end },
        usul: "payme"
      },
      _sum: { summa: true }
    }).then(res => res._sum.summa || 0);

    monthlyPayments.push({ bank: bankSum, payme: paymeSum });
  }


  // 5. Late debtors
  const lateDebtorsRaw = await prisma.loan.findMany({
    where: { status: "kechikkan" },
    orderBy: [
      { muddatOtganSumma: 'desc' },
      { riskScore: 'desc' }
    ],
    take: 5,
    include: { debtor: true }
  });

  const lateDebtors = lateDebtorsRaw.map(l => ({
    name: l.debtor.fish,
    days: Math.floor((now.getTime() - (l.holatSanasi?.getTime() || now.getTime())) / (1000 * 60 * 60 * 24)) || 0,
    sum: l.muddatOtganSumma,
    risk: l.riskScore,
    type: l.loanType === "20_yil" ? "20 yil" : "7 yil"
  }));

  // 6. Upcoming schedules
  const upcomingSchedulesRaw = await prisma.loanSchedule.findMany({
    where: {
      tolovSana: { gte: now },
      tolandi: false
    },
    orderBy: { tolovSana: 'asc' },
    take: 5,
    include: { loan: { include: { debtor: true } } }
  });

  const upcomingSchedules = upcomingSchedulesRaw.map(s => ({
    name: s.loan.debtor.fish,
    sum: s.jami,
    date: format(s.tolovSana, "dd-MMM"),
    tur: s.loan.loanType === "20_yil" ? "20 yil" : "7 yil"
  }));

  const courtActiveCount = loans.filter(l => l.status === "sudda").length;

  const dashboardData: DashboardProps = {
    totalLoanAmount,
    totalRemaining,
    totalDebtors,
    debtors20Years,
    debtors7Years,
    expectedThisMonth,
    paidThisMonth,
    remainingThisMonth,
    delayedCount,
    delayedAmount,
    paymentActivityPct,
    totalPaidPct: totalLoanAmount > 0 ? (totalPaidAmount / totalLoanAmount) * 100 : 0,
    totalPaidAmount,
    courtActiveCount,
    courtActivePct: loans.length > 0 ? (courtActiveCount / loans.length) * 100 : 0,
    monthlyPayments,
    statusColors,
    lateDebtors,
    upcomingSchedules
  };

  return <DashboardClient data={dashboardData} />;
}
