"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export async function deleteDebtor(id: number) {
  try {
    await prisma.debtor.delete({
      where: { id }
    });
    revalidatePath("/debtors");
    return { success: true };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAllDebtors() {
  try {
    // Delete all debtors - cascading will handle loans/notes
    await prisma.debtor.deleteMany();
    
    revalidatePath("/debtors");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Delete all error:", error);
    return { success: false, error: error.message };
  }
}
