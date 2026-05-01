import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import { subDays, addDays, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";

const url = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });




async function main() {
  console.log("Seeding debtors and loans...");

  // 1. Create some Debtors
  const debtors = [];
  for (let i = 1; i <= 20; i++) {
    const debtor = await prisma.debtor.create({
      data: {
        fish: `Qarzdor ${i} F.I.O`,
        pasport: `AB${1000000 + i}`,
        jshshir: `1234567890${1000 + i}`,
        manzil: `Toshkent sh., ${i}-mavze`,
        telefon: `+9989012345${i.toString().padStart(2, '0')}`,
      }
    });
    debtors.push(debtor);
  }

  // 2. Create Loans for each debtor
  for (const debtor of debtors) {
    const is20Years = Math.random() > 0.3;
    const qarzSummasi = is20Years ? 33000000 : 45000000;
    const loan = await prisma.loan.create({
      data: {
        debtorId: debtor.id,
        loanType: is20Years ? "20_yil" : "7_yil",
        qarzSummasi,
        oylikTolov: is20Years ? 290000 : 780000,
        status: Math.random() > 0.8 ? "kechikkan" : (Math.random() > 0.95 ? "sudda" : "faol"),
        muddatOtganSumma: Math.random() > 0.8 ? Math.random() * 5000000 : 0,
        riskScore: Math.floor(Math.random() * 100),
        shartnomaSana: subDays(new Date(), Math.floor(Math.random() * 365)),
      }
    });

    // 3. Create Schedules for each loan (just some)
    for (let m = -5; m <= 5; m++) {
      const tolovSana = addDays(startOfMonth(addDays(new Date(), m * 30)), 15);
      await prisma.loanSchedule.create({
        data: {
          loanId: loan.id,
          oyRaqam: m + 6,
          tolovSana,
          asosiy: (loan.oylikTolov || 0) * 0.8,
          foiz: (loan.oylikTolov || 0) * 0.2,
          jami: loan.oylikTolov || 0,
          qoldiq: loan.qarzSummasi - ((m + 6) * (loan.oylikTolov || 0)),
          tolandi: m < 0,
        }
      });
    }

    // 4. Create some Payments
    if (Math.random() > 0.2) {
      await prisma.payment.create({
        data: {
          loanId: loan.id,
          summa: loan.oylikTolov || 300000,
          tolovSana: subDays(new Date(), Math.floor(Math.random() * 30)),
          usul: Math.random() > 0.5 ? "bank" : "payme",
          maqsad: "Kredit tolovi",
        }
      });
    }
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
