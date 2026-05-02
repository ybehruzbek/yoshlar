import { DashboardLayout } from "../components/layout/DashboardLayout";
import { DashboardSkeleton } from "../components/ui/Skeleton";

export default function Loading() {
  return (
    <DashboardLayout title="Bosh sahifa">
      <DashboardSkeleton />
    </DashboardLayout>
  );
}
