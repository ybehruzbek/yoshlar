import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL || "file:./dev.db";
const db = new Database(url);
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });



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
