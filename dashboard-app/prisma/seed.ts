import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@yoshlar.uz" },
    update: {},
    create: {
      email: "admin@yoshlar.uz",
      name: "Admin",
      passwordHash: hash,
      role: "admin",
    },
  });

  console.log("Seed kiritildi. Admin yaratildi:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
