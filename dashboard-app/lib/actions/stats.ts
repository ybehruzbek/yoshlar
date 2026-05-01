"use server";

import { prisma } from "../prisma";

export async function getSidebarStats() {
  try {
    const [debtorCount, courtCount] = await Promise.all([
      prisma.debtor.count(),
      prisma.loan.count({ where: { status: "sudda" } }),
    ]);

    return {
      debtorCount,
      courtCount,
    };
  } catch (error) {
    console.error("Sidebar stats error:", error);
    return { debtorCount: 0, courtCount: 0 };
  }
}
