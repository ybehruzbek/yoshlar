import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function DebtorsPage() {
  return (
    <DashboardLayout title="Qarzdorlar">
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Qarzdorlar ro'yxati</div>
            <div className="card-sub">Ushbu sahifa tez kunda to'liq ishga tushadi</div>
          </div>
        </div>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
          Qarzdorlar ro'yxati va ularni boshqarish vositalari shu yerda joylashadi.
        </div>
      </div>
    </DashboardLayout>
  );
}
