import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DebtorProfileClient } from "./DebtorProfileClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DebtorProfilePage({ params }: PageProps) {
  const { id } = await params;

  console.log("DEBUG: Loading profile for ID:", id);
  const debtor = await prisma.debtor.findUnique({
    where: { id },
    include: {
      loans: {
        orderBy: { shartnomaSana: "desc" }
      },
      notes: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  console.log("DEBUG: Debtor found:", debtor ? "YES" : "NO");

  if (!debtor) {
    console.log("DEBUG: Triggering notFound() for ID:", id);
    notFound();
  }


  // Map Prisma data to plain objects for the client component
  const plainDebtor = {
    ...debtor,
    loans: debtor.loans.map(loan => ({
      ...loan,
      shartnomaSana: loan.shartnomaSana?.toISOString() || null,
      holatSanasi: loan.holatSanasi?.toISOString() || null,
      createdAt: loan.createdAt.toISOString(),
      updatedAt: loan.updatedAt.toISOString(),
    })),
    notes: debtor.notes.map(note => ({
      ...note,
      createdAt: note.createdAt.toISOString(),
    })),
    createdAt: debtor.createdAt.toISOString(),
    updatedAt: debtor.updatedAt.toISOString(),
    tugilganSana: debtor.tugilganSana?.toISOString() || null,
  };

  return <DebtorProfileClient debtor={plainDebtor} />;
}
