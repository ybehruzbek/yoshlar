import { prisma } from "./lib/prisma";

async function check() {
  const debtors = await prisma.debtor.findMany({
    take: 5,
    select: { id: true, fish: true }
  });
  console.log("Debtors in DB:", JSON.stringify(debtors, null, 2));
}

check();
