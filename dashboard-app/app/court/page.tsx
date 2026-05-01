import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function CourtPage() {
  return (
    <DashboardLayout title="Sud bo'limi">
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Sud jarayonidagi ishlar</div>
            <div className="card-sub">Ushbu sahifa tez kunda to'liq ishga tushadi</div>
          </div>
        </div>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
          Sudga o'tkazilgan ishlar ro'yxati va ularning statuslarini boshqarish bo'limi.
        </div>
      </div>
    </DashboardLayout>
  );
}
