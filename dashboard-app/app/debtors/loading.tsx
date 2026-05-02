import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { DebtorsSkeleton } from "../../components/ui/Skeleton";

export default function Loading() {
  return (
    <DashboardLayout title="Qarzdorlar">
      <DebtorsSkeleton />
    </DashboardLayout>
  );
}
