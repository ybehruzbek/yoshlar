import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageSkeleton } from "../../components/ui/Skeleton";

export default function Loading() {
  return (
    <DashboardLayout title="KPI">
      <PageSkeleton />
    </DashboardLayout>
  );
}
