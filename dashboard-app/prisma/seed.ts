import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Super Admin ──
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@yoshlar.uz" },
    update: { passwordHash: adminHash, role: "SUPER_ADMIN" },
    create: {
      email: "admin@yoshlar.uz",
      name: "Sh.M.Anvarov",
      passwordHash: adminHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Super Admin yaratildi:", admin.email);

  // ── Buxgalter ──
  const buxHash = await bcrypt.hash("buxgalter123", 12);
  const buxgalter = await prisma.user.upsert({
    where: { email: "buxgalter@yoshlar.uz" },
    update: { passwordHash: buxHash, role: "BUXGALTER" },
    create: {
      email: "buxgalter@yoshlar.uz",
      name: "Buxgalter",
      passwordHash: buxHash,
      role: "BUXGALTER",
    },
  });
  console.log("✅ Buxgalter yaratildi:", buxgalter.email);

  // ── Yurist ──
  const yuristHash = await bcrypt.hash("yurist123", 12);
  const yurist = await prisma.user.upsert({
    where: { email: "yurist@yoshlar.uz" },
    update: { passwordHash: yuristHash, role: "YURIST" },
    create: {
      email: "yurist@yoshlar.uz",
      name: "Yurist",
      passwordHash: yuristHash,
      role: "YURIST",
    },
  });
  console.log("✅ Yurist yaratildi:", yurist.email);

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
  console.log("   Super Admin: admin@yoshlar.uz / admin123");
  console.log("   Buxgalter:   buxgalter@yoshlar.uz / buxgalter123");
  console.log("   Yurist:      yurist@yoshlar.uz / yurist123");
}

main()
  .catch((e) => {
    console.error("❌ Seed xatolik:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
