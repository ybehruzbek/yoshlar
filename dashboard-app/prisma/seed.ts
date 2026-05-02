import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Admin foydalanuvchi ──
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@yoshlar.uz" },
    update: { passwordHash: adminHash },
    create: {
      email: "admin@yoshlar.uz",
      name: "Sh.M.Anvarov",
      passwordHash: adminHash,
      role: "admin",
    },
  });
  console.log("✅ Admin yaratildi:", admin.email);

  // ── Operator foydalanuvchi ──
  const operatorHash = await bcrypt.hash("operator123", 12);
  const operator = await prisma.user.upsert({
    where: { email: "operator@yoshlar.uz" },
    update: { passwordHash: operatorHash },
    create: {
      email: "operator@yoshlar.uz",
      name: "Operator",
      passwordHash: operatorHash,
      role: "operator",
    },
  });
  console.log("✅ Operator yaratildi:", operator.email);

  // ── Jarima sozlamalari ──
  await prisma.penaltySetting.upsert({
    where: { loanType: "7_yil" },
    update: {},
    create: {
      loanType: "7_yil",
      stavkaYillik: 0.12,
      faol: true,
    },
  });

  await prisma.penaltySetting.upsert({
    where: { loanType: "20_yil" },
    update: {},
    create: {
      loanType: "20_yil",
      stavkaYillik: 0,
      faol: false,
    },
  });
  console.log("✅ Jarima sozlamalari yaratildi");

  console.log("\n📋 Login ma'lumotlari:");
  console.log("   Admin:    admin@yoshlar.uz / admin123");
  console.log("   Operator: operator@yoshlar.uz / operator123");
}

main()
  .catch((e) => {
    console.error("❌ Seed xatolik:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
