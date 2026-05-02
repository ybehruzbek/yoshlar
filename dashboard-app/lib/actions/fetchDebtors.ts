"use server";

import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

const PAGE_SIZE = 20;

interface FetchDebtorsParams {
  page: number;
  search?: string;
  status?: string;
  type?: string;
}

export async function fetchDebtorsPaginated({ page, search, status, type }: FetchDebtorsParams) {
  const where: Prisma.LoanWhereInput = {};

  // Status filter
  if (status && status !== "Barchasi") {
    const statusMap: Record<string, string> = {
      "Faol": "faol",
      "Kechikkan": "kechikkan", 
      "Sudda": "sudda",
      "Tolangan": "tolangan",
    };
    where.status = statusMap[status] || status.toLowerCase();
  }

  // Type filter
  if (type && type !== "Barchasi") {
    where.loanType = type === "20 yillik" ? "20_yil" : "7_yil";
  }

  // Search filter
  if (search && search.trim()) {
    where.debtor = {
      OR: [
        { fish: { contains: search.trim() } },
        { telefon: { contains: search.trim() } },
        { jshshir: { contains: search.trim() } },
      ]
    };
  }

  // Get total count for the filters
  const totalLoans = await prisma.loan.count({ where });

  // Fetch loans with pagination
  const loans = await prisma.loan.findMany({
    where,
    include: { 
      debtor: true,
      payments: { select: { summa: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE * 3,
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
      if (loan.status === 'kechikkan' || loan.status === 'sudda') {
        existing.status = loan.status;
      }
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
        tolanganSumma: paidForLoan,
        muddatOtganSumma: loan.muddatOtganSumma,
        status: loan.status,
        riskScore: loan.riskScore,
        photo: loan.debtor.photo,
      });
    }
  }

  const items = Array.from(debtorMap.values()).slice(0, PAGE_SIZE);

  // Get total unique debtors count
  const totalDebtors = await prisma.debtor.count();

  return {
    items,
    totalDebtors,
    hasMore: items.length === PAGE_SIZE,
    page,
  };
}
