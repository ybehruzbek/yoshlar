import "dotenv/config";
import { prisma } from "./lib/prisma";

async function test() {
  console.log("Testing connection...");
  try {
    const count = await prisma.debtor.count();
    console.log("Debtor count:", count);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Done.");
  }
}

test();
