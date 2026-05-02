"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export async function addPayment(data: {
  loanId: number;
  summa: number;
  tolovSana: string;
  usul: string;
  maqsad?: string;
  kimKiritdi?: string;
}) {
  try {
    const payment = await prisma.payment.create({
      data: {
        loanId: data.loanId,
        summa: data.summa,
        tolovSana: new Date(data.tolovSana),
        usul: data.usul,
        maqsad: data.maqsad,
        kimKiritdi: data.kimKiritdi || "Operator",
      },
    });

    // Revalidate the debtors path to update the UI
    revalidatePath(`/debtors`);
    revalidatePath(`/debtors/${data.loanId}`); // Assuming route uses debtor ID, not loan ID, but we invalidate both just in case

    return { success: true, payment };
  } catch (error: any) {
    console.error("Error adding payment:", error);
    return { success: false, error: error.message };
  }
}
